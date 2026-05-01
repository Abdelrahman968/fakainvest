# FakaInvest Core API Documentation (v1)

This document outlines the RESTful endpoints available in the new Python FastAPI backend for FakaInvest. 

**Base URL:** `http://localhost:8000/api/v1`

---

## 1. Wallets

### 1.1 Create Wallet
Creates a new financial Wallet constraint to the user's ID.

*   **Endpoint**: `POST /wallets/`
*   **Request Body**:
    ```json
    {
      "user_id": "uuid-string",
      "currency": "EGP"
    }
    ```
*   **Response**: `200 OK`
    ```json
    {
      "currency": "EGP",
      "id": "new-wallet-uuid",
      "user_id": "uuid-string",
      "created_at": "2026-04-30T10:00:00Z"
    }
    ```

### 1.2 Get Wallet Balance
Calculates the live, 100% accurate wallet balance by securely aggregating all transaction ledger entries for this wallet.

*   **Endpoint**: `GET /wallets/{wallet_id}/balance`
*   **Response**: `200 OK`
    ```json
    {
      "wallet_id": "uuid-string",
      "balance": 1500.50,
      "currency": "EGP"
    }
    ```

---

## 2. Transactions (Double-Entry Ledger)

### 2.1 Transfer Funds
Execution of a strict ACID compliant, double-entry ledger fund transfer between a source wallet and a destination wallet. 

*   **Endpoint**: `POST /transactions/transfer`
*   **Request Body**:
    ```json
    {
      "source_wallet_id": "uuid-sender",
      "destination_wallet_id": "uuid-receiver",
      "amount": 50.0,
      "transaction_type": "TRANSFER",
      "description": "Funding investment portfolio",
      "idempotency_key": "unique-client-generated-key-123"
    }
    ```
*   **Response**: `200 OK`
    ```json
    {
      "status": "success",
      "transaction_group_id": "uuid-group-mapping-debit-credit",
      "amount": 50.0
    }
    ```
*   **Errors**:
    *   `400 Bad Request`: "Insufficient funds" (If source wallet has balance < amount)
    *   `404 Not Found`: "Source/Destination wallet not found"

---

## 3. Round-Up Engine

### 3.1 Calculate Round-Up
A utility endpoint to purely calculate the fractional change on a given purchase. (Does not write to DB).

*   **Endpoint**: `POST /roundups/calculate`
*   **Request Body**:
    ```json
    {
      "amount": 82.50,
      "mode": "Eco", 
      "custom_amount": null
    }
    ```
*   **Response**: `200 OK`
    ```json
    {
      "original_amount": 82.50,
      "rounded_amount": 85.00,
      "round_up_amount": 2.50,
      "mode": "Eco"
    }
    ```

### 3.2 Execute Round-Up Transfer
Automatically calculates the round-up delta from a purchase price, and explicitly triggers a ledger transfer moving the spare change into the designated savings wallet.

*   **Endpoint**: `POST /roundups/execute`
*   **Request Body**:
    ```json
    {
      "source_wallet_id": "uuid-spending-wallet",
      "savings_wallet_id": "uuid-savings-wallet",
      "purchase_amount": 82.50,
      "mode": "Eco",
      "idempotency_key": "unique-purchase-id-456"
    }
    ```
*   **Response**: `200 OK`
    ```json
    {
      "status": "success",
      "transaction_group_id": "uuid-group-mapping-debit-credit",
      "amount": 2.50
    }
    ```
