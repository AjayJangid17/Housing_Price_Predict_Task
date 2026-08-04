import { NextResponse } from "next/server";
import { ESTIMATOR_API_URL as DEFAULT_ESTIMATOR_API_URL } from "@/lib/config";

const estimatorApiUrl = process.env.ESTIMATOR_API_URL ?? DEFAULT_ESTIMATOR_API_URL;

export async function GET() {
  try {
    const response = await fetch(new URL("/estimate/history", estimatorApiUrl).toString());
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.detail ?? "Failed to fetch history" },
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
