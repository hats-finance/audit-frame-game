import { ImageResponse } from "next/og";
import { config } from "@/config/config";
import { IFarcasterUser } from "@/data/models";

export const runtime = "experimental-edge";

export async function GET(request: Request) {
  const IBMPlexMono = await fetch(new URL("/public/assets/IBMPlexMono-Regular.ttf", import.meta.url)).then((res) =>
    res.arrayBuffer()
  );
  const IBMPlexSansBold = await fetch(new URL("/public/assets/IBMPlexSans-Bold.ttf", import.meta.url)).then((res) =>
    res.arrayBuffer()
  );

  const { searchParams } = new URL(request.url);

  const farcasterUserData = searchParams.get("user");
  const farcasterUser = JSON.parse(farcasterUserData || "undefined") as IFarcasterUser | undefined;

  const voters = JSON.parse(searchParams.get("voters") || "0") as number;

  return new ImageResponse(
    (
      <div style={{ display: "flex", position: "relative", width: 1000, height: 1000 }}>
        <img
          style={{ position: "absolute", top: 0, left: 0, width: 1000, height: 1000 }}
          src={`${config.hostURL}/assets/images/done.jpg`}
        />

        {/* POINTS */}
        {/* <p style={{ color: "white", fontSize: "30px", position: "absolute", top: 10, left: 40 }}>
          Game points: {getGamePoints(farcasterUser)}
        </p> */}
        <p style={{ color: "white", fontSize: "30px", position: "absolute", top: 10, right: 40 }}>
          HATs points: {farcasterUser?.hatsPoints ?? 0}
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "absolute",
            top: "5%",
            width: "100%",
            textAlign: "center",
          }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
            <p
              style={{
                fontSize: "150px",
                color: "transparent",
                background: "linear-gradient(135deg, #24E8C5, #F782FF, #816FFF)",
                backgroundClip: "text",
                fontFamily: "IBMPlexSansBold",
              }}>
              {voters}
            </p>
          </div>
        </div>
      </div>
    ),
    {
      width: 1000,
      height: 1000,
      fonts: [
        {
          name: "IBMPlexMono",
          data: IBMPlexMono,
          weight: 400,
        },
        {
          name: "IBMPlexSansBold",
          data: IBMPlexSansBold,
          weight: 700,
        },
      ],
    }
  );
}
