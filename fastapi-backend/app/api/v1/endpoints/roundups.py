from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.dependencies import get_db_session
from app.schemas.roundup import RoundUpCalculationRequest, RoundUpResult, ExecuteRoundUpRequest
from app.services.roundup_service import calculate_round_up
from app.services.transaction_service import execute_fund_transfer
from app.schemas.transaction import FundTransferRequest
from app.models.transaction import TransactionType

router = APIRouter()

@router.post("/calculate", response_model=RoundUpResult)
async def calculate_roundup_endpoint(request: RoundUpCalculationRequest):
    """
    Given a purchase amount and user's round-up mode, calculate how much should be saved.
    This acts as a utility endpoint for the frontend.
    """
    return calculate_round_up(
        amount=request.amount,
        mode=request.mode,
        custom_amount=request.custom_amount
    )

@router.post("/execute")
async def execute_roundup_endpoint(request: ExecuteRoundUpRequest, db: AsyncSession = Depends(get_db_session)):
    """
    Calculates the round-up amount derived from a purchase and safely transfers 
    that spare change from the user's source wallet to their savings wallet.
    """
    calc_result = calculate_round_up(
        amount=request.purchase_amount,
        mode=request.mode,
        custom_amount=request.custom_amount
    )
    
    if calc_result.round_up_amount <= 0:
        return {"status": "skipped", "message": "No round-up amount generated for this transaction"}

    # Formulate a transfer request using the core engine's double-entry system
    transfer_req = FundTransferRequest(
        source_wallet_id=request.source_wallet_id,
        destination_wallet_id=request.savings_wallet_id,
        amount=calc_result.round_up_amount,
        transaction_type=TransactionType.ROUND_UP,
        description=f"Round-up fraction for purchase of {request.purchase_amount} (Mode: {request.mode})",
        idempotency_key=request.idempotency_key
    )

    # Re-use our robust, ACID-compliant ledger transfer function
    return await execute_fund_transfer(db, transfer_req)
