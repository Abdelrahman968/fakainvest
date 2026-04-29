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

  let wallet = await Wallet.findOne({ userId: session.sub }).lean();

  if (!wallet) {
    console.log("💰 No wallet found for user, creating new wallet...");

    const newWallet = await Wallet.create({
      userId: session.sub,
      balance: 0,
      pendingRoundUps: 0,
      frozen: false,
      dailyLimit: 3000,
      monthlyLimit: 10000,
      perTransactionLimit: 1500,
      spentToday: 0,
      spentTodayDate: new Date().toISOString().slice(0, 10),
      spentThisMonth: 0,
      spentMonthKey: new Date().toISOString().slice(0, 7),
      onlineEnabled: true,
      contactlessEnabled: true,
      internationalEnabled: false,
      atmEnabled: true,
      card_last_four: "9847",
      card_number: "5412 7823 1290 9847",
      card_expiry: "08/28",
    });

    wallet = newWallet.toObject();
  }

  const formattedWallet = {
    id: wallet._id.toString(),
    user_id: wallet.userId,
    balance: wallet.balance,
    spent_today: wallet.spentToday,
    spent_this_month: wallet.spentThisMonth,
    daily_limit: wallet.dailyLimit,
    monthly_limit: wallet.monthlyLimit,
    per_transaction_limit: wallet.perTransactionLimit,
    frozen: wallet.frozen,
    card_last_four: wallet.card_last_four || "9847",
    card_number: wallet.card_number || "5412 7823 1290 9847",
    card_expiry: wallet.card_expiry || "08/28",
    online_enabled: wallet.onlineEnabled,
    contactless_enabled: wallet.contactlessEnabled,
    international_enabled: wallet.internationalEnabled,
  };

  return NextResponse.json({ wallet: formattedWallet });
}
