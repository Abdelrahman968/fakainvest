from enum import Enum
from pydantic import BaseModel, Field, UUID4
from typing import Optional

class RoundUpMode(str, Enum):
    NONE = "None"
    ECO = "Eco"
    BOOST = "Boost"
    FIXED20 = "Fixed20"
    CUSTOM = "Custom"

class RoundUpCalculationRequest(BaseModel):
    amount: float = Field(..., gt=0, description="The original purchase amount")
    mode: RoundUpMode
    custom_amount: Optional[float] = None

class RoundUpResult(BaseModel):
    original_amount: float
    rounded_amount: float
    round_up_amount: float
    mode: RoundUpMode

class ExecuteRoundUpRequest(BaseModel):
    source_wallet_id: UUID4
    savings_wallet_id: UUID4
    purchase_amount: float = Field(..., gt=0)
    mode: RoundUpMode
    custom_amount: Optional[float] = None
    idempotency_key: str
