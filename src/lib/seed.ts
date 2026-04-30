import { Types } from "mongoose";
import { randomBytes } from "crypto";
import {
  Profile,
  Wallet,
  Reward,
  Referral,
  Goal,
  BudgetCategory,
  AutomationRule,
  FamilyMember,
  FamilyChore,
  Notification,
  Challenge,
  ChallengeProgress,
  MarketRate,
  BankCertificate,
  CashbackOffer,
} from "./models";

export async function seedNewUser(
  userId: Types.ObjectId,
  displayName: string,
  email: string,
) {
  const uid = userId;

  // ── Profile ──────────────────────────────────────────────────────────────
  await Profile.create({ userId: uid, displayName, email });

  // ── Wallet (EGP 5,000 starter) ───────────────────────────────────────────
  await Wallet.create({ userId: uid.toString(), balance: 5000 });

  // ── Rewards ──────────────────────────────────────────────────────────────
  await Reward.create({ userId: uid, points: 120, level: 1, streakDays: 3 });

  // ── Referral code ─────────────────────────────────────────────────────────
  const code = randomBytes(4).toString("hex").toUpperCase();
  await Referral.create({
    userId: uid,
    code,
    totalEarned: 0,
    rewardPerSignup: 50,
  });

  // ── Demo goals ────────────────────────────────────────────────────────────
  await Goal.insertMany([
    {
      userId: uid,
      title: "Summer Trip to Sharm",
      emoji: "✈️",
      category: "Travel",
      targetAmount: 15000,
      savedAmount: 4200,
      color: "#f59e0b",
    },
    {
      userId: uid,
      title: "New MacBook",
      emoji: "💻",
      category: "Device",
      targetAmount: 35000,
      savedAmount: 12000,
      color: "#6366f1",
    },
    {
      userId: uid,
      title: "Emergency Fund",
      emoji: "🛡️",
      category: "Other",
      targetAmount: 50000,
      savedAmount: 8500,
      color: "#10b981",
    },
  ]);

  // ── Demo budget categories ────────────────────────────────────────────────
  const monthKey = new Date().toISOString().slice(0, 7);
  await BudgetCategory.insertMany([
    {
      userId: uid,
      name: "Food & Drinks",
      emoji: "🍔",
      cap: 3000,
      spent: 1850,
      lastMonth: 2900,
      monthKey,
    },
    {
      userId: uid,
      name: "Transport",
      emoji: "🚗",
      cap: 1500,
      spent: 620,
      lastMonth: 1100,
      monthKey,
    },
    {
      userId: uid,
      name: "Entertainment",
      emoji: "🎮",
      cap: 1000,
      spent: 380,
      lastMonth: 950,
      monthKey,
    },
    {
      userId: uid,
      name: "Shopping",
      emoji: "🛍️",
      cap: 2000,
      spent: 1200,
      lastMonth: 1800,
      monthKey,
    },
    {
      userId: uid,
      name: "Health",
      emoji: "💊",
      cap: 800,
      spent: 200,
      lastMonth: 650,
      monthKey,
    },
  ]);

  // ── Demo automation rules ─────────────────────────────────────────────────
  await AutomationRule.insertMany([
    {
      userId: uid,
      triggerText: "When I receive salary",
      triggerEmoji: "💰",
      actionText: "Save 10% to Emergency Fund",
      actionEmoji: "🛡️",
      enabled: true,
      triggeredCount: 2,
    },
    {
      userId: uid,
      triggerText: "When I spend on Food",
      triggerEmoji: "🍔",
      actionText: "Add EGP 5 to Travel goal",
      actionEmoji: "✈️",
      enabled: true,
      triggeredCount: 18,
    },
  ]);

  // ── Demo family ───────────────────────────────────────────────────────────
  const son = await FamilyMember.create({
    parentUserId: uid,
    name: "Omar",
    emoji: "👦",
    role: "Son",
    allowance: 200,
    balance: 150,
    weeklyLimit: 300,
    color: "#3b82f6",
  });
  const daughter = await FamilyMember.create({
    parentUserId: uid,
    name: "Nour",
    emoji: "👧",
    role: "Daughter",
    allowance: 200,
    balance: 80,
    weeklyLimit: 300,
    color: "#ec4899",
  });

  await FamilyChore.insertMany([
    {
      memberId: son._id,
      parentUserId: uid,
      title: "Clean room",
      reward: 20,
      done: true,
    },
    {
      memberId: son._id,
      parentUserId: uid,
      title: "Do homework",
      reward: 15,
      done: false,
    },
    {
      memberId: daughter._id,
      parentUserId: uid,
      title: "Water the plants",
      reward: 10,
      done: true,
    },
    {
      memberId: daughter._id,
      parentUserId: uid,
      title: "Help with dishes",
      reward: 10,
      done: false,
    },
  ]);

  // ── Welcome notifications ─────────────────────────────────────────────────
  await Notification.insertMany([
    {
      userId: uid,
      type: "milestone",
      emoji: "🎉",
      title: "Welcome to FakaInvest!",
      body: "Your account is set up with EGP 5,000 starter balance.",
    },
    {
      userId: uid,
      type: "ai",
      emoji: "🤖",
      title: "Meet your AI advisor",
      body: "Ask me anything about Sharia-compliant saving and investing.",
    },
  ]);

  // ── Join first challenge ───────────────────────────────────────────────────
  const challenge = await Challenge.findOne().sort({ createdAt: 1 }).lean();
  if (challenge) {
    await ChallengeProgress.create({
      userId: uid,
      challengeId: challenge._id,
      progress: 30,
    });
  }

  // ── Seed Market Data (Global, runs once) ─────────────────────────────────
  await seedMarketData();
}

