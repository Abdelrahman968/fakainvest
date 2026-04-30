export type RoundUpMode = "None" | "Normal" | "Medium" | "Aggressive";

export type Transaction = {
  id: string;
  merchant: string;
  category: "Food" | "Transport" | "Shopping" | "Bills" | "Entertainment" | "Coffee";
  amount: number;          // original purchase EGP
  roundUp: number;         // rounded up amount EGP
  date: string;            // ISO
  status: "Completed" | "Pending";
};

export type Holding = {
  id: string;
  name: string;
  type: "Savings Cert" | "Stocks" | "Gold" | "Money Market" | "Sukuk";
  amount: number;
  return1m: number;
  color: string; // hsl token
};

export const user = {
  name: "Abdelrahman Ayman",
  initial: "AY",
  email: "se.abdelrahman968@gmail.com",
  phone: "+20 100 555 0142",
  joinedDays: 47,
  streak: 12,
  badge: "Saver Tier 2",
  healthScore: 78,
  totalInvested: 4820.5,
  currentBalance: 5247.83,
  pendingRoundUps: 38.25,
  roundUpMode: "Medium" as RoundUpMode,
};

export const transactions: Transaction[] = [
  { id: "t1", merchant: "Cilantro Coffee", category: "Coffee", amount: 47.5, roundUp: 2.5, date: "2025-04-24T08:14:00Z", status: "Completed" },
  { id: "t2", merchant: "Uber Cairo", category: "Transport", amount: 83.25, roundUp: 1.75, date: "2025-04-24T07:02:00Z", status: "Completed" },
  { id: "t3", merchant: "Gourmet Market", category: "Food", amount: 312.4, roundUp: 7.6, date: "2025-04-23T19:45:00Z", status: "Completed" },
  { id: "t4", merchant: "Vodafone Cash", category: "Bills", amount: 145.0, roundUp: 5.0, date: "2025-04-23T14:20:00Z", status: "Pending" },
  { id: "t5", merchant: "Zara CityStars", category: "Shopping", amount: 1289.99, roundUp: 10.01, date: "2025-04-23T11:30:00Z", status: "Completed" },
  { id: "t6", merchant: "Netflix", category: "Entertainment", amount: 165.0, roundUp: 5.0, date: "2025-04-22T20:00:00Z", status: "Completed" },
  { id: "t7", merchant: "Carrefour", category: "Food", amount: 487.65, roundUp: 12.35, date: "2025-04-22T17:11:00Z", status: "Pending" },
  { id: "t8", merchant: "Costa Coffee", category: "Coffee", amount: 62.0, roundUp: 8.0, date: "2025-04-22T09:30:00Z", status: "Completed" },
  { id: "t9", merchant: "Talabat", category: "Food", amount: 198.45, roundUp: 1.55, date: "2025-04-21T21:15:00Z", status: "Completed" },
  { id: "t10", merchant: "Metro Cairo", category: "Transport", amount: 7.0, roundUp: 3.0, date: "2025-04-21T08:00:00Z", status: "Completed" },
];

export const holdings: Holding[] = [
  { id: "h1", name: "NBE Savings Certificate 23%", type: "Savings Cert", amount: 1850.0, return1m: 1.92, color: "199 89% 60%" },
  { id: "h2", name: "EGX30 Index Fund", type: "Stocks", amount: 1320.5, return1m: 4.73, color: "162 72% 45%" },
  { id: "h3", name: "Physical Gold (24K)", type: "Gold", amount: 980.25, return1m: 3.21, color: "45 90% 60%" },
  { id: "h4", name: "CIB Money Market Fund", type: "Money Market", amount: 720.08, return1m: 1.58, color: "210 55% 47%" },
  { id: "h5", name: "Egyptian Sukuk", type: "Sukuk", amount: 377.0, return1m: 1.05, color: "270 60% 60%" },
];

export const portfolioReturns = {
  "1m": 2.84,
  "6m": 9.12,
  "12m": 18.47,
};

export const aiQuickActions = [
  "Analyze my spending this month",
  "Should I invest more in gold?",
  "Explain my Financial Health Score",
  "Suggest a savings goal for me",
];

export const aiInitialMessages = [
  {
    id: "m1",
    role: "assistant" as const,
    text: "Hi Yara 👋 I'm AI, your personal finance advisor. I see you've rounded up EGP 38.25 this week — nice momentum! What would you like to explore today?",
    time: "9:14 AM",
  },
];

// ============= PHASE 2 DATA =============

