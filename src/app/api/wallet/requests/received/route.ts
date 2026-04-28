import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { PaymentRequest } from "@/lib/models";

export async function GET() {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  try {
    const requests = await PaymentRequest.find({
      recipientId: session.sub,
      status: "pending",
    }).sort({ createdAt: -1 });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("GET received requests error:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 },
    );
  }
}
