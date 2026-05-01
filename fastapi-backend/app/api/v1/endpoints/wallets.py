from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.api.dependencies import get_db_session
from app.schemas.wallet import WalletCreate, WalletResponse, WalletBalanceResponse
from app.services import wallet_service

router = APIRouter()

@router.post("/", response_model=WalletResponse)
async def create_wallet(wallet_in: WalletCreate, db: AsyncSession = Depends(get_db_session)):
    return await wallet_service.create_wallet(db, wallet_in)

@router.get("/{wallet_id}/balance", response_model=WalletBalanceResponse)
async def get_balance(wallet_id: UUID, db: AsyncSession = Depends(get_db_session)):
    wallet = await wallet_service.get_wallet(db, wallet_id)
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
        
    balance = await wallet_service.get_wallet_balance(db, wallet_id)
    return {
        "wallet_id": wallet_id,
        "balance": balance,
        "currency": wallet.currency
    }
