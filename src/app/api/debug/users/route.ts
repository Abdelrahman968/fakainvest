import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { User } from "@/lib/models";

export async function GET() {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const users = await User.find({}).select("_id displayName email");

  return NextResponse.json({
    currentUser: session.sub,
    users: users.map((u) => ({
      id: u._id,
      name: u.displayName,
      email: u.email,
    })),
  });
}
