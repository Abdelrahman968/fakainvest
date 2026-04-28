import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Wallet } from "@/lib/models/Wallet";

const schema = z.object({
  frozen: z.boolean(),
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

  const wallet = await Wallet.findOneAndUpdate(
    { userId: session.sub },
    { $set: { frozen: parsed.data.frozen } },
    { new: true }
  );

  if (!wallet) return NextResponse.json({ error: "Wallet not found" }, { status: 404 });

  return NextResponse.json({ frozen: wallet.frozen });
}