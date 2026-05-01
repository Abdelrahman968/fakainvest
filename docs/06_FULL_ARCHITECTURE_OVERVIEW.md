# Full Architecture & Data Storage Overview

This document explains the complete, dual-stack architecture of FakaInvest following the migration to the Python backend. It clarifies exactly **what data lives where** and how the two systems cooperate securely.

---

## 1. The Strategy: Polyglot Persistence
Instead of forcing all data into one database, FakaInvest uses a **Polyglot Persistence** model. This means we use the "right tool for the right job". 

The architecture is split into two distinct brains:
1. **The Behavioral Engine** (Next.js + MongoDB)
2. **The Financial Engine** (Python FastAPI + SQLite/PostgreSQL)

---

## 2. Where is the Data Saved?

### A. MongoDB (Handled by Next.js)
MongoDB acts as our unstructured, flexible data store. It is built for high-speed read/writes and dynamic structures.

**Data Saved in MongoDB:**
*   **Users & Authentication:** Encrypted passwords, email addresses, names, avatars.
*   **Behavioral & Soft Data:** AI Chat messages history, User config preferences, dark mode settings.
*   **Gamification:** The Referral program (Invite codes, total earned status), Rewards, and Notification Feeds.
*   *Why?* Because a chat message or a referral code does not require strict, multi-table financial locking.

### B. SQLite / PostgreSQL (Handled by Python FastAPI)
This is the strict **Ledger Database**. Currently configured locally as `SQLite` (saving to a file named `fakainvest.db` inside your `/fastapi-backend/` folder) but fully ready to scale to `PostgreSQL` in production.

**Data Saved in Python's SQL Database:**
*   **Wallets:** The secure containers mapped to users.
*   **The Double-Entry Ledger (Transactions):** Every single movement of money. A transfer consists of two immutable rows: a Credit (`+ amount`) and a Debit (`- amount`).
*   **Round-Ups:** They are mathematically saved here as financial transactions linking from a spending wallet to a savings wallet.
*   *Why?* Because an SQL database provides **ACID Compliance**. If a server crashes mid-transfer, SQL automatically rolls back the transaction. Money cannot be duplicated or lost.

---

## 3. How the Full App Communicates (The BFF Pattern)

Since the React Frontend cannot securely talk to two different databases simultaneously, we use the **Backend-For-Frontend (BFF)** pattern.

### Step-by-Step Data Workflow (Example: Executing a Round-Up)

1. **The User Action (React Frontend)**
   * The user makes a purchase in the Next.js app. The React UI fires a request to `/api/bff/roundup`.
2. **The Gateway (Next.js API - MongoDB)**
   * The Next.js API intercepts the request. 
   * It checks **MongoDB** to ensure the user's session/JWT is valid.
   * It securely formats a payload (attaching the user's internal Wallet UUID).
3. **The Core Engine (Python FastAPI - SQL)**
   * Next.js secretly reaches out to the Python Backend via `http://localhost:8000/api/v1/roundups/execute`.
   * Python receives the request. It mathematically computes the round-up fraction (`e.g., 2.50 EGP`).
   * Python initiates a database transaction. It writes a `-2.50` Debit and a `+2.50` Credit into the **SQLite/Postgres Database**. 
   * Python confirms the funds were moved successfully and sends a `200 OK` back to Next.js.
4. **The Resolution**
   * Next.js takes the Python response, translates it to a clean UI format, and sends a "Successfully saved 2.50 EGP" message back to the React app for the user to see.

---

## 4. Summary of the MVP Infrastructure Deployments

*   **Frontend Network:** `Next.js Server (Port: 3000)` <---> `MongoDB Atlas (Cloud)`
*   **Backend Network:** `FastAPI Server (Port: 8000)` <---> `SQLite/PostgreSQL (Local file: fakainvest.db)`

By splitting the architecture this way, FakaInvest is secure enough to handle real money (Python) while remaining fast and dynamic enough to provide an outstanding user experience (Next.js).