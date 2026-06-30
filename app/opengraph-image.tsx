import { ImageResponse } from "next/og";
import { channels } from "@/lib/channels";

export const runtime = "edge";
export const alt = "BDTV Live — Bangladeshi Live TV Channels";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "70px",
          background: "linear-gradient(135deg, #0a7d5a 0%, #0a84d6 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 38, opacity: 0.9, display: "flex" }}>▶ BDTV Live</div>
        <div style={{ fontSize: 80, fontWeight: 800, lineHeight: 1.1, marginTop: 20, display: "flex" }}>
          Bangladeshi Live TV
        </div>
        <div style={{ fontSize: 40, marginTop: 16, display: "flex" }}>
          {channels.length}+ channels · Free · HD · Mobile friendly
        </div>
        <div style={{ fontSize: 30, marginTop: 30, opacity: 0.85, display: "flex" }}>
          News · Entertainment · Sports · Movies · Music · Kids
        </div>
      </div>
    ),
    { ...size },
  );
}
