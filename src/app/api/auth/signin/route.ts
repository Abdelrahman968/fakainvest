import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signInSchema } from "@/lib/validators";
import { signToken, cookieOptions, TOKEN_COOKIE } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { User } from "@/lib/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = signInSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const token = await signToken({
      sub: user._id.toString(),
      email: user.email,
      displayName: user.displayName,
    });

    const response = NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        displayName: user.displayName,
      },
    });

    response.cookies.set(TOKEN_COOKIE, token, cookieOptions);
    return response;
  } catch (err) {
    console.error("[signin]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