export type Goal = {
  id: string;
  title: string;
  emoji: string;
  category: "Travel" | "Apartment" | "Device" | "Education" | "Other";
  target: number;
  saved: number;
  deadline: string; // ISO
  dailyRequired: number;
  color: string;
};

export const goals: Goal[] = [
  { id: "g1", title: "Trip to Türkiye", emoji: "✈️", category: "Travel", target: 35000, saved: 12480, deadline: "2025-09-15", dailyRequired: 165, color: "199 89% 60%" },
  { id: "g2", title: "iPhone 17 Pro", emoji: "📱", category: "Device", target: 68000, saved: 18250, deadline: "2025-11-01", dailyRequired: 254, color: "162 72% 45%" },
  { id: "g3", title: "Apartment down payment", emoji: "🏠", category: "Apartment", target: 450000, saved: 87320, deadline: "2027-06-01", dailyRequired: 472, color: "45 90% 60%" },
  { id: "g4", title: "Master's degree", emoji: "🎓", category: "Education", target: 95000, saved: 22100, deadline: "2026-02-01", dailyRequired: 246, color: "270 60% 60%" },
];

export type BudgetCategory = {
  id: string;
  name: string;
  emoji: string;
  cap: number;
  spent: number;
  lastMonth: number;
};

export const budget: BudgetCategory[] = [
  { id: "b1", name: "Food", emoji: "🍽️", cap: 3500, spent: 2840, lastMonth: 3120 },
  { id: "b2", name: "Coffee", emoji: "☕", cap: 800, spent: 712, lastMonth: 690 },
  { id: "b3", name: "Transport", emoji: "🚗", cap: 1500, spent: 945, lastMonth: 1180 },
  { id: "b4", name: "Shopping", emoji: "🛍️", cap: 2000, spent: 1865, lastMonth: 1420 },
  { id: "b5", name: "Bills", emoji: "🧾", cap: 2500, spent: 2200, lastMonth: 2350 },
  { id: "b6", name: "Entertainment", emoji: "🎬", cap: 1000, spent: 380, lastMonth: 620 },
];

export const monthlyTrend = [
  { month: "Nov", spent: 9420 },
  { month: "Dec", spent: 11200 },
  { month: "Jan", spent: 10180 },
  { month: "Feb", spent: 9870 },
  { month: "Mar", spent: 11380 },
  { month: "Apr", spent: 8942 },
];

export type Rule = {
  id: string;
  trigger: string;
  triggerEmoji: string;
  action: string;
  actionEmoji: string;
  enabled: boolean;
  triggered: number;
};

export const rules: Rule[] = [
  { id: "r1", trigger: "Uber ride", triggerEmoji: "🚗", action: "+5 EGP into EGX30 stocks", actionEmoji: "📈", enabled: true, triggered: 23 },
  { id: "r2", trigger: "Coffee purchase", triggerEmoji: "☕", action: "+10 EGP into Gold", actionEmoji: "🪙", enabled: true, triggered: 41 },
  { id: "r3", trigger: "Salary received", triggerEmoji: "💰", action: "Save 10% into Savings Cert", actionEmoji: "🏦", enabled: true, triggered: 3 },
  { id: "r4", trigger: "Friday shopping", triggerEmoji: "🛍️", action: "Block transactions over 2,000 EGP", actionEmoji: "🚫", enabled: false, triggered: 0 },
];

export const ruleTemplates = [
  { trigger: "Every coffee", action: "+10 EGP to Gold", emoji: "☕→🪙" },
  { trigger: "Every Uber", action: "+5 EGP to Stocks", emoji: "🚗→📈" },
  { trigger: "Every payday", action: "Auto-save 10%", emoji: "💰→🏦" },
  { trigger: "Spending over 1k", action: "Notify AI", emoji: "💸→🔔" },
];

export const monthlyReport = {
  month: "April 2025",
  totalSpent: 8942,
  spentChange: -8.2,
  totalInvested: 1247,
  investmentReturn: 2.84,
  topCategory: "Food",
  topCategoryAmount: 2840,
  roundUpsThisMonth: 142.5,
  insight:
    "You spent 8.2% less than March — biggest win was cutting Coffee runs by 14%. Keep it up! Next month, try moving your Friday shopping budget to Wednesday — historically you spend 23% less mid-week.",
  tip: "Consider boosting your gold position by EGP 500. Gold is correlating well with EGP inflation right now.",
};

