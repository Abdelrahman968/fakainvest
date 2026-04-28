import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { User } from "@/lib/models";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json({ users: [] });
  }

  await connectDB();

  const users = await User.find({
    _id: { $ne: session.sub },
    $or: [
      { email: { $regex: query, $options: "i" } },
      { displayName: { $regex: query, $options: "i" } },
    ],
  })
    .select("_id email displayName")
    .limit(10);

  return NextResponse.json({
    users: users.map((u) => ({
      id: u._id,
      name: u.displayName,
      email: u.email,
      avatar: u.displayName.charAt(0).toUpperCase(),
    })),
  });
}
