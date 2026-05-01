import math
from app.schemas.roundup import RoundUpMode, RoundUpResult

def calculate_round_up(amount: float, mode: RoundUpMode, custom_amount: float = None) -> RoundUpResult:
    if mode == RoundUpMode.NONE:
        return RoundUpResult(
            original_amount=amount,
            rounded_amount=amount,
            round_up_amount=0.0,
            mode=mode
        )

    round_up_amount = 0.0
    rounded_amount = amount

    if mode == RoundUpMode.ECO:
        # Round up to the nearest 5
        rounded_amount = math.ceil(amount / 5.0) * 5.0
        round_up_amount = rounded_amount - amount
    elif mode == RoundUpMode.BOOST:
        # Round up to the nearest 10
        rounded_amount = math.ceil(amount / 10.0) * 10.0
        round_up_amount = rounded_amount - amount
    elif mode == RoundUpMode.FIXED20:
        round_up_amount = 20.0
        rounded_amount = amount + 20.0
    elif mode == RoundUpMode.CUSTOM:
        fixed_amount = custom_amount if custom_amount is not None else 10.0
        round_up_amount = fixed_amount
        rounded_amount = amount + fixed_amount

    return RoundUpResult(
        original_amount=amount,
        rounded_amount=rounded_amount,
        round_up_amount=round_up_amount,
        mode=mode
    )

def get_round_up_description(mode: RoundUpMode, custom_amount: float = None) -> str:
    if mode == RoundUpMode.NONE:
        return "RoundUp is disabled"
    elif mode == RoundUpMode.ECO:
        return "Round up to nearest 5 EGP"
    elif mode == RoundUpMode.BOOST:
        return "Round up to nearest 10 EGP"
    elif mode == RoundUpMode.FIXED20:
        return "Add fixed 20 EGP per transaction"
    elif mode == RoundUpMode.CUSTOM:
        return f"Add fixed {custom_amount or 10} EGP per transaction"
    return "Unknown mode"
