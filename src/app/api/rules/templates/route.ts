import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { ruleTemplates } from "@/lib/models/Rule";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ templates: ruleTemplates });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