export const marketRates = [
  { id: "m1", name: "Gold (24K)", value: 4287, unit: "EGP/g", change: 1.8, icon: "🪙" },
  { id: "m2", name: "EGX30 Index", value: 31420, unit: "pts", change: 0.94, icon: "📈" },
  { id: "m3", name: "USD / EGP", value: 50.85, unit: "EGP", change: -0.21, icon: "💵" },
  { id: "m4", name: "CBE Interest Rate", value: 27.25, unit: "%", change: 0, icon: "🏛️" },
];

export const bankCertificates = [
  { id: "c1", bank: "NBE", name: "Platinum Variable", rate: 23.0, term: "3 years", min: 1000 },
  { id: "c2", bank: "Banque Misr", name: "Ibn Misr Al-Thalath", rate: 22.5, term: "3 years", min: 1000 },
  { id: "c3", bank: "CIB", name: "Prime Saver", rate: 21.0, term: "5 years", min: 5000 },
  { id: "c4", bank: "QNB", name: "Future Plus", rate: 20.5, term: "3 years", min: 1000 },
  { id: "c5", bank: "AAIB", name: "Smart Plus", rate: 20.0, term: "1 year", min: 1000 },
];

export const cashbackOffers = [
  { id: "o1", brand: "Talabat", category: "Food", cashback: "5%", emoji: "🍔", color: "0 75% 55%" },
  { id: "o2", brand: "Uber", category: "Transport", cashback: "3%", emoji: "🚗", color: "0 0% 95%" },
  { id: "o3", brand: "Carrefour", category: "Food", cashback: "4%", emoji: "🛒", color: "210 90% 50%" },
  { id: "o4", brand: "Vodafone", category: "Bills", cashback: "2%", emoji: "📱", color: "0 80% 50%" },
  { id: "o5", brand: "Cilantro", category: "Coffee", cashback: "8%", emoji: "☕", color: "30 60% 35%" },
  { id: "o6", brand: "Noon", category: "Shopping", cashback: "6%", emoji: "🛍️", color: "45 95% 55%" },
];

// ============= PHASE 3 DATA =============

export type Property = {
  id: string;
  name: string;
  location: string;
  emoji: string;
  totalValue: number;          // EGP full property value
  sharePrice: number;          // EGP per share
  sharesAvailable: number;
  sharesOwned: number;         // user's owned shares
  totalShares: number;
  yieldPct: number;            // estimated annual rental yield
  appreciation1y: number;      // % capital appreciation est.
  occupancy: number;           // %
  type: "Residential" | "Commercial" | "Vacation" | "Office";
  color: string;
};

export const properties: Property[] = [
  { id: "p1", name: "Marassi Beach Villa", location: "North Coast", emoji: "🏖️", totalValue: 18500000, sharePrice: 1850, sharesAvailable: 4280, sharesOwned: 12, totalShares: 10000, yieldPct: 9.2, appreciation1y: 14.5, occupancy: 87, type: "Vacation", color: "199 89% 60%" },
  { id: "p2", name: "New Cairo Office Tower", location: "5th Settlement", emoji: "🏢", totalValue: 42000000, sharePrice: 4200, sharesAvailable: 6120, sharesOwned: 5, totalShares: 10000, yieldPct: 11.8, appreciation1y: 8.3, occupancy: 94, type: "Office", color: "162 72% 45%" },
  { id: "p3", name: "Zamalek Heritage Apt", location: "Cairo", emoji: "🏛️", totalValue: 9800000, sharePrice: 980, sharesAvailable: 2150, sharesOwned: 0, totalShares: 10000, yieldPct: 7.4, appreciation1y: 11.2, occupancy: 100, type: "Residential", color: "45 90% 60%" },
  { id: "p4", name: "Sheikh Zayed Mall Unit", location: "6th October", emoji: "🛍️", totalValue: 25600000, sharePrice: 2560, sharesAvailable: 8400, sharesOwned: 0, totalShares: 10000, yieldPct: 13.5, appreciation1y: 6.8, occupancy: 78, type: "Commercial", color: "270 60% 60%" },
];

export type FamilyMember = {
  id: string;
  name: string;
  relation: "Spouse" | "Child" | "Parent";
  age: number;
  avatar: string;             // emoji or initial
  weeklyLimit: number;
  spentThisWeek: number;
  balance: number;
  recentSpend: { merchant: string; amount: number; emoji: string }[];
  color: string;
};

