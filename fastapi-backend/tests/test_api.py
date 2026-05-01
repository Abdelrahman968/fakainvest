import pytest
import uuid
import asgi_lifespan

@pytest.mark.asyncio
async def test_health_check(async_client):
    response = await async_client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "FakaInvest Core API is running"}

@pytest.mark.asyncio
async def test_create_wallet_and_check_balance(async_client):
    user_id = str(uuid.uuid4())
    
    # Create Wallet
    wallet_data = {"user_id": user_id, "currency": "EGP"}
    create_response = await async_client.post("/api/v1/wallets/", json=wallet_data)
    assert create_response.status_code == 200
    wallet = create_response.json()
    assert wallet["currency"] == "EGP"
    assert "id" in wallet
    
    wallet_id = wallet["id"]
    
    # Check Balance Default 0
    balance_response = await async_client.get(f"/api/v1/wallets/{wallet_id}/balance")
    assert balance_response.status_code == 200
    assert balance_response.json()["balance"] == 0.0

@pytest.mark.asyncio
async def test_wallet_transfer(async_client):
    user1_id = str(uuid.uuid4())
    user2_id = str(uuid.uuid4())
    
    # Create Sender Wallet
    w1_res = await async_client.post("/api/v1/wallets/", json={"user_id": user1_id, "currency": "EGP"})
    w1_id = w1_res.json()["id"]

    # Create Receiver Wallet
    w2_res = await async_client.post("/api/v1/wallets/", json={"user_id": user2_id, "currency": "EGP"})
    w2_id = w2_res.json()["id"]

    # In our secure system, you can't transfer from w1 if balance is 0.
    # Currently we enforce this with an exception if insufficient funds.
    transfer_req = {
        "source_wallet_id": w1_id,
        "destination_wallet_id": w2_id,
        "amount": 50.0,
        "transaction_type": "TRANSFER",
        "description": "Test Transfer",
        "idempotency_key": str(uuid.uuid4())
    }
    
    # This should fail due to insufficient funds
    transfer_res = await async_client.post("/api/v1/transactions/transfer", json=transfer_req)
    assert transfer_res.status_code == 400
    assert transfer_res.json()["detail"] == "Insufficient funds"
