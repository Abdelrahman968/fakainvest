import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Transaction } from "@/lib/models/Transaction";
import { Holding } from "@/lib/models/Holding";
import { BudgetCategory } from "@/lib/models/Budget";
import mongoose from "mongoose";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "en";
    await connectDB();

    const userId = session.sub;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const meResponse = await fetch(`${baseUrl}/api/auth/me`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });
    const meData = await meResponse.json();
    const userData = meData.user || {};

    const [transactions, holdings, budget] = await Promise.all([
      Transaction.find({ userId }).sort({ date: -1 }).limit(50).lean(),
      Holding.find({ userId: new mongoose.Types.ObjectId(userId) }).lean(),
      BudgetCategory.find({
        userId: new mongoose.Types.ObjectId(userId),
        monthKey: new Date().toISOString().slice(0, 7),
      }).lean(),
    ]);

    const totalSpent = transactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const avgSpent = totalSpent / (transactions.length || 1);

    const categorySpending = transactions
      .filter((t) => t.amount < 0)
      .reduce(
        (acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
          return acc;
        },
        {} as Record<string, number>,
      );

    const topCategory =
      Object.entries(categorySpending).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      (locale === "ar" ? "عام" : "General");

    const totalHoldings = holdings.reduce((sum, h) => sum + (h.amount || 0), 0);
    const budgetUsage =
      (budget.reduce((sum, b) => sum + b.spent / b.cap, 0) /
        (budget.length || 1)) *
      100;

    const currentBalance = userData.currentBalance || 0;
    const totalInvested = userData.totalInvested || totalHoldings;
    const pendingRoundUps = userData.pendingRoundUps || 0;
    const healthScore = userData.healthScore || 0;
    const streak = userData.streak || 0;

    if (!GROQ_API_KEY) {
      const fallbackTips = getRandomTips(
        {
          totalSpent,
          avgSpent,
          topCategory,
          totalHoldings: totalInvested,
          budgetUsage,
          balance: currentBalance,
          healthScore,
          streak,
          pendingRoundUps,
        },
        locale,
      );
      return NextResponse.json({ suggestion: fallbackTips });
    }

    const systemPrompt =
      locale === "ar"
        ? "أنت مستشار مالي لتطبيق فكا إنفيست. قدم نصائح مالية قصيرة وقابلة للتنفيذ (بحد أقصى 150 حرف). كن مشجعاً وعملياً. استخدم الإيموجي أحياناً. ركز على التوفير والاستثمار وإدارة الميزانية. لا تقدم نصائح غير قانونية."
        : "You are a financial advisor AI for FakaInvest app. Provide short, actionable financial tips (max 150 characters). Be encouraging and practical. Use emojis occasionally. Focus on saving, investing, and budgeting. Never give illegal advice.";

    const userPrompt =
      locale === "ar"
        ? `بيانات المستخدم المالية:
- الإنفاق الشهري: ${totalSpent} جنيه
- متوسط المعاملة: ${avgSpent} جنيه
- فئة الإنفاق الأعلى: ${topCategory}
- إجمالي الاستثمارات: ${totalInvested} جنيه
- استخدام الميزانية: ${budgetUsage.toFixed(0)}%
- رصيد المحفظة: ${currentBalance} جنيه
- درجة الصحة المالية: ${healthScore}/100
- أيام الاستمرارية: ${streak} يوم
- التقريب المستحق: ${pendingRoundUps} جنيه

قدم نصيحة مالية واحدة مخصصة.`
        : `User financial data:
- Monthly spending: ${totalSpent} EGP
- Average transaction: ${avgSpent} EGP
- Top spending category: ${topCategory}
- Total investments: ${totalInvested} EGP
- Budget usage: ${budgetUsage.toFixed(0)}%
- Wallet balance: ${currentBalance} EGP
- Financial health score: ${healthScore}/100
- Streak days: ${streak} days
- Pending round-ups: ${pendingRoundUps} EGP

Give one personalized financial tip.`;

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      throw new Error("Groq API error");
    }

    const data = await response.json();
    const suggestion =
      data.choices?.[0]?.message?.content ||
      getRandomTips(
        {
          totalSpent,
          avgSpent,
          topCategory,
          totalHoldings: totalInvested,
          budgetUsage,
          balance: currentBalance,
          healthScore,
          streak,
          pendingRoundUps,
        },
        locale,
      );

    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error("Error generating AI suggestion:", error);
    const fallbackTips = getRandomTips(
      {
        totalSpent: 0,
        avgSpent: 0,
        topCategory: "General",
        totalHoldings: 0,
        budgetUsage: 0,
        balance: 0,
        healthScore: 0,
        streak: 0,
        pendingRoundUps: 0,
      },
      "en",
    );
    return NextResponse.json({ suggestion: fallbackTips });
  }
}

