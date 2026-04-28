import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Wallet } from "@/lib/models/Wallet";

export async function GET() {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const wallet = await Wallet.findOne({ userId: session.sub }).lean();
  if (!wallet) {
    return NextResponse.json({ wallet: null });
  }

  return NextResponse.json({
    wallet: {
      user_id: wallet.userId.toString(),
      balance: wallet.balance,
      spent_today: wallet.spentToday,
      spent_this_month: wallet.spentThisMonth,
      spent_today_date: wallet.spentTodayDate,
      spent_month_key: wallet.spentMonthKey,
      frozen: wallet.frozen,
      daily_limit: wallet.dailyLimit,
      monthly_limit: wallet.monthlyLimit,
      per_transaction_limit: wallet.perTransactionLimit,
      online_enabled: wallet.onlineEnabled,
      contactless_enabled: wallet.contactlessEnabled,
      international_enabled: wallet.internationalEnabled,
      atm_enabled: wallet.atmEnabled,
    },
  });
}
