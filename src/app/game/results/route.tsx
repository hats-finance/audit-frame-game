import { ImageResponse } from "next/og";
import { config } from "@/config/config";
import { IFarcasterUser, IProfileData } from "@/data/models";
import { COLORS } from "@/consts/colors";
import { ipfsTransformUri } from "@/helpers/ipfsTransformUri";

export const runtime = "experimental-edge";

export async function GET(request: Request) {
  const IBMPlexMono = await fetch(new URL("/public/assets/IBMPlexMono-Regular.ttf", import.meta.url)).then((res) =>
    res.arrayBuffer()
  );
  const IBMPlexSansBold = await fetch(new URL("/public/assets/IBMPlexSans-Bold.ttf", import.meta.url)).then((res) =>
    res.arrayBuffer()
  );
  const IBMPlexSans = await fetch(new URL("/public/assets/IBMPlexSans-Regular.ttf", import.meta.url)).then((res) =>
    res.arrayBuffer()
  );

  const { searchParams } = new URL(request.url);

  const resultsData = searchParams.get("results");
  const results = JSON.parse(resultsData || "[]") as IProfileData[];

  const farcasterUserData = searchParams.get("user");
  const farcasterUser = JSON.parse(farcasterUserData || "null") as IFarcasterUser | undefined;

  return new ImageResponse(
    (
      <div style={{ display: "flex", position: "relative", width: 1000, height: 1000, backgroundColor: COLORS.background }}>
        <img
          style={{ position: "absolute", top: 0, left: 0, width: 1000, height: 1000 }}
          src={`${config.hostURL}/assets/images/results.jpg`}
        />
        {/* POINTS */}
        <p style={{ color: "white", fontSize: "30px", position: "absolute", top: 10, right: 40 }}>
          HATs points: {farcasterUser?.hatsPoints ?? 0}
        </p>

        {/* RESULTS */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "75%",
            height: 550,
            position: "absolute",
            top: 420,
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
            fontFamily: "IBMPlexSans",
          }}>
          <div style={{ display: "flex", color: COLORS.greyText }}>
            <p style={{ width: "7%", fontSize: "26px" }}>&nbsp;</p>
            <p style={{ width: "55%", fontSize: "26px" }}>Auditor</p>
            <p style={{ width: "25%", fontSize: "26px" }}>Votes</p>
            <p style={{ width: "13%", fontSize: "26px" }}>Points</p>
          </div>
          {results.map((hacker, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                borderBottom: "0.5px solid #80C3F2",
                alignItems: "center",
                paddingBottom: 10,
                marginBottom: 10,
              }}>
              <p style={{ width: "7%", fontSize: "32px", fontFamily: "IBMPlexSansBold" }}>{i + 1}.</p>
              <div style={{ display: "flex", alignItems: "center", width: "55%", fontSize: "32px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 1000,
                    overflow: "hidden",
                    width: 45,
                    height: 45,
                    marginTop: 10,
                  }}>
                  {hacker.avatar ? (
                    <img src={ipfsTransformUri(hacker.avatar)} width={45} height={45} />
                  ) : hacker.github ? (
                    <img src={`https://github.com/${hacker.github}.png`} width={45} height={45} />
                  ) : (
                    <img src={`${config.hostURL}/assets/icons/identicon.png`} width={45} height={45} />
                  )}
                </div>

                <p style={{ margin: 0, marginLeft: 20 }}>{hacker.username}</p>
              </div>
              <p style={{ width: "25%", fontSize: "35px" }}>{hacker.voters}</p>
              <p style={{ width: "13%", fontSize: "35px" }}>{hacker.votedPoints}</p>
            </div>
          ))}
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
          name: "IBMPlexSans",
          data: IBMPlexSans,
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
