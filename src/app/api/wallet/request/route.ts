import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import {
  User,
  PaymentRequest,
  Wallet,
  Transfer,
  Notification,
} from "@/lib/models";
import mongoose from "mongoose";

const schema = z.object({
  amount: z.number().positive().max(100000, "Amount too high"),
  to: z.string().trim().min(1, "Recipient is required"),
  note: z.string().max(200).default(""),
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

  const { amount, to, note } = parsed.data;

  await connectDB();

  try {
    let recipientUser;
    if (to.includes("@")) {
      recipientUser = await User.findOne({ email: to });
    } else {
      recipientUser = await User.findById(to);
    }

    if (!recipientUser) {
      return NextResponse.json(
        { error: "Recipient not found" },
        { status: 404 },
      );
    }

    const requester = await User.findById(session.sub);
    if (!requester) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const paymentRequest = await PaymentRequest.create({
      requesterId: session.sub,
      requesterName: requester.displayName,
      recipientId: recipientUser._id,
      recipientName: recipientUser.displayName,
      amount,
      note,
      status: "pending",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return NextResponse.json({
      ok: true,
      requestId: paymentRequest._id,
      message: `Payment request sent to ${recipientUser.email}`,
    });
  } catch (error) {
    console.error("Request error:", error);
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "received";

    let requests;
    if (type === "received") {
      requests = await PaymentRequest.find({
        recipientId: session.sub,
        status: "pending",
      }).sort({ createdAt: -1 });
    } else {
      requests = await PaymentRequest.find({
        requesterId: session.sub,
      }).sort({ createdAt: -1 });
    }

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("GET requests error:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { requestId, action } = body;

  if (!requestId || !["accept", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await connectDB();

  const mongooseSession = await mongoose.startSession();
  mongooseSession.startTransaction();

  try {
    const paymentRequest =
      await PaymentRequest.findById(requestId).session(mongooseSession);

    if (!paymentRequest) {
      await mongooseSession.abortTransaction();
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (paymentRequest.recipientId.toString() !== session.sub) {
      await mongooseSession.abortTransaction();
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (paymentRequest.status !== "pending") {
      await mongooseSession.abortTransaction();
      return NextResponse.json(
        { error: "Request already processed" },
        { status: 400 },
      );
    }

    if (action === "reject") {
      paymentRequest.status = "rejected";
      await paymentRequest.save({ session: mongooseSession });
      await mongooseSession.commitTransaction();
      return NextResponse.json({ ok: true, status: "rejected" });
    }

    const senderWallet = await Wallet.findOne({ userId: session.sub }).session(
      mongooseSession,
    );
    const requesterWallet = await Wallet.findOne({
      userId: paymentRequest.requesterId.toString(),
    }).session(mongooseSession);

    if (!senderWallet || !requesterWallet) {
      await mongooseSession.abortTransaction();
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (senderWallet.balance < paymentRequest.amount) {
      await mongooseSession.abortTransaction();
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 422 },
      );
    }

    senderWallet.balance -= paymentRequest.amount;
    requesterWallet.balance += paymentRequest.amount;

    await senderWallet.save({ session: mongooseSession });
    await requesterWallet.save({ session: mongooseSession });

    paymentRequest.status = "completed";
    await paymentRequest.save({ session: mongooseSession });

    await Transfer.create(
      [
        {
          userId: session.sub,
          type: "sent",
          counterparty: paymentRequest.requesterName,
          counterpartyId: paymentRequest.requesterId,
          amount: paymentRequest.amount,
          note: paymentRequest.note || "Payment request",
          method: "Wallet",
        },
        {
          userId: paymentRequest.requesterId,
          type: "received",
          counterparty: paymentRequest.recipientName,
          counterpartyId: session.sub,
          amount: paymentRequest.amount,
          note: paymentRequest.note || "Payment request",
          method: "Wallet",
        },
      ],
      { session: mongooseSession },
    );

    await Notification.create(
      [
        {
          userId: session.sub,
          title: "💸 Payment Sent",
          body: `You sent EGP ${paymentRequest.amount.toLocaleString()} to ${paymentRequest.requesterName}`,
          emoji: "💸",
          type: "social",
        },
        {
          userId: paymentRequest.requesterId,
          title: "🎉 Payment Request Fulfilled",
          body: `${paymentRequest.recipientName} sent you EGP ${paymentRequest.amount.toLocaleString()}`,
          emoji: "🎉",
          type: "social",
        },
      ],
      { session: mongooseSession },
    );

    await mongooseSession.commitTransaction();

    return NextResponse.json({ ok: true, status: "completed" });
  } catch (error) {
    await mongooseSession.abortTransaction();
    console.error("Request action error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  } finally {
    mongooseSession.endSession();
  }
}
