import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { BudgetCategory } from "@/lib/models/Budget";
import mongoose from "mongoose";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { cap } = body;

    if (cap !== undefined && (cap < 0 || cap === null)) {
      return NextResponse.json(
        { error: "Cap must be greater than or equal to 0" },
        { status: 400 },
      );
    }

    await connectDB();

    const category = await BudgetCategory.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(session.sub),
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    if (cap !== undefined) {
      category.cap = cap;
    }

    await category.save();

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error("Error updating budget category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 },
      );
    }

    await connectDB();

    const category = await BudgetCategory.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(session.sub),
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    await category.deleteOne();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting budget category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