export const familyMembers: FamilyMember[] = [
  { id: "f1", name: "Omar", relation: "Child", age: 14, avatar: "👦", weeklyLimit: 500, spentThisWeek: 387, balance: 213, recentSpend: [
    { merchant: "Cilantro", amount: 45, emoji: "☕" },
    { merchant: "GameStop", amount: 220, emoji: "🎮" },
    { merchant: "School canteen", amount: 122, emoji: "🥪" },
  ], color: "199 89% 60%" },
  { id: "f2", name: "Lina", relation: "Child", age: 9, avatar: "👧", weeklyLimit: 250, spentThisWeek: 95, balance: 305, recentSpend: [
    { merchant: "Toy store", amount: 65, emoji: "🧸" },
    { merchant: "Ice cream", amount: 30, emoji: "🍦" },
  ], color: "45 90% 60%" },
  { id: "f3", name: "Karim", relation: "Spouse", age: 36, avatar: "🧔", weeklyLimit: 3000, spentThisWeek: 1845, balance: 4250, recentSpend: [
    { merchant: "Gourmet", amount: 412, emoji: "🛒" },
    { merchant: "Vodafone", amount: 350, emoji: "📱" },
    { merchant: "Uber", amount: 183, emoji: "🚗" },
  ], color: "162 72% 45%" },
];

export const familyStats = {
  totalSpentThisMonth: 12480,
  totalBudget: 18000,
  topSpender: "Karim",
  totalSavedTogether: 3240,
};

export type Badge = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  earned: boolean;
  earnedDate?: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
};

export const badges: Badge[] = [
  { id: "bd1", name: "First Round-Up", emoji: "🌱", description: "Made your first investment", earned: true, earnedDate: "2025-03-08", rarity: "Common" },
  { id: "bd2", name: "30-Day Streak", emoji: "🔥", description: "Saved every day for 30 days", earned: true, earnedDate: "2025-04-07", rarity: "Rare" },
  { id: "bd3", name: "Gold Rush", emoji: "🪙", description: "Invested 1,000 EGP in gold", earned: true, earnedDate: "2025-04-12", rarity: "Common" },
  { id: "bd4", name: "Goal Crusher", emoji: "🎯", description: "Completed your first goal", earned: true, earnedDate: "2025-04-18", rarity: "Rare" },
  { id: "bd5", name: "Diversified", emoji: "🌈", description: "Hold 5+ asset types", earned: true, earnedDate: "2025-04-20", rarity: "Epic" },
  { id: "bd6", name: "100-Day Streak", emoji: "💎", description: "Save every day for 100 days", earned: false, rarity: "Epic" },
  { id: "bd7", name: "First Million", emoji: "👑", description: "Reach 1M EGP portfolio", earned: false, rarity: "Legendary" },
  { id: "bd8", name: "Real Estate Mogul", emoji: "🏰", description: "Own shares in 3+ properties", earned: false, rarity: "Epic" },
  { id: "bd9", name: "Coffee Saver", emoji: "☕", description: "Skip coffee 10 times in a month", earned: false, rarity: "Common" },
];

export type Challenge = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  reward: string;
  progress: number;
  target: number;
  daysLeft: number;
  participants: number;
};

export const challenges: Challenge[] = [
  { id: "ch1", title: "No-Coffee Week", emoji: "☕", description: "Skip café coffee for 7 days", reward: "+50 EGP bonus invest", progress: 4, target: 7, daysLeft: 3, participants: 1248 },
  { id: "ch2", title: "Round-Up Marathon", emoji: "🏃", description: "Round up 100 EGP this month", reward: "Rare badge", progress: 67, target: 100, daysLeft: 6, participants: 3420 },
  { id: "ch3", title: "Refer a Friend", emoji: "🤝", description: "Invite 3 friends to FakaInvest", reward: "200 EGP cash", progress: 1, target: 3, daysLeft: 30, participants: 890 },
];

export type LeaderEntry = {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  score: number;
  isYou: boolean;
};

export const leaderboard: LeaderEntry[] = [
  { id: "l1", rank: 1, name: "Aya M.", avatar: "🦊", score: 2840, isYou: false },
  { id: "l2", rank: 2, name: "Khaled R.", avatar: "🐯", score: 2615, isYou: false },
  { id: "l3", rank: 3, name: "Yara H.", avatar: "🦋", score: 2412, isYou: true },
  { id: "l4", rank: 4, name: "Mona S.", avatar: "🐼", score: 2180, isYou: false },
  { id: "l5", rank: 5, name: "Tarek A.", avatar: "🦁", score: 1995, isYou: false },
  { id: "l6", rank: 6, name: "Nour F.", avatar: "🐧", score: 1780, isYou: false },
];

