import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { User } from "@/lib/models";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const resolvedParams = await params;
  const userId = resolvedParams.id;

  try {
    const user = await User.findById(userId).select("_id displayName email");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        _id: user._id,
        displayName: user.displayName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}
