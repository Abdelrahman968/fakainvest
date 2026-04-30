import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Property } from "@/lib/models/Property";
import { PropertyHolding } from "@/lib/models/PropertyHolding";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const properties = await Property.find().sort({ createdAt: 1 }).lean();
    const holdings = await PropertyHolding.find({
      userId: new mongoose.Types.ObjectId(session.sub),
    }).lean();

    return NextResponse.json({ properties, holdings });
  } catch (error) {
    console.error("Error fetching properties:", error);
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
    const { propertyId, shares } = body;

    if (!propertyId || !shares || shares <= 0) {
      return NextResponse.json(
        { error: "Property ID and valid shares are required" },
        { status: 400 },
      );
    }

    await connectDB();

    const userId = new mongoose.Types.ObjectId(session.sub);
    const property = await Property.findById(propertyId).lean();

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 },
      );
    }

    if (shares > property.shares_available) {
      return NextResponse.json(
        { error: "Not enough shares available" },
        { status: 400 },
      );
    }

    const cost = shares * property.share_price;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const meResponse = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { cookie: request.headers.get("cookie") || "" },
    });
    const meData = await meResponse.json();
    const currentBalance = meData.user?.currentBalance || 0;

    if (currentBalance < cost) {
      return NextResponse.json(
        { error: "Insufficient wallet balance" },
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
        amount: cost,
        reason: `Buy ${shares} shares of ${property.name}`,
      }),
    });

    await Property.findByIdAndUpdate(propertyId, {
      $inc: { shares_available: -shares },
    });

    const existingHolding = await PropertyHolding.findOne({
      userId,
      propertyId: new mongoose.Types.ObjectId(propertyId),
    });

    if (existingHolding) {
      await PropertyHolding.findByIdAndUpdate(existingHolding._id, {
        $inc: { shares },
      });
    } else {
      await PropertyHolding.create({
        userId,
        propertyId: new mongoose.Types.ObjectId(propertyId),
        shares,
      });
    }

    return NextResponse.json({ success: true, cost });
  } catch (error) {
    console.error("Error buying shares:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
