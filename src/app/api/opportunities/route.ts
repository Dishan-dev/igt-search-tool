import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_BASE = (
  process.env.BACKEND_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3001"
).replace(/\/$/, "");

const BACKEND_OPPORTUNITIES_URL = `${BACKEND_API_BASE}/api/opportunities`;

export async function GET(request: NextRequest) {
  try {
    const queryString = request.nextUrl.searchParams.toString();
    const url = `${BACKEND_OPPORTUNITIES_URL}${queryString ? `?${queryString}` : ""}`;
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
      { message: "Failed to proxy opportunities request to backend." },
      { status: 502 }
    );
  }
}
