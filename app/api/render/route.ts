import { NextRequest } from "next/server";

const allowedFileTypes = ["html", "md"];

export async function GET(req: NextRequest) {
  const filePath = req.nextUrl.searchParams.get("path");
  if (!filePath) {
    return new Response("Missing ?path=", { status: 400 });
  }

  const [fileName, fileExtension] = filePath.split(".");

  if (!allowedFileTypes.includes(fileExtension)) {
    return new Response("File type not allowed", { status: 403 });
  }

  const allowedHost = "ihzytkomakaqhkqdrval.supabase.co";
  let url: URL;

  try {
    url = new URL(`https://${allowedHost}/storage/v1/object/public/next-voters-summaries/public/${filePath}`);
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

  const contentType = fileExtension === "html" ? "text/html" : "text/markdown";

  return new Response(await upstream.text(), {
    status: 200,
    headers: {
      "Content-Type": `${contentType}; charset=utf-8`,
      "Cache-Control": "public, max-age=60",
    },
  });
}
