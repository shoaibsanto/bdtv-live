import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

function isPlaylist(url: string, contentType: string): boolean {
  const ct = contentType.toLowerCase();
  if (ct.includes("mpegurl") || ct.includes("application/x-mpegurl")) return true;
  const path = url.split("?")[0].toLowerCase();
  return path.endsWith(".m3u8");
}

function proxify(absoluteUrl: string): string {
  return `/api/stream?url=${encodeURIComponent(absoluteUrl)}`;
}

/**
 * Rewrite an HLS manifest so every segment / sub-playlist / key URI is fetched
 * back through this same proxy. This is what makes streams that lack CORS
 * headers (most Bangladeshi IPTV CDNs) playable inside a browser via hls.js,
 * and upgrades insecure http:// upstreams to a secure same-origin request.
 */
function rewriteManifest(text: string, baseUrl: string): string {
  return text
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (trimmed === "") return line;

      if (trimmed.startsWith("#")) {
        // Rewrite URI="..." inside tags such as EXT-X-KEY, EXT-X-MEDIA, EXT-X-MAP.
        if (trimmed.includes('URI="')) {
          return line.replace(/URI="([^"]+)"/g, (_m, uri) => {
            try {
              const abs = new URL(uri, baseUrl).href;
              return `URI="${proxify(abs)}"`;
            } catch {
              return `URI="${uri}"`;
            }
          });
        }
        return line;
      }

      // Resource line: a segment or a sub-playlist (may be relative).
      try {
        const abs = new URL(trimmed, baseUrl).href;
        return proxify(abs);
      } catch {
        return line;
      }
    })
    .join("\n");
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  const target = req.nextUrl.searchParams.get("url");
  if (!target) {
    return new Response("Missing 'url' parameter", { status: 400, headers: CORS_HEADERS });
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return new Response("Invalid url", { status: 400, headers: CORS_HEADERS });
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return new Response("Unsupported protocol", { status: 400, headers: CORS_HEADERS });
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      headers: {
        "User-Agent": USER_AGENT,
        Referer: `${parsed.protocol}//${parsed.host}/`,
        Origin: `${parsed.protocol}//${parsed.host}`,
        Accept: "*/*",
      },
      redirect: "follow",
      cache: "no-store",
    });
  } catch {
    return new Response("Upstream fetch failed", { status: 502, headers: CORS_HEADERS });
  }

  if (!upstream.ok && upstream.status >= 400) {
    return new Response(`Upstream error ${upstream.status}`, {
      status: upstream.status,
      headers: CORS_HEADERS,
    });
  }

  const contentType = upstream.headers.get("content-type") || "";
  const finalUrl = upstream.url || target;

  if (isPlaylist(finalUrl, contentType)) {
    const body = await upstream.text();
    const rewritten = rewriteManifest(body, finalUrl);
    return new Response(rewritten, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/vnd.apple.mpegurl",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  }

  // Binary media segment (.ts / .aac / key) — stream the bytes straight through.
  const headers = new Headers(CORS_HEADERS);
  headers.set("Content-Type", contentType || "application/octet-stream");
  headers.set("Cache-Control", "no-store, max-age=0");
  const len = upstream.headers.get("content-length");
  if (len) headers.set("Content-Length", len);

  return new Response(upstream.body, { status: upstream.status, headers });
}
