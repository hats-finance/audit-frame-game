import { ImageResponse } from "next/og";
import { config } from "@/config/config";
import { IFarcasterUser, ICompetitionData } from "@/data/models";
import { getGamePoints } from "@/helpers/getGamePoints";
import { ipfsTransformUri } from "@/helpers/ipfsTransformUri";

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
  const farcasterUser = JSON.parse(farcasterUserData || "null") as IFarcasterUser | undefined;

  const competitionData = searchParams.get("competition");
  const competition = JSON.parse(competitionData || "null") as ICompetitionData | undefined;

  if (!competition) {
    return new ImageResponse(
      (
        <div style={{ display: "flex", position: "relative", width: 1000, height: 1000 }}>
          <img
            style={{ position: "absolute", top: 0, left: 0, width: 1000, height: 1000 }}
            src={`${config.hostURL}/assets/images/invalid-competition.jpg`}
          />
        </div>
      ),
      { width: 1000, height: 1000 }
    );
  }

  return new ImageResponse(
    (
      <div style={{ display: "flex", position: "relative", width: 1000, height: 1000 }}>
        <img
          style={{ position: "absolute", top: 0, left: 0, width: 1000, height: 1000 }}
          src={`${config.hostURL}/assets/images/audit-info.jpg`}
        />
        {/* POINTS */}
        <p style={{ color: "white", fontSize: "30px", position: "absolute", top: 10, left: 40 }}>
          Game points: {getGamePoints(farcasterUser)}
        </p>
        <p style={{ color: "white", fontSize: "30px", position: "absolute", top: 10, right: 40 }}>
          HATs points: {farcasterUser?.hatsPoints ?? 0}
        </p>

        {/* OPT-IN USERS */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "absolute",
            top: "12%",
            left: "20%",
          }}>
          <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
            <p
              style={{
                fontSize: "150px",
                color: "transparent",
                background: "linear-gradient(135deg, #24E8C5, #F782FF, #816FFF)",
                backgroundClip: "text",
                fontFamily: "IBMPlexSansBold",
              }}>
              {competition?.optedInUsers}
            </p>
          </div>
          <p style={{ color: "white", fontSize: "45px", marginTop: -20, fontFamily: "IBMPlexSansBold" }}>Opted-In Auditors</p>
        </div>

        {/* COMPETITION DETAILS */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "absolute",
            top: "48%",
            left: "50%",
            transform: "translateX(-50%)",
          }}>
          <p style={{ color: "white", fontSize: "40px", marginBottom: -10 }}>on</p>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={ipfsTransformUri(competition?.logo)} alt={competition?.name} width={100} height={100} />
            {/* <img src={`${config.hostURL}/assets/images/placeholder.svg`} alt={competition?.name} width={100} height={100} /> */}
            <p style={{ color: "white", fontSize: "26px", marginLeft: "20px" }}>{competition?.name}</p>
          </div>
          <p style={{ color: "white", fontSize: "45px", fontFamily: "IBMPlexSansBold" }}>Audit competition</p>
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
