import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Wallet, Transfer, User, Notification } from "@/lib/models";
import mongoose from "mongoose";

const schema = z.object({
  amount: z.number().positive().max(100000, "Amount too high"),
  to: z.string().trim().min(1, "Recipient is required"),
  note: z.string().max(100, "Note too long").default(""),
  name: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const { amount, to, note, name } = parsed.data;

  await connectDB();

  const mongooseSession = await mongoose.startSession();
  mongooseSession.startTransaction();

  try {
    let recipientUser;
    if (to.includes("@")) {
      recipientUser = await User.findOne({ email: to }).session(
        mongooseSession,
      );
    } else {
      recipientUser = await User.findById(to).session(mongooseSession);
    }

    if (!recipientUser) {
      await mongooseSession.abortTransaction();
      return NextResponse.json(
        { error: "Recipient not found" },
        { status: 404 },
      );
    }

    const senderWallet = await Wallet.findOne({ userId: session.sub }).session(
      mongooseSession,
    );
    if (!senderWallet) {
      await mongooseSession.abortTransaction();
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (senderWallet.balance < amount) {
      await mongooseSession.abortTransaction();
      return NextResponse.json(
        { ok: false, reason: "Insufficient balance" },
        { status: 422 },
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dailySpent = await Transfer.aggregate([
      {
        $match: {
          userId: session.sub,
          type: { $in: ["sent", "card"] },
          createdAt: { $gte: today, $lt: tomorrow },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const spentToday = dailySpent[0]?.total || 0;
    if (spentToday + amount > senderWallet.dailyLimit) {
      await mongooseSession.abortTransaction();
      return NextResponse.json(
        { ok: false, reason: "Daily limit exceeded" },
        { status: 422 },
      );
    }

    let recipientWallet = await Wallet.findOne({
      userId: recipientUser._id,
    }).session(mongooseSession);

    if (!recipientWallet) {
      const [newWallet] = await Wallet.create(
        [
          {
            userId: recipientUser._id,
            balance: 0,
            spentToday: 0,
            spentThisMonth: 0,
            spentTodayDate: today.toISOString().slice(0, 10),
            spentMonthKey: new Date().toISOString().slice(0, 7),
            frozen: false,
            dailyLimit: 5000,
            monthlyLimit: 20000,
            perTransactionLimit: 2500,
            onlineEnabled: true,
            contactlessEnabled: true,
            internationalEnabled: false,
            atmEnabled: true,
          },
        ],
        { session: mongooseSession },
      );
      recipientWallet = newWallet;
    }

    senderWallet.balance -= amount;
    senderWallet.spentToday = spentToday + amount;
    await senderWallet.save({ session: mongooseSession });

    recipientWallet.balance += amount;
    await recipientWallet.save({ session: mongooseSession });

    const recipientName = recipientUser.displayName || recipientUser.email;
    const senderName = name || "Someone";

    const sentTransfer = new Transfer({
      userId: session.sub,
      type: "sent",
      counterparty: recipientName,
      counterpartyId: recipientUser._id,
      avatar: recipientName.charAt(0).toUpperCase(),
      amount,
      note: note || "",
      method: "Wallet",
    });

    const receivedTransfer = new Transfer({
      userId: recipientUser._id,
      type: "received",
      counterparty: senderName,
      counterpartyId: session.sub,
      avatar: senderName.charAt(0).toUpperCase(),
      amount,
      note: note || "",
      method: "Wallet",
    });

    await sentTransfer.save({ session: mongooseSession });
    await receivedTransfer.save({ session: mongooseSession });

    await Notification.create(
      [
        {
          userId: session.sub,
          title: "💸 Payment Sent",
          body: `You sent EGP ${amount.toLocaleString()} to ${recipientName}`,
          emoji: "💸",
          type: "social",
        },
        {
          userId: recipientUser._id,
          title: "💰 Payment Received",
          body: `You received EGP ${amount.toLocaleString()} from ${senderName}`,
          emoji: "💰",
          type: "social",
        },
      ],
      { session: mongooseSession, ordered: true },
    );

    await mongooseSession.commitTransaction();

    return NextResponse.json({
      ok: true,
      balance: senderWallet.balance,
      transferId: sentTransfer._id,
      recipient: recipientName,
    });
  } catch (error) {
    await mongooseSession.abortTransaction();
    console.error("Send transaction error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Transaction failed", details: errorMessage },
      { status: 500 },
    );
  } finally {
    mongooseSession.endSession();
  }
}
