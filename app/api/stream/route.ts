import { NextRequest } from "next/server";
import { ProxyAgent, fetch as undiciFetch } from "undici";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36";

// Optional upstream proxy (e.g. a Bangladesh residential exit). Used as a
// fallback when a direct fetch fails — lets geo-restricted CDNs (gpcdn etc.)
// work for visitors outside Bangladesh — and as the *primary* path for CDNs that
// issue IP-bound tokens (see IP_BOUND_HOSTS below). Disabled unless UPSTREAM_PROXY
// is set, so credentials never live in the repo and no proxy bandwidth is used by
// default.
const UPSTREAM_PROXY = process.env.UPSTREAM_PROXY;
let proxyDispatcher: ProxyAgent | undefined;
function getProxyDispatcher(): ProxyAgent | undefined {
  if (!UPSTREAM_PROXY) return undefined;
  if (!proxyDispatcher) proxyDispatcher = new ProxyAgent(UPSTREAM_PROXY);
  return proxyDispatcher;
}

// Hosts that hand out IP-bound Akamai tokens (hdntl / hdnts). For these, every
// hop — master manifest, sub-playlists AND segments — must egress from the SAME
// IP or the CDN answers 403. On serverless each /api/stream invocation can get a
// different egress IP, so the master mints a token for IP-A while the segment
// request arrives from IP-B → the stream loads its poster then dies. Pinning
// these hosts to the single stable-IP upstream proxy keeps the whole chain on one
// IP. Without UPSTREAM_PROXY set these behave as before (direct, likely 403).
const IP_BOUND_HOSTS = ["kwikmotion.com", "aloula-redirect.vercel.app"];
function needsStableEgress(host: string): boolean {
  return IP_BOUND_HOSTS.some((h) => host === h || host.endsWith("." + h));
}

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

  const fetchOpts = (useProxy: boolean): Parameters<typeof undiciFetch>[1] => {
    // undici's fetch honours the `dispatcher` option (Next.js patches the global
    // fetch and strips it), so we always use undiciFetch for upstream requests.
    const opts: Parameters<typeof undiciFetch>[1] = {
      headers: {
        "User-Agent": USER_AGENT,
        Referer: `${parsed.protocol}//${parsed.host}/`,
        // No Origin header: this is a server-to-server fetch, so Origin serves no
        // purpose — and Akamai-signed CDNs (kwikmotion, via aloula-redirect)
        // reject any request carrying Origin with 403, treating it as a
        // disallowed cross-origin browser call.
        Accept: "*/*",
      },
      redirect: "follow",
    };
    if (useProxy) opts!.dispatcher = getProxyDispatcher();
    return opts;
  };

  type UpstreamResponse = Awaited<ReturnType<typeof undiciFetch>>;
  let upstream: UpstreamResponse;
  // IP-bound CDNs must go through the proxy first so the token is minted and
  // used from one stable IP; everything else stays direct-first (proxy is only a
  // geo fallback). If no proxy is configured, preferProxy is false either way.
  const preferProxy = needsStableEgress(parsed.host) && !!getProxyDispatcher();
  try {
    upstream = await undiciFetch(target, fetchOpts(preferProxy));
    // Primary attempt failed → try the other path once (proxy⇄direct).
    if (!upstream.ok && upstream.status >= 400 && getProxyDispatcher()) {
      upstream = await undiciFetch(target, fetchOpts(!preferProxy));
    }
  } catch {
    if (getProxyDispatcher()) {
      try {
        upstream = await undiciFetch(target, fetchOpts(!preferProxy));
      } catch {
        return new Response("Upstream fetch failed", { status: 502, headers: CORS_HEADERS });
      }
    } else {
      return new Response("Upstream fetch failed", { status: 502, headers: CORS_HEADERS });
    }
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

  return new Response(upstream.body as unknown as BodyInit, { status: upstream.status, headers });
}
