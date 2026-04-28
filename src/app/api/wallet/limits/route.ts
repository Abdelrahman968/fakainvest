import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Wallet } from "@/lib/models/Wallet";

const schema = z.object({
  daily_limit: z.number().positive().optional(),
  monthly_limit: z.number().positive().optional(),
  per_transaction_limit: z.number().positive().optional(),
  online_enabled: z.boolean().optional(),
  contactless_enabled: z.boolean().optional(),
  international_enabled: z.boolean().optional(),
  atm_enabled: z.boolean().optional(),
});

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  await connectDB();

  const updateData: Record<string, unknown> = {};
  if (parsed.data.daily_limit !== undefined) updateData.dailyLimit = parsed.data.daily_limit;
  if (parsed.data.monthly_limit !== undefined) updateData.monthlyLimit = parsed.data.monthly_limit;
  if (parsed.data.per_transaction_limit !== undefined) updateData.perTransactionLimit = parsed.data.per_transaction_limit;
  if (parsed.data.online_enabled !== undefined) updateData.onlineEnabled = parsed.data.online_enabled;
  if (parsed.data.contactless_enabled !== undefined) updateData.contactlessEnabled = parsed.data.contactless_enabled;
  if (parsed.data.international_enabled !== undefined) updateData.internationalEnabled = parsed.data.international_enabled;
  if (parsed.data.atm_enabled !== undefined) updateData.atmEnabled = parsed.data.atm_enabled;

  const wallet = await Wallet.findOneAndUpdate(
    { userId: session.sub },
    { $set: updateData },
    { new: true }
  );

  if (!wallet) return NextResponse.json({ error: "Wallet not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}