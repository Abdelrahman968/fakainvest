import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Transfer } from "@/lib/models/Transfer";

export async function GET() {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const transfers = await Transfer.find({ userId: session.sub })
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  return NextResponse.json({
    transfers: transfers.map(t => ({
      id: t._id.toString(),
      user_id: t.userId.toString(),
      type: t.type,
      counterparty: t.counterparty,
      avatar: t.avatar,
      amount: t.amount,
      note: t.note,
      method: t.method,
      created_at: t.createdAt.toISOString(),
    })),
  });
}