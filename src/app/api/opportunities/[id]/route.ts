import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_BASE = (
  process.env.BACKEND_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3001"
).replace(/\/$/, "");

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const url = `${BACKEND_API_BASE}/api/opportunities/${id}`;

    const response = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    const body = await response.text();
    return new NextResponse(body, {
      status: response.status,
      headers: {
        "content-type": response.headers.get("content-type") || "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to proxy opportunity request to backend." },
      { status: 502 }
    );
  }
}
