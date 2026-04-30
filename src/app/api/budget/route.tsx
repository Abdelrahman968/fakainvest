import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { BudgetCategory } from "@/lib/models/Budget";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const categories = await BudgetCategory.find({
      userId: new mongoose.Types.ObjectId(session.sub),
    }).sort({ createdAt: 1 });

    const transformedCategories = categories.map((cat) => ({
      id: cat._id.toString(),
      user_id: cat.userId.toString(),
      name: cat.name,
      emoji: cat.emoji,
      cap: cat.cap,
      spent: cat.spent,
      last_month: cat.lastMonth,
      month_key: cat.monthKey,
      created_at: cat.createdAt.toISOString(),
      updated_at: cat.updatedAt.toISOString(),
    }));

    return NextResponse.json({ categories: transformedCategories });
  } catch (error) {
    console.error("Error fetching budget:", error);
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
    const { name, emoji, cap, monthKey } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!cap || cap <= 0) {
      return NextResponse.json(
        { error: "Cap must be greater than 0" },
        { status: 400 },
      );
    }

    await connectDB();

    const existing = await BudgetCategory.findOne({
      userId: new mongoose.Types.ObjectId(session.sub),
      name: name.trim(),
      monthKey: monthKey || new Date().toISOString().slice(0, 7),
    });

    if (existing) {
      return NextResponse.json(
        { error: "Category already exists for this month" },
        { status: 400 },
      );
    }

    const category = await BudgetCategory.create({
      userId: new mongoose.Types.ObjectId(session.sub),
      name: name.trim(),
      emoji: emoji || "📦",
      cap,
      spent: 0,
      lastMonth: 0,
      monthKey: monthKey || new Date().toISOString().slice(0, 7),
    });

    return NextResponse.json(
      {
        category: {
          id: category._id.toString(),
          user_id: category.userId.toString(),
          name: category.name,
          emoji: category.emoji,
          cap: category.cap,
          spent: category.spent,
          last_month: category.lastMonth,
          month_key: category.monthKey,
          created_at: category.createdAt.toISOString(),
          updated_at: category.updatedAt.toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating budget category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
