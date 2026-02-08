import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return new Response("Missing ?url=", { status: 400 });
  }

  // Basic safety: only allow your Supabase storage domain (avoid turning this into an open proxy)
  const allowedHost = "ihzytkomakaqhkqdrval.supabase.co";
  try {
    const u = new URL(url);
    if (u.host !== allowedHost) {
      return new Response("Host not allowed", { status: 403 });
    }
  } catch {
    return new Response("Bad url", { status: 400 });
  }

  const upstream = await fetch(url, {
    // Optional: avoid cached wrong headers
    cache: "no-store",
  });

  if (!upstream.ok) {
    return new Response(`Upstream error: ${upstream.status}`, { status: 502 });
  }

  const html = await upstream.text();

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // If your HTML references relative assets, this helps a bit:
      // (still better to use absolute URLs in your HTML)
      "Cache-Control": "public, max-age=60",
    },
  });
}
