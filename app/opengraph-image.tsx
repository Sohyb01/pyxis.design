import { ImageResponse } from "next/og";
import { siteConfig, socialImage } from "./seo";

export const runtime = "edge";
export const alt = siteConfig.ogAlt;
export const size = {
  width: socialImage.width,
  height: socialImage.height,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          height: "100%",
          width: "100%",
          background: "#f4f4f1",
          color: "#050505",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: "#f4f4f1",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 72,
            bottom: 72,
            display: "flex",
            height: 190,
            width: 190,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 95,
            border: "1px solid rgba(5,5,5,0.14)",
            color: "rgba(5,5,5,0.28)",
            fontSize: 72,
            fontWeight: 700,
          }}
        >
          P
        </div>
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "76px 84px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                width: 270,
                borderRadius: 999,
                border: "1px solid rgba(5,5,5,0.14)",
                background: "rgba(255,255,255,0.72)",
                padding: "12px 18px",
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: 3,
              }}
            >
              PYXIS.STUDIO
            </div>
            <div
              style={{
                display: "flex",
                maxWidth: 870,
                marginTop: 44,
                fontSize: 78,
                fontWeight: 800,
                lineHeight: 0.94,
              }}
            >
              Full-stack design and dev studio for high-growth startups
            </div>
            <div
              style={{
                display: "flex",
                maxWidth: 740,
                marginTop: 30,
                color: "rgba(5,5,5,0.68)",
                fontSize: 30,
                lineHeight: 1.35,
              }}
            >
              Sharp websites, brands, interfaces, and product builds shipped
              with senior craft.
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "rgba(5,5,5,0.6)",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            Design / Development / Brand / Product
          </div>
        </div>
      </div>
    ),
    size,
  );
}