// ── Seed Market Data (Global market data, not per user) ─────────────────────
export async function seedMarketData() {
  console.log("🌱 Checking market data...");

  // Check if market data already exists
  const existingRates = await MarketRate.countDocuments();
  const existingCerts = await BankCertificate.countDocuments();
  const existingOffers = await CashbackOffer.countDocuments();

  if (existingRates > 0 && existingCerts > 0 && existingOffers > 0) {
    console.log("Market data already exists. Skipping...");
    return;
  }

  // ── Market Rates ──────────────────────────────────────────────────────────
  if (existingRates === 0) {
    const rates = [
      {
        name: "Gold (24K)",
        value: 4287,
        unit: "EGP/g",
        change: 1.8,
        icon: "🪙",
        color: "45 90% 60%",
      },
      {
        name: "EGX30 Index",
        value: 31420,
        unit: "pts",
        change: 0.94,
        icon: "📈",
        color: "162 72% 45%",
      },
      {
        name: "USD / EGP",
        value: 50.85,
        unit: "EGP",
        change: -0.21,
        icon: "💵",
        color: "199 89% 60%",
      },
      {
        name: "CBE Interest Rate",
        value: 27.25,
        unit: "%",
        change: 0,
        icon: "🏛️",
        color: "210 55% 47%",
      },
    ];

    await MarketRate.insertMany(rates);
    console.log(`Added ${rates.length} market rates`);
  }

  // ── Bank Certificates ─────────────────────────────────────────────────────
  if (existingCerts === 0) {
    const certificates = [
      {
        bank: "NBE",
        name: "Platinum Variable",
        rate: 23.0,
        term: "3 years",
        min: 1000,
        isBest: true,
      },
      {
        bank: "Banque Misr",
        name: "Ibn Misr Al-Thalath",
        rate: 22.5,
        term: "3 years",
        min: 1000,
        isBest: false,
      },
      {
        bank: "CIB",
        name: "Prime Saver",
        rate: 21.0,
        term: "5 years",
        min: 5000,
        isBest: false,
      },
      {
        bank: "QNB",
        name: "Future Plus",
        rate: 20.5,
        term: "3 years",
        min: 1000,
        isBest: false,
      },
      {
        bank: "AAIB",
        name: "Smart Plus",
        rate: 20.0,
        term: "1 year",
        min: 1000,
        isBest: false,
      },
    ];

    await BankCertificate.insertMany(certificates);
    console.log(`Added ${certificates.length} bank certificates`);
  }

  // ── Cashback Offers ───────────────────────────────────────────────────────
  if (existingOffers === 0) {
    const offers = [
      {
        brand: "Talabat",
        category: "Food",
        cashback: "5%",
        cashbackValue: 5,
        emoji: "🍔",
        color: "0 75% 55%",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        brand: "Uber",
        category: "Transport",
        cashback: "3%",
        cashbackValue: 3,
        emoji: "🚗",
        color: "0 0% 95%",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        brand: "Carrefour",
        category: "Food",
        cashback: "4%",
        cashbackValue: 4,
        emoji: "🛒",
        color: "210 90% 50%",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        brand: "Vodafone",
        category: "Bills",
        cashback: "2%",
        cashbackValue: 2,
        emoji: "📱",
        color: "0 80% 50%",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        brand: "Cilantro",
        category: "Coffee",
        cashback: "8%",
        cashbackValue: 8,
        emoji: "☕",
        color: "30 60% 35%",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        brand: "Noon",
        category: "Shopping",
        cashback: "6%",
        cashbackValue: 6,
        emoji: "🛍️",
        color: "45 95% 55%",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
    ];

    await CashbackOffer.insertMany(offers);
    console.log(`Added ${offers.length} cashback offers`);
  }

  console.log("Market data seeding completed!");
}