// ============= PHASE 4: DESKTOP / WALLET / INSIGHTS / SOCIAL =============

export type Notification = {
  id: string;
  title: string;
  body: string;
  emoji: string;
  time: string;
  type: "alert" | "milestone" | "ai" | "social";
  unread: boolean;
};

export const notifications: Notification[] = [
  { id: "n1", title: "Goal milestone reached", body: "You're 35% to your Türkiye trip ✈️", emoji: "🎯", time: "2m ago", type: "milestone", unread: true },
  { id: "n2", title: "Gemini insight", body: "Your gold position is up 3.2% this week — nice timing.", emoji: "✨", time: "1h ago", type: "ai", unread: true },
  { id: "n3", title: "Budget alert", body: "Coffee budget at 89% with 6 days left in the month.", emoji: "⚠️", time: "3h ago", type: "alert", unread: true },
  { id: "n4", title: "Karim sent you EGP 250", body: "For groceries 🛒", emoji: "💸", time: "Yesterday", type: "social", unread: false },
  { id: "n5", title: "New challenge available", body: "No-Coffee Week starts tomorrow — join 1,248 others", emoji: "🏆", time: "Yesterday", type: "social", unread: false },
  { id: "n6", title: "Auto-invest executed", body: "EGP 38.25 invested across your portfolio", emoji: "🤖", time: "2 days ago", type: "ai", unread: false },
];

// Net worth time series (last 12 months)
export const netWorthSeries = [
  { month: "May", value: 1850 },
  { month: "Jun", value: 2120 },
  { month: "Jul", value: 2480 },
  { month: "Aug", value: 2890 },
  { month: "Sep", value: 3250 },
  { month: "Oct", value: 3580 },
  { month: "Nov", value: 3920 },
  { month: "Dec", value: 4180 },
  { month: "Jan", value: 4420 },
  { month: "Feb", value: 4680 },
  { month: "Mar", value: 4950 },
  { month: "Apr", value: 5247 },
];

// 7×24 spending heatmap (intensity 0-10)
export const spendingHeatmap = [
  // Mon-Sun, 6am-midnight (18 hours)
  [0, 0, 1, 3, 2, 4, 6, 3, 2, 5, 7, 4, 3, 2, 5, 8, 4, 2],
  [0, 1, 2, 4, 3, 5, 7, 4, 2, 4, 6, 5, 3, 2, 4, 7, 5, 3],
  [0, 0, 1, 3, 2, 4, 5, 3, 2, 4, 6, 4, 3, 2, 4, 6, 4, 2],
  [0, 1, 2, 3, 3, 5, 6, 4, 3, 5, 7, 5, 3, 2, 5, 7, 5, 3],
  [0, 1, 2, 4, 3, 5, 8, 6, 4, 6, 9, 7, 5, 3, 6, 9, 7, 5],
  [1, 2, 3, 5, 4, 6, 7, 5, 4, 7, 8, 6, 5, 4, 7, 8, 6, 4],
  [1, 2, 2, 3, 3, 4, 5, 4, 3, 5, 6, 5, 4, 3, 5, 6, 4, 3],
];

export const aiPredictions = [
  { id: "ap1", title: "End-of-month projection", value: "EGP 5,420", change: 3.3, emoji: "🎯", desc: "Based on current pace" },
  { id: "ap2", title: "Next major goal hit", value: "Sept 12, 2025", change: 0, emoji: "📅", desc: "Türkiye trip on track" },
  { id: "ap3", title: "Allocation drift", value: "Stocks +2.4%", change: -1, emoji: "⚖️", desc: "Slight rebalance suggested" },
  { id: "ap4", title: "Inflation buffer", value: "+18.2%", change: 4.1, emoji: "🛡️", desc: "Beating EGP inflation" },
];

// Allocation drift: target vs actual
export const allocationDrift = [
  { name: "Savings Cert", target: 35, actual: 35.3, color: "199 89% 60%" },
  { name: "Stocks", target: 22.5, actual: 25.2, color: "162 72% 45%" },
  { name: "Gold", target: 20, actual: 18.7, color: "45 90% 60%" },
  { name: "Money Market", target: 15, actual: 13.7, color: "210 55% 47%" },
  { name: "Sukuk", target: 7.5, actual: 7.2, color: "270 60% 60%" },
];

