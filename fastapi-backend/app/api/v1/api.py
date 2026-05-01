from fastapi import APIRouter
from app.api.v1.endpoints import wallets, transactions, roundups

api_router = APIRouter()

api_router.include_router(wallets.router, prefix="/wallets", tags=["wallets"])
api_router.include_router(transactions.router, prefix="/transactions", tags=["transactions"])
api_router.include_router(roundups.router, prefix="/roundups", tags=["roundups"])
