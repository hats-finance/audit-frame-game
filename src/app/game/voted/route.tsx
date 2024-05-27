import { ImageResponse } from "next/og";
import { config } from "@/config/config";
import { IFarcasterUser, IProfileData } from "@/data/models";
import { COLORS } from "@/consts/colors";
import { getGamePoints } from "@/helpers/getGamePoints";
import { HACKER_HEIGHT, HACKER_MARGIN, HACKER_WIDTH } from "@/consts/hackersUI";
import { ipfsTransformUri } from "@/helpers/ipfsTransformUri";
import millify from "millify";

export const runtime = "experimental-edge";

export async function GET(request: Request) {
  const HACKER_HEIGHT_HERE = HACKER_HEIGHT - 45;

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

  const votedHackerData = searchParams.get("hacker");
  const votedHacker = JSON.parse(votedHackerData || "null") as IProfileData | undefined;

  const farcasterUserData = searchParams.get("user");
  const farcasterUser = JSON.parse(farcasterUserData || "null") as IFarcasterUser | undefined;

  if (!votedHacker) return undefined;

  return new ImageResponse(
    (
      <div style={{ display: "flex", position: "relative", width: 1000, height: 1000, backgroundColor: COLORS.background }}>
        {/* POINTS */}
        <p style={{ color: "white", fontSize: "30px", position: "absolute", top: 10, left: 40 }}>
          Voting power: {getGamePoints(farcasterUser)}
        </p>
        <p style={{ color: "white", fontSize: "30px", position: "absolute", top: 10, right: 40 }}>
          HATs points: {farcasterUser?.hatsPoints ?? 0}
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "absolute",
            top: "18%",
            left: "15%",
          }}>
          <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
            <p
              style={{
                fontSize: "55px",
                color: "transparent",
                background: "linear-gradient(135deg, #24E8C5, #F782FF, #816FFF)",
                backgroundClip: "text",
                fontFamily: "IBMPlexSansBold",
              }}>
              Your vote was broadcasted
            </p>
          </div>
        </div>

        {/* VOTE */}
        <div
          key={votedHacker.username}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: HACKER_HEIGHT_HERE,
            width: HACKER_WIDTH,
            margin: `0 ${HACKER_MARGIN}px 40px`,
            color: "white",
            borderRadius: 10,
            fontFamily: "IBMPlexSans",
            background: "linear-gradient(135deg, #24E8C5, #F782FF, #816FFF)",
            position: "absolute",
            top: "40%",
            left: "28%",
          }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: HACKER_HEIGHT_HERE - 4,
              width: HACKER_WIDTH - 4,
              background: COLORS.background,
              borderRadius: 10,
              padding: "10px 25px",
            }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <p style={{ fontSize: "40px", fontFamily: "IBMPlexSansBold", margin: 0 }}>#{votedHacker.idx}</p>
                <p style={{ fontSize: "34px", fontFamily: "IBMPlexSansBold", marginBottom: 15, marginTop: 5 }}>
                  {votedHacker.username}
                </p>
              </div>

              {/* Profile image */}
              <div style={{ display: "flex", borderRadius: 1000, overflow: "hidden", width: 90, height: 90, marginTop: 10 }}>
                {votedHacker.avatar ? (
                  <img src={ipfsTransformUri(votedHacker.avatar)} width={90} height={90} />
                ) : votedHacker.github ? (
                  <img src={`https://github.com/${votedHacker.github}.png`} width={90} height={90} />
                ) : (
                  <img src={`${config.hostURL}/assets/icons/identicon.png`} width={90} height={90} />
                )}
              </div>
            </div>

            {votedHacker.leaderboardPlace !== 0 ? (
              <p style={{ fontSize: "28px", margin: 0, display: "flex", alignItems: "center", marginBottom: 2 }}>
                <span style={{ fontFamily: "IBMPlexSansBold", marginRight: 5 }}>{votedHacker.leaderboardPlace}st</span> on the
                leaderboard
              </p>
            ) : (
              <p style={{ fontSize: "28px", margin: 0, display: "flex", alignItems: "center", marginBottom: 2 }}>
                not on the leaderboard
              </p>
            )}

            {votedHacker.leaderboardPlace !== 0 && (
              <p style={{ fontSize: "25px", margin: 0, marginBottom: 2, color: COLORS.greyText }}>
                ${millify(votedHacker.totalAmountRewards ?? 0)} total earnings
              </p>
            )}

            {votedHacker.leaderboardPlace !== 0 && (
              <p style={{ fontSize: "25px", margin: 0, marginBottom: 5 }}>{votedHacker.totalFindings} issues found</p>
            )}
          </div>
        </div>

        <div
          style={{
            fontSize: "26px",
            display: "flex",
            position: "absolute",
            bottom: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
          }}>
          <p style={{ margin: 0 }}>The results will be published after competition payout</p>
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
