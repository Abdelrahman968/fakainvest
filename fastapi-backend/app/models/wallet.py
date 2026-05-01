import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy import Uuid as UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class Wallet(Base):
    __tablename__ = "wallets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    
    # E.g., 'EGP', 'USD' (FakaInvest is mainly EGP)
    currency = Column(String(3), default="EGP", nullable=False)
    
    # Note: As per architecture docs, absolute balance is NOT stored statically. 
    # It is derived from the immutable transaction ledger.
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="wallets")
    transactions = relationship("TransactionEntry", back_populates="wallet")
