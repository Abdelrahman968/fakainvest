import uuid
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.transaction import TransactionEntry, TransactionType
from app.schemas.transaction import FundTransferRequest
from app.services.wallet_service import get_wallet_balance, get_wallet

async def execute_fund_transfer(db: AsyncSession, transfer_req: FundTransferRequest):
    # 1. Idempotency Check
    stmt = select(TransactionEntry).where(TransactionEntry.idempotency_key == transfer_req.idempotency_key)
    result = await db.execute(stmt)
    existing_tx = result.scalars().first()
    
    if existing_tx:
        # If the request was already processed, return gracefully to prevent double charging
        return {"status": "success", "message": "Transaction already processed", "transaction_group_id": existing_tx.transaction_group_id}

    # 2. Validate Wallets Exist
    source_wallet = await get_wallet(db, transfer_req.source_wallet_id)
    if not source_wallet:
        raise HTTPException(status_code=404, detail="Source wallet not found")
        
    dest_wallet = await get_wallet(db, transfer_req.destination_wallet_id)
    if not dest_wallet:
        raise HTTPException(status_code=404, detail="Destination wallet not found")

    # 3. Check Sufficient Funds
    current_balance = await get_wallet_balance(db, transfer_req.source_wallet_id)
    if current_balance < transfer_req.amount:
        raise HTTPException(status_code=400, detail="Insufficient funds")

    # 4. Execute Double-Entry Ledger Transaction
    group_id = uuid.uuid4()
    
    try:
        # Create Debit Entry (Source Wallet)
        debit_entry = TransactionEntry(
            wallet_id=transfer_req.source_wallet_id,
            transaction_group_id=group_id,
            amount=-abs(transfer_req.amount),  # Money out is negative
            transaction_type=transfer_req.transaction_type,
            description=transfer_req.description,
            idempotency_key=transfer_req.idempotency_key
        )
        db.add(debit_entry)

        # Create Credit Entry (Destination Wallet)
        credit_entry = TransactionEntry(
            wallet_id=transfer_req.destination_wallet_id,
            transaction_group_id=group_id,
            amount=abs(transfer_req.amount),  # Money in is positive
            transaction_type=transfer_req.transaction_type,
            description=transfer_req.description,
            # To preserve uniqueness constraint, only one side needs the true idempotency key,
            # or we append a suffix for the remote leg.
            idempotency_key=f"{transfer_req.idempotency_key}-credit" if transfer_req.idempotency_key else None
        )
        db.add(credit_entry)

        await db.commit()
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error during transaction processing")

    return {
        "status": "success", 
        "transaction_group_id": group_id,
        "amount": transfer_req.amount
    }
