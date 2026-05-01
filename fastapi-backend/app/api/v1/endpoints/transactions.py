from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_db_session
from app.schemas.transaction import FundTransferRequest
from app.services import transaction_service

router = APIRouter()

@router.post("/transfer")
async def transfer_funds(transfer_req: FundTransferRequest, db: AsyncSession = Depends(get_db_session)):
    """
    Safely transfers funds between two wallets using double-entry accounting.
    """
    return await transaction_service.execute_fund_transfer(db, transfer_req)
