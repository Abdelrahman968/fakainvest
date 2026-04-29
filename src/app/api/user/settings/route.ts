import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { UserSettings } from "@/lib/models/UserSettings";

export async function GET() {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const settings = await UserSettings.findOne({ userId: session.sub }).lean();

  return NextResponse.json({
    roundUpMode: settings?.roundUpMode || "Eco",
    roundUpEnabled: settings?.roundUpEnabled ?? true,
    customRoundUpAmount: settings?.customRoundUpAmount ?? 10,
    roundUpAutoInvestThreshold: settings?.roundUpAutoInvestThreshold ?? 20,
  });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const {
    roundUpMode,
    roundUpEnabled,
    customRoundUpAmount,
    roundUpAutoInvestThreshold,
  } = body;

  await connectDB();

  const updateData: any = { updatedAt: new Date() };
  if (roundUpMode !== undefined) updateData.roundUpMode = roundUpMode;
  if (roundUpEnabled !== undefined) updateData.roundUpEnabled = roundUpEnabled;
  if (customRoundUpAmount !== undefined)
    updateData.customRoundUpAmount = customRoundUpAmount;
  if (roundUpAutoInvestThreshold !== undefined)
    updateData.roundUpAutoInvestThreshold = roundUpAutoInvestThreshold;

  const settings = await UserSettings.findOneAndUpdate(
    { userId: session.sub },
    updateData,
    { upsert: true, new: true },
  ).lean();

  return NextResponse.json({
    roundUpMode: settings?.roundUpMode || "Eco",
    roundUpEnabled: settings?.roundUpEnabled ?? true,
    customRoundUpAmount: settings?.customRoundUpAmount ?? 10,
    roundUpAutoInvestThreshold: settings?.roundUpAutoInvestThreshold ?? 20,
  });
}
