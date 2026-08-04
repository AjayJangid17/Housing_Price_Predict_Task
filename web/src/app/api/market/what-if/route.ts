import { NextResponse } from "next/server";
import { MARKET_API_URL as DEFAULT_MARKET_API_URL } from "@/lib/config";

const marketApiUrl = process.env.MARKET_API_URL ?? DEFAULT_MARKET_API_URL;

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const response = await fetch(new URL("/market/what-if", marketApiUrl).toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error ?? "Failed to call market what-if endpoint" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected server error" },
      { status: 500 }
    );
  }
}
