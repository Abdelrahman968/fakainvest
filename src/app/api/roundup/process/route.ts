import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import {
  Transaction,
  Wallet,
  UserSettings,
  Notification,
  Goal,
} from "@/lib/models";
import {
  shouldProcessRoundUps,
  calculateTotalPendingRoundUps,
  RoundUpMode,
} from "@/lib/roundup-engine";
import mongoose from "mongoose";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const { targetGoalId, force } = await request.json();

  const mongooseSession = await mongoose.startSession();
  mongooseSession.startTransaction();

  try {
    const userSettings = await UserSettings.findOne({
      userId: session.sub,
    }).session(mongooseSession);
    const roundUpMode: RoundUpMode = userSettings?.roundUpMode ?? "Eco";
    const threshold = userSettings?.roundUpAutoInvestThreshold || 10;
    const goalId = targetGoalId || userSettings?.roundUpTargetGoalId;

    const pendingTransactions = await Transaction.find({
      userId: session.sub,
      roundUp: { $gt: 0 },
      isRoundUpProcessed: false,
    }).session(mongooseSession);

    const totalPendingAmount =
      calculateTotalPendingRoundUps(pendingTransactions);

    if (totalPendingAmount === 0) {
      await mongooseSession.abortTransaction();
      return NextResponse.json({
        success: false,
        message: "No pending RoundUps to process",
        pendingAmount: 0,
      });
    }

    const shouldProcess =
      force === true ||
      shouldProcessRoundUps(totalPendingAmount, threshold, roundUpMode);

    if (!shouldProcess) {
      await mongooseSession.abortTransaction();
      return NextResponse.json({
        success: false,
        message: `Pending amount (${totalPendingAmount} EGP) is below threshold (${threshold} EGP)`,
        pendingAmount: totalPendingAmount,
        threshold,
      });
    }

    const wallet = await Wallet.findOne({ userId: session.sub }).session(
      mongooseSession,
    );
    if (!wallet) {
      await mongooseSession.abortTransaction();
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if ((wallet.pendingRoundUps || 0) < totalPendingAmount) {
      await mongooseSession.abortTransaction();
      return NextResponse.json(
        {
          error: "Insufficient pending RoundUps balance",
          available: wallet.pendingRoundUps || 0,
          required: totalPendingAmount,
        },
        { status: 422 },
      );
    }

    wallet.pendingRoundUps = (wallet.pendingRoundUps || 0) - totalPendingAmount;

    if (goalId) {
      const goal = await Goal.findOne({
        _id: goalId,
        userId: session.sub,
      }).session(mongooseSession);
      if (goal) {
        goal.savedAmount = (goal.savedAmount || 0) + totalPendingAmount;
        await goal.save({ session: mongooseSession });
      }
    }

    await wallet.save({ session: mongooseSession });

    await Transaction.updateMany(
      {
        userId: session.sub,
        roundUp: { $gt: 0 },
        isRoundUpProcessed: false,
      },
      {
        $set: { isRoundUpProcessed: true },
      },
      { session: mongooseSession },
    );

    await UserSettings.updateOne(
      { userId: session.sub },
      { $set: { roundUpLastProcessedAt: new Date() } },
      { session: mongooseSession },
    );

    await Notification.create(
      [
        {
          userId: session.sub,
          title: "RoundUp Invested!",
          body: `EGP ${totalPendingAmount.toFixed(2)} has been added to your ${goalId ? "savings goal" : "investment portfolio"}.`,
          emoji: "🎉",
          type: "success",
        },
      ],
      { session: mongooseSession },
    );

    await mongooseSession.commitTransaction();

    return NextResponse.json({
      success: true,
      message: `Successfully invested EGP ${totalPendingAmount.toFixed(2)} from RoundUps`,
      investedAmount: totalPendingAmount,
      processedCount: pendingTransactions.length,
      targetGoalId: goalId || null,
    });
  } catch (error) {
    await mongooseSession.abortTransaction();
    console.error("RoundUp processing error:", error);
    return NextResponse.json(
      { error: "Failed to process RoundUps" },
      { status: 500 },
    );
  } finally {
    mongooseSession.endSession();
  }
}

export async function GET(request: Request) {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  try {
    const pendingTransactions = await Transaction.find({
      userId: session.sub,
      roundUp: { $gt: 0 },
      isRoundUpProcessed: false,
    });

    const totalPendingAmount =
      calculateTotalPendingRoundUps(pendingTransactions);

    const userSettings = await UserSettings.findOne({ userId: session.sub });
    const threshold = userSettings?.roundUpAutoInvestThreshold || 10;
    const roundUpMode: RoundUpMode = userSettings?.roundUpMode ?? "Eco";
    const wallet = await Wallet.findOne({ userId: session.sub });

    return NextResponse.json({
      pendingAmount: totalPendingAmount,
      threshold,
      roundUpMode,
      canProcess: shouldProcessRoundUps(
        totalPendingAmount,
        threshold,
        roundUpMode,
      ),
      walletPendingBalance: wallet?.pendingRoundUps || 0,
      transactionCount: pendingTransactions.length,
    });
  } catch (error) {
    console.error("Error fetching RoundUp status:", error);
    return NextResponse.json(
      { error: "Failed to fetch RoundUp status" },
      { status: 500 },
    );
  }
}
