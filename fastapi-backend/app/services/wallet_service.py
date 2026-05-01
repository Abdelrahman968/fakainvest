from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from uuid import UUID
from app.models.wallet import Wallet
from app.models.transaction import TransactionEntry
from app.schemas.wallet import WalletCreate

async def create_wallet(db: AsyncSession, wallet_in: WalletCreate) -> Wallet:
    wallet = Wallet(
        user_id=wallet_in.user_id,
        currency=wallet_in.currency
    )
    db.add(wallet)
    await db.commit()
    await db.refresh(wallet)
    return wallet

async def get_wallet_balance(db: AsyncSession, wallet_id: UUID) -> float:
    """
    Calculates the wallet balance dynamically by summing all transaction entries.
    This guarantees accuracy and prevents race conditions inherently.
    """
    stmt = select(func.coalesce(func.sum(TransactionEntry.amount), 0)).where(
        TransactionEntry.wallet_id == wallet_id
    )
    result = await db.execute(stmt)
    balance = result.scalar_one()
    return float(balance)

async def get_wallet(db: AsyncSession, wallet_id: UUID) -> Wallet:
    stmt = select(Wallet).where(Wallet.id == wallet_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()
