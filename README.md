# FakaInvest — Sharia-Compliant Personal Finance for Egypt 🇪🇬

> Hackathon submission for **Salam Hack 2026** — Tracks 1, 2, and 3.
> Built with **Next.js 15 + TypeScript + MongoDB** with AI integration via Groq API for the in-app advisor.

---

## 🔗 Links

|                    |                                                                           |
| ------------------ | ------------------------------------------------------------------------- |
| 🚀 **Live Demo**   | [fakainvest.vercel.app](https://fakainvest.vercel.app/)                   |
| 💻 **GitHub Repo** | [Abdelrahman968/fakainvest](https://github.com/Abdelrahman968/fakainvest) |
| 🏆 **Hackathon**   | [Salam Hack — salamhack.com](https://salamhack.com/)                      |
| 👤 **Developer**   | [Abdelrahman — Facebook](https://www.facebook.com/Abdelrahman.968)        |

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

## Tech stack

| Layer          | Choice                                                           |
| -------------- | ---------------------------------------------------------------- |
| Framework      | Next.js 15 (App Router)                                          |
| Language       | TypeScript                                                       |
| UI             | Tailwind CSS v3 + shadcn/ui, lucide-react, framer-motion         |
| State          | React hooks, Context API                                         |
| Notifications  | sonner (toasts)                                                  |
| Database       | MongoDB with Mongoose ODM                                        |
| Authentication | JWT-based custom auth (bcrypt password hashing)                  |
| AI Integration | Groq API (Mixtral 8x7B model) for financial advisor and insights |
| i18n           | next-intl (Arabic/English bilingual support)                     |

---

## Sandbox / mock-data assumptions

Per Salam Hack rules we run under **Central Bank Sandbox License** + **Sharia Advisory Board** approval. This means:

- All users are pre-KYC'd / AML-cleared.
- All transactions are pre-authorized; no fraud/dispute UI.
- All returns are framed as **Profit-Sharing (Musharaka / Mudarabah / Sukuk)** — never Riba.
- All merchants are pre-screened halal.
- **FX rate is fixed:** `1 USD = 50.85 EGP` (used in `Market` page).
- Cross-border settlement is instant.
- "Bank account" data is seeded for demo purposes.
- Categorization is pre-tagged (every transaction has a category).

---

## Database schema (MongoDB)

All collections use MongoDB with Mongoose schemas. Key collections:

### User & Auth

| Collection | Purpose               | Key fields                                                                                              |
| ---------- | --------------------- | ------------------------------------------------------------------------------------------------------- |
| `users`    | User authentication   | `email`, `passwordHash`, `displayName`                                                                  |
| `profiles` | User profile data     | `userId`, `displayName`, `email`, `phone`, `avatarEmoji`, `notificationsEnabled`                        |
| `wallets`  | Virtual card + wallet | `userId`, `balance`, `frozenBalance`, `spentToday`, `dailyLimit`, `monthlyLimit`, `perTransactionLimit` |

### Savings & Budgets

| Collection          | Purpose                       | Key fields                                                                       |
| ------------------- | ----------------------------- | -------------------------------------------------------------------------------- |
| `goals`             | Savings goals                 | `title`, `emoji`, `category`, `targetAmount`, `savedAmount`, `deadline`, `color` |
| `goalcontributions` | Per-deposit ledger for a goal | `goalId`, `userId`, `amount`                                                     |
| `budgetcategories`  | Monthly spending caps         | `name`, `emoji`, `cap`, `spent`, `lastMonth`, `monthKey`                         |

### Automation & Rules

| Collection | Purpose                       | Key fields                                                                              |
| ---------- | ----------------------------- | --------------------------------------------------------------------------------------- |
| `rules`    | If-this-then-that automations | `triggerText`, `triggerEmoji`, `actionText`, `actionEmoji`, `enabled`, `triggeredCount` |

### Real Estate

| Collection         | Purpose                          | Key fields                                                                                              |
| ------------------ | -------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `properties`       | Fractional real-estate catalogue | `name`, `location`, `emoji`, `totalValue`, `sharePrice`, `sharesAvailable`, `yieldPct`, `type`, `color` |
| `propertyholdings` | Shares the user owns             | `userId`, `propertyId`, `shares`                                                                        |

### Family Wallet

| Collection      | Purpose                        | Key fields                                                                     |
| --------------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `familymembers` | Household members & allowances | `parentUserId`, `name`, `emoji`, `role`, `allowance`, `balance`, `weeklyLimit` |
| `familychores`  | Chores → reward                | `memberId`, `parentUserId`, `title`, `reward`, `done`                          |

### Rewards & Gamification

| Collection           | Purpose               | Key fields                                                                      |
| -------------------- | --------------------- | ------------------------------------------------------------------------------- |
| `rewards`            | Gamification per user | `userId`, `points`, `level`, `streakDays`, `badges[]`, `completedChallenges[]`  |
| `badges`             | Badge catalogue       | `id`, `name`, `emoji`, `description`, `rarity`, `condition`                     |
| `challenges`         | Challenge catalogue   | `title`, `description`, `emoji`, `rewardPoints`, `durationDays`, `participants` |
| `leaderboardentries` | Monthly leaderboard   | `userId`, `userName`, `userAvatar`, `score`, `month`                            |

### Referrals

| Collection        | Purpose          | Key fields                                                       |
| ----------------- | ---------------- | ---------------------------------------------------------------- |
| `referrals`       | One row per user | `userId`, `code`, `totalEarned`, `rewardPerSignup`               |
| `referralsignups` | Friends invited  | `referralId`, `referrerId`, `name`, `avatar`, `status`, `earned` |

### Market Data (Seeded)

| Collection         | Purpose                         | Key fields                                                         |
| ------------------ | ------------------------------- | ------------------------------------------------------------------ |
| `marketrates`      | Live market rates (seeded)      | `name`, `value`, `unit`, `change`, `icon`, `color`                 |
| `bankcertificates` | Bank certificate rates (seeded) | `bank`, `name`, `rate`, `term`, `min`                              |
| `cashbackoffers`   | Cashback offers (seeded)        | `brand`, `category`, `cashback`, `cashbackValue`, `emoji`, `color` |

---

## Authentication

Custom JWT-based authentication with:

- **bcrypt** for password hashing (12 rounds)
- **JWT tokens** stored in HTTP-only cookies
- Session management via `getSession()` helper
- Protected routes via middleware

**Flow:**

1. User signs up → password hashed → user created in MongoDB
2. `seedNewUser()` called → creates wallet, profile, demo goals, budget, rules, family members, chores, referral code, notifications
3. JWT token generated → stored in cookie
4. Subsequent requests validated via `getSession()`

---

## API Routes (Next.js App Router)

All API routes follow the pattern `app/api/[resource]/route.ts`

| API Endpoint            | Methods            | Purpose                                      |
| ----------------------- | ------------------ | -------------------------------------------- |
| `/api/auth/signup`      | POST               | Create new user, hash password, generate JWT |
| `/api/auth/signin`      | POST               | Authenticate user, return JWT                |
| `/api/auth/signout`     | POST               | Clear auth cookie                            |
| `/api/auth/me`          | GET                | Get current user data                        |
| `/api/wallet`           | GET, POST          | Fetch wallet, create wallet                  |
| `/api/wallet/deposit`   | POST               | Add funds to wallet                          |
| `/api/wallet/send`      | POST               | Send money to another user                   |
| `/api/wallet/limits`    | PATCH              | Update spending limits                       |
| `/api/goals`            | GET, POST          | Fetch goals, create goal                     |
| `/api/goals/[id]`       | GET, PATCH, DELETE | Single goal operations                       |
| `/api/goals/contribute` | POST               | Add money to a goal                          |
| `/api/budget`           | GET, POST          | Fetch budget categories, add category        |
| `/api/budget/[id]`      | PATCH, DELETE      | Update/delete category                       |
| `/api/rules`            | GET, POST          | Fetch rules, create rule                     |
| `/api/rules/[id]`       | PATCH, DELETE      | Update/delete rule                           |
| `/api/properties`       | GET, POST          | Fetch properties, buy shares                 |
| `/api/family`           | GET, POST, DELETE  | Family members and chores                    |
| `/api/rewards`          | GET, POST          | Fetch rewards, join challenges               |
| `/api/referral`         | GET, POST          | Fetch referral data, track referral          |
| `/api/market/*`         | GET                | Market rates, certificates, offers           |
| `/api/insights/*`       | GET                | Net worth, predictions, allocation drift     |
| `/api/report`           | GET                | Monthly financial report with AI             |

---

## Frontend hooks (the API)

All data access is funneled through custom hooks that fetch from API routes. Components never make direct fetch calls.

| Hook              | What it returns                                                                      | Mutations                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `useAuth()`       | `{ user, loading, refreshUser }`                                                     | `signIn()`, `signUp()`, `signOut()` (via direct API calls)                                                    |
| `useProfile()`    | `{ profile, loading, refresh, update }`                                              | `update(patch)`                                                                                               |
| `useWallet()`     | `{ wallet, transfers, loading, refresh }`                                            | `deposit()`, `send()`, `cardSpend()`, `setFrozen()`, `updateLimits()`, `freezeForGoal()`, `unfreezeForGoal()` |
| `useGoals()`      | `{ goals, loading, refresh, createGoal, contribute, removeGoal }`                    | + helper `dailyRequired()`                                                                                    |
| `useBudget()`     | `{ budget, loading, refresh, updateCap, add, remove }`                               |                                                                                                               |
| `useRules()`      | `{ rules, loading, refresh, toggle, create, remove }`                                |                                                                                                               |
| `useProperties()` | `{ properties, holdings, sharesOwned, buyShares, refresh }`                          |                                                                                                               |
| `useFamily()`     | `{ members, chores, addMember, sendAllowance, toggleChore, addChore }`               |                                                                                                               |
| `useRewards()`    | `{ reward, challenges, badges, leaderboard, userRank, joinChallenge, updateStreak }` |                                                                                                               |
| `useReferral()`   | `{ referral, signups, link, trackReferral, activateReferral }`                       |                                                                                                               |
| `useMarket()`     | `{ rates, certificates, offers, loading }`                                           | read-only                                                                                                     |
| `useInsights()`   | `{ netWorth, predictions, allocationDrift, budget, loading }`                        | read-only                                                                                                     |
| `useReport()`     | `{ report, loading }`                                                                | read-only                                                                                                     |
| `useChat()`       | `{ messages, sending, send, clear }`                                                 | `send(text, ctx)` calls Groq API                                                                              |

**Validation lives in the API routes**, not the hooks, e.g., `send` endpoint enforces limits, frozen state, and balance — surfaced to the UI via error responses.

---

## Routes (Next.js App Router)

| Path                     | Page                                           | Wired to                              |
| ------------------------ | ---------------------------------------------- | ------------------------------------- |
| `/[locale]`              | Landing page                                   | Static                                |
| `/[locale]/auth`         | Sign in / sign up                              | Custom auth API                       |
| `/[locale]/onboarding`   | First-run intro                                | Static                                |
| `/[locale]/dashboard`    | Home                                           | `useWallet`, `useProfile`, `useGoals` |
| `/[locale]/wallet`       | Virtual card, deposit, send, limits            | `useWallet`                           |
| `/[locale]/transactions` | Money ledger                                   | `useWallet`                           |
| `/[locale]/goals`        | Savings goals                                  | `useGoals`                            |
| `/[locale]/budget`       | Spending caps                                  | `useBudget`                           |
| `/[locale]/rules`        | If-this-then-that                              | `useRules`                            |
| `/[locale]/real-estate`  | Fractional properties                          | `useProperties`, `useWallet`          |
| `/[locale]/family`       | Allowances + chores                            | `useFamily`                           |
| `/[locale]/chat`         | AI advisor                                     | `useChat` + Groq API                  |
| `/[locale]/referral`     | Refer & earn                                   | `useReferral`                         |
| `/[locale]/profile`      | Edit name, email, phone, avatar, notifications | `useProfile`                          |
| `/[locale]/insights`     | Net worth, allocation, predictions             | `useInsights` (real AI)               |
| `/[locale]/rewards`      | Badges + challenges + leaderboard              | `useRewards`                          |
| `/[locale]/portfolio`    | Investment portfolio                           | `useHoldings`                         |
| `/[locale]/market`       | Market rates & offers                          | `useMarket` (seeded)                  |
| `/[locale]/report`       | Monthly report                                 | `useReport` (AI-generated)            |
| `/[locale]/more`         | Navigation hub                                 | Static                                |

All routes are bilingual (Arabic/English) using `next-intl`.

---

## Environment variables

Create `.env.local` file with:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/fakainvest

# JWT
JWT_SECRET=your-super-secret-jwt-key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Groq API (for AI features)
GROQ_API_KEY=your-groq-api-key

# Optional: Disable Groq (use fallback tips)
USE_GROQ=true
```

---

## What's real vs. seeded vs. mock

| Feature                                                               | Status                                       |
| --------------------------------------------------------------------- | -------------------------------------------- |
| Auth, profiles, wallet, card, transfers, deposits, sends, card limits | ✅ Real (MongoDB + API)                      |
| Goals, contributions, budgets, automation rules                       | ✅ Real (MongoDB + API)                      |
| Fractional real estate (catalogue + buying shares)                    | ✅ Real (MongoDB + API)                      |
| Family members, allowances, chores                                    | ✅ Real (MongoDB + API)                      |
| Referrals, rewards, badges, challenges                                | ✅ Real (MongoDB + API)                      |
| AI Chat (Gemini/FakaAI advisor)                                       | ✅ Real (Groq API)                           |
| Monthly report with AI insights                                       | ✅ Real (Groq API + real data)               |
| Insights (net worth, predictions, allocation drift)                   | ✅ Real (calculated from user data)          |
| Market rates, bank certificates                                       | 📦 Seeded (MongoDB seed)                     |
| Cashback offers                                                       | 📦 Seeded (MongoDB seed)                     |
| Leaderboard                                                           | 📦 Seeded (demo data)                        |
| Spending heatmap                                                      | 📊 Calculated from real transactions         |
| Bank certificate APIs                                                 | 📦 Seeded (would need external API for real) |
| Live FX rates                                                         | 🧪 Hardcoded `USD/EGP = 50.85`               |
| Stock / gold live prices                                              | 📦 Seeded (would need external API for real) |

When you see seeded data, it's stored in MongoDB and loaded on first user creation or via seed scripts.

---

## Seed scripts

Run seeds to populate market data:

```bash
npm run seed:market
# or
npx ts-node src/lib/runMarketSeed.ts
```

Data is automatically seeded for new users via `seedNewUser()`.

---

## Project layout

```
src/
├── app/
│   ├── [locale]/           # Internationalized routes
│   │   ├── (core)/         # Authenticated routes
│   │   ├── auth/           # Auth page
│   │   ├── r/[code]/       # Referral landing page
│   │   └── layout.tsx
│   ├── api/                # Next.js API routes
│   └── layout.tsx
├── components/             # Reusable UI components
│   ├── ui/                 # shadcn/ui components
│   └── [feature]/          # Feature-specific components
├── contexts/               # React contexts (AuthContext)
├── features/               # Feature modules (dashboard, budget, etc.)
├── hooks/                  # Custom data hooks
├── lib/
│   ├── models/             # Mongoose models
│   ├── auth.ts             # JWT auth helpers
│   ├── mongoose.ts         # Database connection
│   ├── seed.ts             # User seeding
│   └── validators.ts       # Zod validation schemas
├── i18n/                   # Internationalization config
└── messages/               # Translation files (ar.json, en.json)
```

---

## License & credits

Built for **Salam Hack 2026** by the FakaInvest team. Made with ♥ in Cairo.
