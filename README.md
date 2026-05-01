# FakaInvest (فاكة إنفيست)

## 💡 The Idea
**FakaInvest** (derived from the Arabic word "Fakka" meaning loose change) is a micro-investing and modern personal finance platform tailored for the MENA region (currently set in EGP - Egyptian Pounds). The core idea is to seamlessly integrate saving and investing into everyday habits. 

---

## 🔗 Links

|                    |                                                                           |
| ------------------ | ------------------------------------------------------------------------- |
| 🚀 **Live Demo**   | [fakainvest.vercel.app](https://fakainvest.vercel.app/)                   |
| 💻 **GitHub Repo** | [Abdelrahman968/fakainvest](https://github.com/Abdelrahman968/fakainvest) |
| 🏆 **Hackathon**   | [Salam Hack — salamhack.com](https://salamhack.com/)                      |
| 👤 **Developer**   | Vertex Team        |

FakaInvest is a mobile-first wallet, automated savings/investing app, and Sharia-compliant financial advisor in one. Every screen is wired to a real MongoDB database; no localStorage, no fake fronts.

---

## Table of contents

1. [Quick start](#quick-start)
2. [Tech stack](#tech-stack)
3. [Sandbox / mock-data assumptions](#sandbox--mock-data-assumptions)
4. [Database schema (MongoDB)](#database-schema-mongodb)
5. [Authentication](#authentication)
6. [API Routes](#api-routes)
7. [Frontend hooks (the API)](#frontend-hooks-the-api)
8. [Routes](#routes)
9. [Environment variables](#environment-variables)
10. [What's real vs. seeded vs. mock](#whats-real-vs-seeded-vs-mock)

---

## Quick start

```bash
# Install dependencies
npm install
# or
bun install

# Set up environment variables (see .env.example)
# Make sure MongoDB is running

# Run the development server
npm run dev
# or
bun run dev
```

Visit `/auth`, create an account with any email + password (no confirmation required for the demo), and you'll be auto-seeded with a wallet of EGP 5,000, sample budgets, goals, rules, family members, chores, referrals, and notifications. Every action you take is persisted to your account.

---

## 🛠️ System Architecture
The platform is built as a monolithic full-stack application using modern technologies:

- **Framework**: Next.js 16 (App Router) with React 19.
- **Language**: TypeScript throughout the core, ensuring end-to-end type safety.
- **Backend**: Native Next.js API Routes (Route Handlers) acting as a powerful serverless backend (`src/app/api/...`).
- **Database**: MongoDB (managed via Mongoose models).
- **Styling**: Tailwind CSS v4, initialized with Shadcn UI for accessible UI components.
- **Internationalization**: `next-intl` serving full bilingual support (English & Arabic) out of the box with RTL/LTR synchronization.
- **State & Data**: Extensive use of custom React hooks (`useWallet.ts`, `useTransactions.ts`, `useGoals.ts`) combined with React Contexts.

### Backend Domain Entities
The backend features an extensive database schema reflecting a mature FinTech architecture:
- `User`, `Wallet`, `Transaction`, `PaymentRequest`, `Transfer` (Core Banking & Payments)
- `Holding`, `Property`, `Goal` (Investing & Savings)
- `Budget`, `Gamification`, `Referral`, `Family` (Engagement & Growth)
- `ChatMessage`, `Notification` (Comms & Alerting)

---

## 📈 Development Progress: How Far Are We?
Based on the current scaffolding, the system is fundamentally feature-rich:

1. **Authentication**: JWT/bcrypt authentication flows integrated with user profiles.
2. **Round-Up Engine (`src/lib/roundup-engine.ts`)**: A fully functional algorithmic engine supporting modes like "Eco" (nearest 5), "Boost" (nearest 10), "Fixed20", and "Custom".
3. **Wallet & Transactions**: Full API endpoints built for mock transfers, transaction history grouping, and digital wallets.
4. **Savings Goals & Portfolio**: Tracking financial goals, visualizing allocations, and managing portfolio holdings.
5. **UI / UX**: Mobile-first design architecture including a `BottomNav`, dark/light modes, and a customized command palette.

---

## 🚀 Potential Enhancements & Next Steps

### 1. External FinTech Integrations (Open Banking)
- **Bank Linking**: Integrate platforms like **Lean Technologies** or **Tarabut Gateway** to fetch real live bank transactions, triggering the Round-Up Engine based on real-world spending automatically.
- **Payment Gateway**: Integrate Stripe, Paymob, or Fawry to physically pull the collective round-up funds from the user's debit/credit card to their virtual FakaInvest wallet.

### 2. Backend Scalability & Security
- **Idempotency**: Implement token-based idempotency handling on `/api/transfers` to prevent double-charging in case of network failures.
- **Transaction Ledger**: Move from simple simple CRUD records to an immutable double-entry accounting ledger system for enterprise-grade financial integrity.

### 3. AI & Automation Features
- **AI Financial Advisor**: Link the existing `api/chat` feature to an LLM explicitly trained on the user's transactional data to give personalized saving advice ("You've spent more than usual on dining—decrease it to hit your 'New Car' goal faster").

### 4. Code Quality & DevOps
- **Testing**: Incorporate end-to-end (E2E) testing using Playwright, and Unit testing for critical logic like `roundup-engine.ts`.
- **CI/CD Pipelines**: Set up GitHub Actions to automatically lint, type-check, run tests, and secure preview deployments.
