import { NextResponse } from "next/server";
import { MARKET_API_URL as DEFAULT_MARKET_API_URL } from "@/lib/config";

const marketApiUrl = process.env.MARKET_API_URL ?? DEFAULT_MARKET_API_URL;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") ?? "csv";
    const response = await fetch(new URL(`/market/export?format=${format}`, marketApiUrl).toString());

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const contentType = response.headers.get("content-type") ?? "application/octet-stream";
    const contentDisposition = response.headers.get("content-disposition") ?? "attachment";
    const buffer = Buffer.from(await response.arrayBuffer());

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected export error" },
      { status: 500 }
    );
  }
}
