import { ImageResponse } from "next/og";
import { config } from "@/config/config";
import { ICompetitionCountdown } from "@/helpers/getCompetitionCountdown";
import { ICompetitionStatus } from "@/helpers/getCompetitionStatus";

export const runtime = "experimental-edge";

export async function GET(request: Request) {
  const IBMPlexMono = await fetch(new URL("/public/assets/IBMPlexMono-Regular.ttf", import.meta.url)).then((res) =>
    res.arrayBuffer()
  );
  const IBMPlexSansBold = await fetch(new URL("/public/assets//IBMPlexSans-Bold.ttf", import.meta.url)).then((res) =>
    res.arrayBuffer()
  );

  const { searchParams } = new URL(request.url);

  const frameImage = (searchParams.get("frameImage") || "null") as string;
  const competitionCountdown = JSON.parse(searchParams.get("countdown") || "null") as ICompetitionCountdown | undefined;
  const competitionStatus = searchParams.get("status") as ICompetitionStatus;

  return new ImageResponse(
    (
      <div style={{ display: "flex", position: "relative", width: 1000, height: 1000, justifyContent: "center" }}>
        <img
          style={{ position: "absolute", top: 0, left: 0, width: 1000, height: 1000 }}
          src={`${config.hostURL}/assets/images/${frameImage}.jpg`}
        />

        {/* COUNTDOWN */}
        {(competitionStatus === "coming" || competitionStatus === "voting") && !!competitionCountdown && (
          <div style={{ display: "flex", alignItems: "center", position: "absolute", bottom: 90 }}>
            <p
              style={{
                fontSize: "45px",
                color: "transparent",
                background: "linear-gradient(135deg, #24E8C5, #F782FF, #816FFF)",
                backgroundClip: "text",
                fontFamily: "IBMPlexSansBold",
                margin: 0,
              }}>
              {competitionStatus === "coming" ? "You can vote in" : "Votings ends in"}
            </p>
            <div
              style={{
                display: "flex",
                color: "white",
                margin: 0,
                marginTop: 12,
                marginLeft: 20,
                fontSize: "35px",
                fontFamily: "IBMPlexMono",
              }}>
              {competitionCountdown.days ? (
                <p style={{ margin: 0 }}>
                  {competitionCountdown.days} {+competitionCountdown.days === 1 ? "day" : "days"}
                </p>
              ) : (
                <p style={{ margin: 0 }}>
                  {competitionCountdown.hours}h:{competitionCountdown.minutes}m:{competitionCountdown.seconds}s
                </p>
              )}
            </div>
          </div>
        )}
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
