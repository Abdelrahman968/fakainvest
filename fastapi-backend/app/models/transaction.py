import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Numeric, Enum
from sqlalchemy import Uuid as UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.db.base_class import Base

class TransactionType(str, enum.Enum):
    DEPOSIT = "DEPOSIT"
    WITHDRAWAL = "WITHDRAWAL"
    TRANSFER = "TRANSFER"
    ROUND_UP = "ROUND_UP"

class TransactionEntry(Base):
    """
    Immutable ledger entry.
    Every financial movement should generate at least one entry.
    Transfers or Round-Ups will generate matching debit/credit entries sharing a transaction_group_id.
    """
    __tablename__ = "transaction_entries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    wallet_id = Column(UUID(as_uuid=True), ForeignKey("wallets.id"), nullable=False, index=True)
    
    # A UUID to group double-entry accounting records (e.g., matching debit & credit)
    transaction_group_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Positive amount = Credit (Money in), Negative amount = Debit (Money out)
    amount = Column(Numeric(precision=12, scale=2), nullable=False)
    
    transaction_type = Column(Enum(TransactionType), nullable=False)
    description = Column(String, nullable=True)
    
    # An idempotency key provided by the front-end to prevent double processing
    idempotency_key = Column(String, unique=True, index=True, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    wallet = relationship("Wallet", back_populates="transactions")
