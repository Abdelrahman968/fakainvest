import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Transaction } from "@/lib/models/Transaction";
import { Wallet } from "@/lib/models/Wallet";

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getSession();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const transaction = await Transaction.findOne({
      id: params.id,
      userId: session.sub,
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    if (transaction.status !== "Pending") {
      return NextResponse.json(
        { error: "Transaction already invested" },
        { status: 400 },
      );
    }

    transaction.status = "Completed";
    await transaction.save();

    await Wallet.updateOne(
      { userId: session.sub },
      { $inc: { balance: transaction.roundUp } },
      { upsert: true },
    );

    return NextResponse.json({
      success: true,
      amount: transaction.roundUp,
    });
  } catch (error) {
    console.error("Error investing transaction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
