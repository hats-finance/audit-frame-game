import { ImageResponse } from "next/og";
import millify from "millify";
import { IFarcasterUser, IProfileData } from "@/data/models";
import { getGamePoints } from "@/helpers/getGamePoints";
import { COLORS } from "@/consts/colors";
import { ipfsTransformUri } from "@/helpers/ipfsTransformUri";
import { config } from "@/config/config";
import { HACKER_HEIGHT, HACKER_MARGIN, HACKER_WIDTH } from "@/consts/hackersUI";
import { getNumberOrdinal } from "@/helpers/getNumberOrdinal";

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

  const page = JSON.parse(searchParams.get("page") || "0") as number;
  const totalPages = JSON.parse(searchParams.get("totalPages") || "0") as number;

  const farcasterUserData = searchParams.get("user");
  const farcasterUser = JSON.parse(farcasterUserData || "null") as IFarcasterUser | undefined;

  const isInvalidVoteData = searchParams.get("invalidVote");
  const isInvalidVote = JSON.parse(isInvalidVoteData || "false") as boolean;

  const hackersData = searchParams.get("hackers");
  const hackers = JSON.parse(hackersData || "[]") as IProfileData[];

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          position: "relative",
          width: 1000,
          height: 1000,
          backgroundColor: COLORS.background,
          border: `${isInvalidVote ? 8 : 0}px solid ${COLORS.red}`,
        }}>
        {/* POINTS */}
        <p style={{ color: "white", fontSize: "30px", position: "absolute", top: 10, left: 40 }}>
          Voting power: {getGamePoints(farcasterUser)}
        </p>
        <p style={{ color: "white", fontSize: "30px", position: "absolute", top: 10, right: 40 }}>
          HATs points: {farcasterUser?.hatsPoints ?? 0}
        </p>

        <p
          style={{
            fontFamily: "IBMPlexSansBold",
            fontSize: "50px",
            color: isInvalidVote ? COLORS.red : "white",
            position: "absolute",
            top: 80,
            right: "50%",
            transform: "translateX(50%)",
          }}>
          {isInvalidVote ? "Invalid Vote, try again." : "Competing Auditors"}
        </p>

        <div
          style={{
            position: "absolute",
            top: 200,
            right: "50%",
            transform: "translateX(50%)",
            display: "flex",
            flexWrap: "wrap",
            width: 900,
            margin: "auto",
          }}>
          {hackers.map((hacker) => {
            return (
              <div
                key={hacker.username}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: HACKER_HEIGHT,
                  width: HACKER_WIDTH,
                  margin: `0 ${HACKER_MARGIN}px 40px`,
                  color: "white",
                  borderRadius: 10,
                  fontFamily: "IBMPlexSans",
                  background: "linear-gradient(135deg, #24E8C5, #F782FF, #816FFF)",
                }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: HACKER_HEIGHT - 4,
                    width: HACKER_WIDTH - 4,
                    background: COLORS.background,
                    borderRadius: 10,
                    padding: "10px 25px",
                  }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <p style={{ fontSize: "40px", fontFamily: "IBMPlexSansBold", margin: 0 }}>#{hacker.idx}</p>
                      <p style={{ fontSize: "34px", fontFamily: "IBMPlexSansBold", marginBottom: 15, marginTop: 5 }}>
                        {hacker.username}
                      </p>
                    </div>

                    {/* Profile image */}
                    <div
                      style={{ display: "flex", borderRadius: 1000, overflow: "hidden", width: 90, height: 90, marginTop: 10 }}>
                      {hacker.avatar ? (
                        <img src={ipfsTransformUri(hacker.avatar)} width={90} height={90} />
                      ) : hacker.github ? (
                        <img src={`https://github.com/${hacker.github}.png`} width={90} height={90} />
                      ) : (
                        <img src={`${config.hostURL}/assets/icons/identicon.png`} width={90} height={90} />
                      )}
                    </div>
                  </div>

                  {hacker.leaderboardPlace !== 0 ? (
                    <p style={{ fontSize: "28px", margin: 0, display: "flex", alignItems: "center", marginBottom: 2 }}>
                      <span style={{ fontFamily: "IBMPlexSansBold", marginRight: 5 }}>
                        {getNumberOrdinal(hacker.leaderboardPlace)}
                      </span>{" "}
                      on the leaderboard
                    </p>
                  ) : (
                    <p style={{ fontSize: "28px", margin: 0, display: "flex", alignItems: "center", marginBottom: 2 }}>
                      not on the leaderboard
                    </p>
                  )}

                  {hacker.leaderboardPlace !== 0 && (
                    <p style={{ fontSize: "25px", margin: 0, marginBottom: 2, color: COLORS.greyText }}>
                      ${millify(hacker.totalAmountRewards ?? 0)} total earnings
                    </p>
                  )}

                  {hacker.leaderboardPlace !== 0 && (
                    <p style={{ fontSize: "25px", margin: 0, marginBottom: 5 }}>{hacker.totalFindings} issues found</p>
                  )}

                  <div
                    style={{
                      fontSize: "30px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "absolute",
                      bottom: -10,
                      left: "40%",
                      margin: 0,
                    }}>
                    <p
                      style={{
                        color: "#24E8C5",
                        fontFamily: "IBMPlexSansBold",
                        marginRight: 5,
                      }}>
                      {hacker.votedPoints ?? 0}
                    </p>
                    points
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", position: "absolute", bottom: 30, right: "50%", transform: "translateX(50%)" }}>
          <p style={{ fontSize: "40px", fontFamily: "IBMPlexSansBold", color: "white" }}>
            {page + 1} of {totalPages} pages
          </p>
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
