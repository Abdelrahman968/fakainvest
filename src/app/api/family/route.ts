import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { FamilyMember, FamilyChore } from "@/lib/models/Family";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const parentUserId = new mongoose.Types.ObjectId(session.sub);

    const members = await FamilyMember.find({ parentUserId })
      .sort({ createdAt: 1 })
      .lean();
    const chores = await FamilyChore.find({ parentUserId })
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({ members, chores });
  } catch (error) {
    console.error("Error fetching family data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, data } = body;

    await connectDB();
    const parentUserId = new mongoose.Types.ObjectId(session.sub);

    if (type === "addMember") {
      const { name, emoji, role, allowance, weeklyLimit, color } = data;

      if (!name?.trim()) {
        return NextResponse.json(
          { error: "Name is required" },
          { status: 400 },
        );
      }

      const member = await FamilyMember.create({
        parentUserId,
        name: name.trim(),
        emoji: emoji || "👤",
        role: role || "Member",
        allowance: allowance || 0,
        balance: 0,
        weeklyLimit: weeklyLimit || 500,
        spentThisWeek: 0,
        color: color || "#6366f1",
      });

      return NextResponse.json({ member }, { status: 201 });
    }

    if (type === "sendAllowance") {
      const { memberId, amount } = data;

      if (!memberId || !amount || amount <= 0) {
        return NextResponse.json(
          { error: "Invalid amount or member" },
          { status: 400 },
        );
      }

      const member = await FamilyMember.findOne({
        _id: memberId,
        parentUserId,
      });
      if (!member) {
        return NextResponse.json(
          { error: "Member not found" },
          { status: 404 },
        );
      }

      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const meResponse = await fetch(`${baseUrl}/api/auth/me`, {
        headers: { cookie: request.headers.get("cookie") || "" },
      });
      const meData = await meResponse.json();
      const currentBalance = meData.user?.currentBalance || 0;

      if (currentBalance < amount) {
        return NextResponse.json(
          { error: "Insufficient balance" },
          { status: 400 },
        );
      }

      await fetch(`${baseUrl}/api/wallet/spend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: request.headers.get("cookie") || "",
        },
        body: JSON.stringify({
          amount,
          reason: `Allowance for ${member.name}`,
        }),
      });

      member.balance += amount;
      await member.save();

      return NextResponse.json({ member });
    }

    if (type === "addChore") {
      const { memberId, title, reward } = data;

      if (!title?.trim()) {
        return NextResponse.json(
          { error: "Title is required" },
          { status: 400 },
        );
      }

      const chore = await FamilyChore.create({
        memberId:
          memberId && memberId !== "null"
            ? new mongoose.Types.ObjectId(memberId)
            : undefined,
        parentUserId,
        title: title.trim(),
        reward: reward || 0,
        done: false,
      });

      return NextResponse.json({ chore }, { status: 201 });
    }

    if (type === "toggleChore") {
      const { choreId, done } = data;

      const chore = await FamilyChore.findOne({ _id: choreId, parentUserId });
      if (!chore) {
        return NextResponse.json({ error: "Chore not found" }, { status: 404 });
      }

      chore.done = done;
      await chore.save();

      if (done === true && chore.reward > 0 && chore.memberId) {
        const member = await FamilyMember.findOne({
          _id: chore.memberId,
          parentUserId,
        });
        if (member) {
          member.balance += chore.reward;
          await member.save();
        }
      }

      return NextResponse.json({ chore });
    }

    if (type === "updateMember") {
      const { memberId, spentThisWeek } = data;

      const member = await FamilyMember.findOne({
        _id: memberId,
        parentUserId,
      });
      if (!member) {
        return NextResponse.json(
          { error: "Member not found" },
          { status: 404 },
        );
      }

      if (spentThisWeek !== undefined) {
        member.spentThisWeek = spentThisWeek;
      }

      await member.save();
      return NextResponse.json({ member });
    }

    return NextResponse.json(
      { error: "Invalid request type" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Error in family API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");

    await connectDB();
    const parentUserId = new mongoose.Types.ObjectId(session.sub);

    if (type === "member" && id) {
      await FamilyChore.deleteMany({
        memberId: new mongoose.Types.ObjectId(id),
        parentUserId,
      });
      await FamilyMember.deleteOne({ _id: id, parentUserId });
      return NextResponse.json({ success: true });
    }

    if (type === "chore" && id) {
      await FamilyChore.deleteOne({ _id: id, parentUserId });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("Error deleting family data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
