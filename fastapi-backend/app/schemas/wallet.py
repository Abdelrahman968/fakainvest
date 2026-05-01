from pydantic import BaseModel, UUID4
from typing import Optional
from datetime import datetime

class WalletBase(BaseModel):
    currency: str = "EGP"

class WalletCreate(WalletBase):
    user_id: UUID4

class WalletResponse(WalletBase):
    id: UUID4
    user_id: UUID4
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class WalletBalanceResponse(BaseModel):
    wallet_id: UUID4
    balance: float
    currency: str
