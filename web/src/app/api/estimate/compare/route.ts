import { NextResponse } from "next/server";
import { ESTIMATOR_API_URL as DEFAULT_ESTIMATOR_API_URL } from "@/lib/config";

const estimatorApiUrl = process.env.ESTIMATOR_API_URL ?? DEFAULT_ESTIMATOR_API_URL;

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const response = await fetch(new URL("/estimate/compare", estimatorApiUrl).toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      return NextResponse.json(
        { error: data?.detail ?? "Estimate comparison failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
