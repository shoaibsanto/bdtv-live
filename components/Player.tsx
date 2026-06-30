"use client";

import { useEffect, useRef, useState } from "react";

type PlayerState = "loading" | "playing" | "error";

export default function Player({
  src,
  poster,
  title,
}: {
  src: string;
  poster?: string;
  title: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<PlayerState>("loading");
  const [reloadKey, setReloadKey] = useState(0);

  // http upstreams can't be played directly on an https page (mixed content),
  // so go straight to the proxy. https upstreams try direct first (works when the
  // CDN sends CORS headers — most do), then fall back to the proxy.
  const proxied = `/api/stream?url=${encodeURIComponent(src)}`;
  const candidates = src.startsWith("http://") ? [proxied] : [src, proxied];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: import("hls.js").default | null = null;
    let cancelled = false;
    setState("loading");

    const onPlaying = () => !cancelled && setState("playing");
    video.addEventListener("playing", onPlaying);

    async function attach(Hls: typeof import("hls.js").default, url: string, attempt: number) {
      const native = video!.canPlayType("application/vnd.apple.mpegurl");

      // Native HLS (Safari / iOS): no CORS enforcement on media.
      if (native && (attempt === 0 || !Hls.isSupported())) {
        video!.src = url;
        const onErr = () => {
          if (cancelled) return;
          if (attempt + 1 < candidates.length) attach(Hls, candidates[attempt + 1], attempt + 1);
          else setState("error");
        };
        video!.addEventListener("error", onErr, { once: true });
        try {
          await video!.play();
        } catch {
          /* autoplay blocked — controls available */
        }
        return;
      }

      if (Hls.isSupported()) {
        hls?.destroy();
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 30,
          maxBufferLength: 30,
          manifestLoadingMaxRetry: 2,
          levelLoadingMaxRetry: 2,
          fragLoadingMaxRetry: 4,
        });
        hls.loadSource(url);
        hls.attachMedia(video!);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video!.play().catch(() => {});
        });
        hls.on(Hls.Events.ERROR, (_e, data) => {
          if (!data.fatal || cancelled) return;
          if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            hls?.recoverMediaError();
            return;
          }
          // network / other fatal: try next candidate source, else give up.
          if (attempt + 1 < candidates.length) {
            attach(Hls, candidates[attempt + 1], attempt + 1);
          } else {
            setState("error");
            hls?.destroy();
          }
        });
      } else {
        setState("error");
      }
    }

    (async () => {
      const Hls = (await import("hls.js")).default;
      if (!cancelled) attach(Hls, candidates[0], 0);
    })();

    return () => {
      cancelled = true;
      video.removeEventListener("playing", onPlaying);
      hls?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, reloadKey]);

  return (
    <div className="player">
      <video
        ref={videoRef}
        className="player__video"
        poster={poster}
        controls
        playsInline
        autoPlay
        muted
        preload="auto"
        aria-label={`${title} live stream player`}
      />
      {state === "loading" && (
        <div className="player__overlay" aria-live="polite">
          <div className="spinner" />
          <p>লোড হচ্ছে… / Loading {title}</p>
        </div>
      )}
      {state === "error" && (
        <div className="player__overlay player__overlay--error" role="alert">
          <p>স্ট্রিমটি এই মুহূর্তে চালু হচ্ছে না।</p>
          <p className="player__hint">
            The stream is temporarily unavailable or geo-restricted to Bangladesh.
          </p>
          <button className="btn" onClick={() => setReloadKey((k) => k + 1)}>
            আবার চেষ্টা করুন / Retry
          </button>
        </div>
      )}
    </div>
  );
}
