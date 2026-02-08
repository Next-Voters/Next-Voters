import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const filePath = req.nextUrl.searchParams.get("path");
  if (!filePath) {
    return new Response("Missing ?path=", { status: 400 });
  }

  const allowedHost = "next-voters-summaries.supabase.co";
  let url: URL;

  try {
    url = new URL(`https://${allowedHost}/storage/v1/object/public/${filePath}`);
    if (url.host !== allowedHost) {
      return new Response("Host not allowed", { status: 403 });
    }
  } catch {
    return new Response("Bad url", { status: 400 });
  }

  const upstream = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!upstream.ok) {
    const errorText = await upstream.text().catch(() => "");
    return new Response(
      `Upstream error: ${upstream.status}\nURL: ${url.toString()}\n\n${errorText.slice(0, 1000)}`,
      { status: 502 }
    );
  }

  const html = await upstream.text();

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=60",
    },
  });
}
