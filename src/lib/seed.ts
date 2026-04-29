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
}
