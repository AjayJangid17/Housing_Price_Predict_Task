import { NextResponse } from "next/server";
import { ESTIMATOR_API_URL as DEFAULT_ESTIMATOR_API_URL } from "@/lib/config";

const estimatorApiUrl = process.env.ESTIMATOR_API_URL ?? DEFAULT_ESTIMATOR_API_URL;

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const response = await fetch(new URL("/estimate", estimatorApiUrl).toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    console.log('response',response)
    console.log('payload',payload)

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      return NextResponse.json(
        { error: data?.detail ?? "Estimate request failed" },
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
