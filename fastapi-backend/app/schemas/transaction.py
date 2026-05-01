from pydantic import BaseModel, UUID4, Field
from typing import Optional
from datetime import datetime
from app.models.transaction import TransactionType

class TransactionBase(BaseModel):
    amount: float = Field(..., description="Positive for credit, negative for debit")
    transaction_type: TransactionType
    description: Optional[str] = None
    idempotency_key: Optional[str] = None

class TransactionCreate(TransactionBase):
    wallet_id: UUID4
    transaction_group_id: UUID4

class TransactionResponse(TransactionBase):
    id: UUID4
    wallet_id: UUID4
    transaction_group_id: UUID4
    created_at: datetime

    class Config:
        from_attributes = True

class FundTransferRequest(BaseModel):
    source_wallet_id: UUID4
    destination_wallet_id: UUID4
    amount: float = Field(..., gt=0, description="Amount must be positive")
    transaction_type: TransactionType = TransactionType.TRANSFER
    description: Optional[str] = None
    idempotency_key: str
