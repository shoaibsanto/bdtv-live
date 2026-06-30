"use client";

import { useEffect, useRef, useState } from "react";

type PlayerState = "idle" | "loading" | "playing" | "error";

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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const proxied = `/api/stream?url=${encodeURIComponent(src)}`;
    let hls: import("hls.js").default | null = null;
    let cancelled = false;

    setState("loading");

    const onPlaying = () => !cancelled && setState("playing");
    video.addEventListener("playing", onPlaying);

    async function setup() {
      // Safari / iOS have native HLS support.
      if (video!.canPlayType("application/vnd.apple.mpegurl")) {
        video!.src = proxied;
        try {
          await video!.play();
        } catch {
          /* autoplay may be blocked; user can tap play */
        }
        return;
      }

      const Hls = (await import("hls.js")).default;
      if (cancelled) return;

      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 30,
          maxBufferLength: 30,
          manifestLoadingMaxRetry: 4,
          levelLoadingMaxRetry: 4,
          fragLoadingMaxRetry: 6,
        });
        hls.loadSource(proxied);
        hls.attachMedia(video!);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video!.play().catch(() => {
            /* autoplay blocked */
          });
        });
        hls.on(Hls.Events.ERROR, (_evt, data) => {
          if (!data.fatal) return;
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls?.recoverMediaError();
              break;
            default:
              if (!cancelled) setState("error");
              hls?.destroy();
          }
        });
      } else {
        setState("error");
      }
    }

    setup();

    return () => {
      cancelled = true;
      video.removeEventListener("playing", onPlaying);
      hls?.destroy();
    };
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
          <p className="player__hint">The stream is temporarily unavailable.</p>
          <button className="btn" onClick={() => setReloadKey((k) => k + 1)}>
            আবার চেষ্টা করুন / Retry
          </button>
        </div>
      )}
    </div>
  );
}
