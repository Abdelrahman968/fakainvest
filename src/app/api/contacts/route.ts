import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Transfer, User } from "@/lib/models";

export async function GET() {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  try {
    const transfers = await Transfer.find({
      userId: session.sub,
      type: { $in: ["sent", "received"] },
    })
      .sort({ createdAt: -1 })
      .limit(50);

    const contactIds = new Map<
      string,
      { name: string; email: string; lastTransaction: Date }
    >();

    for (const transfer of transfers) {
      if (
        transfer.counterpartyId &&
        !contactIds.has(transfer.counterpartyId.toString())
      ) {
        const user = await User.findById(transfer.counterpartyId).select(
          "displayName email",
        );
        if (user) {
          contactIds.set(transfer.counterpartyId.toString(), {
            name: user.displayName,
            email: user.email,
            lastTransaction: transfer.createdAt,
          });
        }
      }
    }

    const contacts = Array.from(contactIds.entries()).map(([id, data]) => ({
      id,
      name: data.name,
      email: data.email,
      lastTransaction: data.lastTransaction,
    }));

    return NextResponse.json({ contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 },
    );
  }
}
