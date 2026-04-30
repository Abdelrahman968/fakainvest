import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { BankCertificate } from "@/lib/models/BankCertificate";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    let certificates = await BankCertificate.find().sort({ rate: -1 }).lean();

    if (!certificates || certificates.length === 0) {
      return NextResponse.json({ certificates: [] });
    }

    return NextResponse.json({ certificates });
  } catch (error) {
    console.error("Error fetching certificates:", error);
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
    const { bank, name, rate, term, min, isBest } = body;

    await connectDB();

    const certificate = await BankCertificate.create({
      bank,
      name,
      rate,
      term,
      min,
      isBest: isBest || false,
    });

    return NextResponse.json({ certificate }, { status: 201 });
  } catch (error) {
    console.error("Error creating certificate:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