function getRandomTips(
  context: {
    totalSpent: number;
    avgSpent: number;
    topCategory: string;
    totalHoldings: number;
    budgetUsage: number;
    balance: number;
    healthScore?: number;
    streak?: number;
    pendingRoundUps?: number;
  },
  locale: string,
): string {
  const tipsAr = [
    `💡 وفر ${Math.ceil(context.avgSpent * 0.1)} جنيه يومياً من إنفاقك على ${context.topCategory}!`,
    `🎯 أنت ${context.budgetUsage > 80 ? "قريب من" : "ضمن"} ميزانيتك. ${context.budgetUsage > 80 ? "حان وقت التقليل!" : "استمر بهذا الأداء!"}`,
    `📈 استثمر ${Math.ceil(context.balance * 0.05)} جنيه اليوم لبدء تنمية ثروتك.`,
    `💰 إنفاقك على ${context.topCategory} مرتفع. حاول تقليله بنسبة 10% هذا الشهر.`,
    `🚀 يمكنك توفير ${Math.ceil(context.totalSpent * 0.05)} جنيه شهرياً عن طريق تقليل النفقات الصغيرة.`,
    `🏦 قم بإعداد حفظ تلقائي بقيمة ${Math.ceil(context.balance * 0.1)} جنيه في يوم الراتب. مستقبلك سيشكرك!`,
    `📊 راجع ميزانية ${context.topCategory} - التخفيضات الصغيرة هناك تتراكم بسرعة!`,
    `✨ قم بتقريب مشترياتك لتوفير ${Math.ceil(context.avgSpent * 0.2)} جنيه إضافي شهرياً.`,
    `🎯 أنت ${Math.abs(100 - context.budgetUsage).toFixed(0)}% ${context.budgetUsage > 100 ? "فوق" : "تحت"} الميزانية. ${context.budgetUsage > 100 ? "حان وقت التعديل!" : "عمل رائع!"}`,
    `💪 تحدى نفسك: لا تنفق على ${context.topCategory} لمدة 3 أيام!`,
    `🪙 فكر في تحويل ${Math.ceil(context.balance * 0.15)} جنيه إلى محفظة استثماراتك.`,
    `📅 حدد حداً أسبوعياً للإنفاق بقيمة ${Math.ceil(context.avgSpent * 7)} جنيه للبقاء على المسار الصحيح.`,
    `🔔 فعّل الإشعارات للمشتريات الكبيرة التي تزيد عن ${Math.ceil(context.avgSpent * 3)} جنيه.`,
    `⭐ أداؤك رائع! فقط ${Math.ceil(context.totalSpent * 0.1)} جنيه أخرى وستصل إلى هدفك الشهري.`,
    `🌙 قلل الإنفاق المسائي بمقدار ${Math.ceil(context.avgSpent * 0.3)} جنيه - سيتراكم ليصبح ${Math.ceil(context.avgSpent * 9)} جنيه شهرياً!`,
    `🎯 هدفك التالي: وفر ${Math.ceil(context.totalSpent * 0.15)} جنيه هذا الشهر لصندوق الطوارئ.`,
    `📊 تتبع نفقاتك يومياً - حتى ${Math.ceil(context.avgSpent * 0.5)} جنيه توفر فرقاً كبيراً!`,
    `💪 استمرارية ${context.streak || 0} يوم! أنت على المسار الصحيح. حافظ على هذا الزخم!`,
    `🏆 صحتك المالية ${context.healthScore || 0}/100. ${(context.healthScore || 0) < 50 ? "يمكنك تحسينها بتقليل النفقات غير الضرورية." : "أنت في وضع جيد! واصل العمل على أهدافك."}`,
    `💰 لديك ${context.pendingRoundUps || 0} جنيه تقريب معلق. قم بتحويله إلى استثمارات اليوم!`,
  ];

  const tipsEn = [
    `💡 Save ${Math.ceil(context.avgSpent * 0.1)} EGP daily from your ${context.topCategory} spending!`,
    `🎯 You're ${context.budgetUsage > 80 ? "close to" : "within"} your budget. ${context.budgetUsage > 80 ? "Time to cut back!" : "Keep it up!"}`,
    `📈 Invest ${Math.ceil(context.balance * 0.05)} EGP today to start growing your wealth.`,
    `💰 Your ${context.topCategory} spending is high. Try reducing it by 10% this month.`,
    `🚀 You could save ${Math.ceil(context.totalSpent * 0.05)} EGP monthly by cutting small expenses.`,
    `🏦 Set up auto-save of ${Math.ceil(context.balance * 0.1)} EGP on payday. Future you will thank you!`,
    `📊 Review your ${context.topCategory} budget - small cuts there add up fast!`,
    `✨ Round up your purchases to save ${Math.ceil(context.avgSpent * 0.2)} EGP extra monthly.`,
    `🎯 You're ${Math.abs(100 - context.budgetUsage).toFixed(0)}% ${context.budgetUsage > 100 ? "over" : "under"} budget. ${context.budgetUsage > 100 ? "Time to adjust!" : "Great job!"}`,
    `💪 Challenge yourself: No ${context.topCategory} spending for 3 days!`,
    `🪙 Consider moving ${Math.ceil(context.balance * 0.15)} EGP to your investment portfolio.`,
    `📅 Set a weekly spending limit of ${Math.ceil(context.avgSpent * 7)} EGP to stay on track.`,
    `🔔 Enable notifications for large purchases over ${Math.ceil(context.avgSpent * 3)} EGP.`,
    `⭐ You're doing great! Just ${Math.ceil(context.totalSpent * 0.1)} EGP more and you'll hit your monthly target.`,
    `🌙 Reduce evening spending by ${Math.ceil(context.avgSpent * 0.3)} EGP - it adds up to ${Math.ceil(context.avgSpent * 9)} EGP monthly!`,
    `🎯 Your next goal: Save ${Math.ceil(context.totalSpent * 0.15)} EGP this month for emergency fund.`,
    `📊 Track your daily expenses - even ${Math.ceil(context.avgSpent * 0.5)} EGP makes a big difference!`,
    `💪 ${context.streak || 0} day streak! You're on the right track. Keep up this momentum!`,
    `🏆 Your financial health is ${context.healthScore || 0}/100. ${(context.healthScore || 0) < 50 ? "You can improve by cutting unnecessary expenses." : "You're in good shape! Keep working on your goals."}`,
    `💰 You have ${context.pendingRoundUps || 0} EGP in pending round-ups. Invest them today!`,
  ];

  const tips = locale === "ar" ? tipsAr : tipsEn;
  return tips[Math.floor(Math.random() * tips.length)];
}
