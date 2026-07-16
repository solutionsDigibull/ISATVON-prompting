import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#111111",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -2 }}>ISATVON</div>
        <div style={{ fontSize: 32, color: "#cccccc", marginTop: 24 }}>
          Structured Prompts for Reliable AI
        </div>
      </div>
    ),
    size
  );
}
