import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const apiKey = process.env.YOUVERSION_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "YOUVERSION_API_KEY not configured" }, { status: 500 });
  }

  const { path } = await params;
  const apiPath = path.join("/");
  const url = new URL(`/v1/${apiPath}`, "https://api.youversion.com");

  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url.toString(), {
    headers: {
      "X-YVP-App-Key": apiKey,
      Accept: "application/json",
    },
  });

  const data = await response.text();

  const headers = new Headers({
    "Content-Type": response.headers.get("Content-Type") ?? "application/json",
  });

  // Preserve YouVersion's retention directive through the proxy. WKWebView
  // and browsers can then apply the same cache policy as the upstream API.
  for (const name of ["Cache-Control", "ETag", "Last-Modified", "Expires", "Vary"]) {
    const value = response.headers.get(name);
    if (value) headers.set(name, value);
  }

  return new NextResponse(data, { status: response.status, headers });
}
