import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const headers = new Headers(request.headers);
  const country =
    headers.get("x-vercel-ip-country") ||
    headers.get("cf-ipcountry") ||
    headers.get("x-country-code") ||
    null;

  const isSriLanka = country?.toUpperCase() === "LK";
  const market = isSriLanka ? "Sri Lanka" : "Australia";
  const currency = isSriLanka ? "LKR" : "AUD";

  return NextResponse.json({
    country,
    market,
    currency,
  });
}