// Referral
export const referral = {
  code: "YARA-FAKA-2025",
  link: "https://fakainvest.app/r/YARA-FAKA-2025",
  totalEarned: 850,
  totalReferred: 7,
  pending: 2,
  rewardPerSignup: 100,
};

export type Referee = {
  id: string;
  name: string;
  avatar: string;
  joinedDate: string;
  status: "Active" | "Pending" | "Inactive";
  earned: number;
};

export const referrals: Referee[] = [
  { id: "rf1", name: "Hana A.", avatar: "🦊", joinedDate: "2025-04-20", status: "Active", earned: 100 },
  { id: "rf2", name: "Mostafa K.", avatar: "🐯", joinedDate: "2025-04-15", status: "Active", earned: 100 },
  { id: "rf3", name: "Sara M.", avatar: "🐰", joinedDate: "2025-04-10", status: "Active", earned: 100 },
  { id: "rf4", name: "Ahmed N.", avatar: "🦁", joinedDate: "2025-04-05", status: "Active", earned: 100 },
  { id: "rf5", name: "Layla S.", avatar: "🐼", joinedDate: "2025-03-28", status: "Active", earned: 100 },
  { id: "rf6", name: "Tarek O.", avatar: "🦉", joinedDate: "2025-03-20", status: "Active", earned: 100 },
  { id: "rf7", name: "Mariam I.", avatar: "🐨", joinedDate: "2025-03-12", status: "Active", earned: 250 },
  { id: "rf8", name: "Hassan B.", avatar: "🐺", joinedDate: "2025-04-22", status: "Pending", earned: 0 },
  { id: "rf9", name: "Nour H.", avatar: "🐢", joinedDate: "2025-04-21", status: "Pending", earned: 0 },
];

export const topReferrers = [
  { id: "tr1", rank: 1, name: "Yousef A.", avatar: "🐉", count: 47, isYou: false },
  { id: "tr2", rank: 2, name: "Dina M.", avatar: "🦄", count: 32, isYou: false },
  { id: "tr3", rank: 3, name: "Hassan T.", avatar: "🦅", count: 28, isYou: false },
  { id: "tr4", rank: 12, name: "Yara H.", avatar: "🦋", count: 7, isYou: true },
];

// Wallet & virtual card
export const wallet = {
  balance: 2840.5,
  card: {
    number: "5412 ●●●● ●●●● 9847",
    fullNumber: "5412 7823 1290 9847",
    holder: "YARA HASSAN",
    expiry: "08/28",
    cvv: "•••",
    type: "Virtual" as const,
    network: "Mastercard",
    spendingLimit: 10000,
    spentThisMonth: 4120,
    frozen: false,
  },
};

export type Transfer = {
  id: string;
  type: "sent" | "received" | "deposit" | "topup";
  counterparty: string;
  avatar: string;
  amount: number;
  note: string;
  date: string;
  method: "Wallet" | "Bank" | "Card";
};

export const transfers: Transfer[] = [
  { id: "tf1", type: "received", counterparty: "Karim Hassan", avatar: "🧔", amount: 250, note: "For groceries", date: "2025-04-24T18:30:00Z", method: "Wallet" },
  { id: "tf2", type: "sent", counterparty: "Mostafa K.", avatar: "🐯", amount: 120, note: "Lunch split", date: "2025-04-23T14:15:00Z", method: "Wallet" },
  { id: "tf3", type: "topup", counterparty: "CIB Visa ●●47", avatar: "💳", amount: 1500, note: "Wallet top-up", date: "2025-04-22T09:00:00Z", method: "Card" },
  { id: "tf4", type: "sent", counterparty: "Hana A.", avatar: "🦊", amount: 75, note: "Coffee 🤝", date: "2025-04-21T11:20:00Z", method: "Wallet" },
  { id: "tf5", type: "deposit", counterparty: "Salary deposit", avatar: "🏢", amount: 28500, note: "April salary", date: "2025-04-01T08:00:00Z", method: "Bank" },
];

export const quickContacts = [
  { id: "qc1", name: "Karim", avatar: "🧔", color: "162 72% 45%" },
  { id: "qc2", name: "Hana", avatar: "🦊", color: "199 89% 60%" },
  { id: "qc3", name: "Mostafa", avatar: "🐯", color: "45 90% 60%" },
  { id: "qc4", name: "Sara", avatar: "🐰", color: "270 60% 60%" },
  { id: "qc5", name: "Ahmed", avatar: "🦁", color: "210 55% 47%" },
];
