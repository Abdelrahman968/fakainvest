# Frontend / Backend Compatibility & Data Workflow

This document reviews the integration points between the existing Next.js frontend models and the newly designed Python FastAPI PostgreSQL engine. It establishes how data behaves and where records are physically stored.

---

## 1. System Compatibility & Mapping Gaps

There is a deliberate structural shift between the Next.js MVP prototype and the Enterprise-grade FastAPI backend.

### The Backend Enforces Strict UUIDs
*   **Frontend Reality**: Next.js (`mongoose`) naturally uses 24-character hex strings (`ObjectId`) for IDs. 
*   **Backend Reality**: The FastAPI core uses strictly validated `UUID4` formats for Wallets and Users.
*   **Bridging the Gap**:
    *   The `User` table on FastAPI contains an `external_id` column. When a user creates an account on Next.js, the frontend should sync the `ObjectId` into the FastAPI `external_id` column. 
    *   To fix UUID mismatches on endpoints, the FastAPI server acts as the source of truth for all financial UUIDs (e.g., `wallet_id`).

### Wallet Interfaces (`Wallet.types.ts` vs `app/schemas/wallet.py`)
*   **Frontend**: Has `spent_today`, `balance` directly, limits, frozen status, etc.
*   **Backend**: Has `User -> Wallet -> Transactions` and calculates `balance` on the fly. 
*   **The Workflow**: 
    1.  The frontend calls `GET /api/v1/wallets/{wallet_id}/balance`.
    2.  The FastAPI backend dynamically sums the transactions.
    3.  For metadata like "frozen" or "card limits", these are configuration settings that remain perfect for Next.js and MongoDB to handle. The financial Ledger strictly handles the truth of the money.

### Transaction Interfaces (`types/transaction.ts` vs `app/models/transaction.py`)
*   **Frontend**: Has `merchant`, `category`, `roundUp` and expects an abstract single `Transaction` object. 
*   **Backend**: Employs a **Double-Entry Ledger**, meaning a 50 EGP transfer is stored as TWO rows -> a `-50.00` Debit, and a `+50.00` Credit. They share a `transaction_group_id`.
*   **The Workflow**: 
    *   When the frontend fetches history to display, it needs to hit a new FastAPI reporting endpoint (to-be built when needed) that aggregates the double entries into user-friendly single records. The `description` field natively holds the metadata (e.g., "Round-up fraction for purchase of 82.50").

---

## 2. Where is the Round-Up History Stored?

In the FastAPI architecture, Round-Up events do **not** have their own isolated table. By strictly adhering to financial mechanics, **Round-Ups are categorized as standard financial transactions** marked by an Enum: `transaction_type = 'ROUND_UP'`.

### The Data Storage Lifecycle
1.  **The Trigger**: A user makes an 82.50 EGP purchase in the real world (simulated in the app). The Next.js frontend pings FastAPI's `POST /api/v1/roundups/execute` endpoint.
2.  **The Calculation**: The backend assesses the user is on the `Eco` mode. It determines `85.00` is the target, making the delta `2.50 EGP`.
3.  **The Ledger Record (The Storage)**: Wait, where is the record stored? It is directly inserted into the `transaction_entries` PostgreSQL table as a pair!
    *   **Row 1**: `-2.50 EGP` (Debit) on the user's Main Spending Wallet.
    *   **Row 2**: `+2.50 EGP` (Credit) on the user's Investment/Savings Wallet.
    *   *(Both rows share the exact same `transaction_group_id` and have `type='ROUND_UP'`)*.

### How do we get the user's total Round-Ups to date?
The beauty of this architecture is you don't track a disjointed standalone "number". If the Next.js frontend calls `get_wallet_balance` specifically providing the ID of the `savings_wallet_id`, it is receiving the perfect mathematically correct sum of historically processed round-ups.

To show the user a "History" feed of their round-ups, the backend simply queries the `transaction_entries` table: `SELECT * FROM transaction_entries WHERE wallet_id = "savings-wallet" AND transaction_type = 'ROUND_UP'`.

---

## 3. Data Workflow Boundaries (The Microservice Rule)

1. **Next.js & MongoDB**: 
   * Localized app UI logic (Arabic/English strings).
   * System settings (Limits, dark mode, card freezing toggles).
   * AI Chat History. 
   * Notification queues.
2. **FastAPI & PostgreSQL (`fakainvest-core-api`)**:
   * Storing and mapping users.
   * Containerizing Wallets.
   * Guaranteeing exact monetary balances through Immutable Ledgers.
   * Running Round-Up division logic.
3. **What handles Third-Party Banks?** (Hold / Todo Status):
   * *FastAPI* handles external connections. When the Lean OpenBanking webhook fires confirming a real bank transaction, FastAPI directly generates the Ledger Debits. Next.js only reads from FastAPI.