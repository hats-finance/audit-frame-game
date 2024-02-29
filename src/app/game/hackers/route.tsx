import { ImageResponse } from "next/og";
import { config } from "@/config/config";
import { IFarcasterUser, IProfileData } from "@/data/models";
import { getGamePoints } from "@/helpers/getGamePoints";
import { COLORS } from "@/consts/colors";

export const runtime = "experimental-edge";

const HACKERS_PER_ROW = 5;

export async function GET(request: Request) {
  const IBMPlexMono = await fetch(new URL("/public/assets/IBMPlexMono-Regular.ttf", import.meta.url)).then((res) =>
    res.arrayBuffer()
  );
  const IBMPlexSansBold = await fetch(new URL("/public/assets/IBMPlexSans-Bold.ttf", import.meta.url)).then((res) =>
    res.arrayBuffer()
  );

  const { searchParams } = new URL(request.url);

  const page = JSON.parse(searchParams.get("page") || "0") as number;
  const totalPages = JSON.parse(searchParams.get("totalPages") || "0") as number;

  const farcasterUserData = searchParams.get("user");
  const farcasterUser = JSON.parse(farcasterUserData || "undefined") as IFarcasterUser | undefined;

  const isInvalidVoteData = searchParams.get("invalidVote");
  const isInvalidVote = JSON.parse(isInvalidVoteData || "false") as boolean;
  console.log("isInvalidVote -> ", isInvalidVote);

  const hackersData = searchParams.get("hackers");
  const hackers = JSON.parse(hackersData || "[]") as IProfileData[];
  console.log(hackers);

  const HACKER_WIDTH = (900 * 0.9) / HACKERS_PER_ROW;
  const HACKER_HEIGHT = 190;
  const HACKER_MARGIN = (900 * 0.1) / 2 / HACKERS_PER_ROW;

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
          Game points: {getGamePoints(farcasterUser)}
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
          {isInvalidVote ? "Invalid Vote, try again." : "Competing White Hats"}
        </p>

        <div
          style={{
            position: "absolute",
            top: 200,
            right: "50%",
            transform: "translateX(50%)",
            display: "flex",
            flexWrap: "wrap",
            // background: "orange",
            width: 900,
            margin: "auto",
          }}>
          <div style={{ background: "yellow", height: HACKER_HEIGHT, width: HACKER_WIDTH, margin: `0 ${HACKER_MARGIN}px 40px` }}>
            Test 1
          </div>
          <div style={{ background: "blue", height: HACKER_HEIGHT, width: HACKER_WIDTH, margin: `0 ${HACKER_MARGIN}px 40px` }}>
            Test 2
          </div>
          <div style={{ background: "yellow", height: HACKER_HEIGHT, width: HACKER_WIDTH, margin: `0 ${HACKER_MARGIN}px 40px` }}>
            Test 4
          </div>
          <div style={{ background: "blue", height: HACKER_HEIGHT, width: HACKER_WIDTH, margin: `0 ${HACKER_MARGIN}px 40px` }}>
            Test 2
          </div>
          <div style={{ background: "yellow", height: HACKER_HEIGHT, width: HACKER_WIDTH, margin: `0 ${HACKER_MARGIN}px 40px` }}>
            Test 4
          </div>
          <div style={{ background: "blue", height: HACKER_HEIGHT, width: HACKER_WIDTH, margin: `0 ${HACKER_MARGIN}px 40px` }}>
            Test 2
          </div>
          <div style={{ background: "yellow", height: HACKER_HEIGHT, width: HACKER_WIDTH, margin: `0 ${HACKER_MARGIN}px 40px` }}>
            Test 4
          </div>
          <div style={{ background: "blue", height: HACKER_HEIGHT, width: HACKER_WIDTH, margin: `0 ${HACKER_MARGIN}px 40px` }}>
            Test 2
          </div>
          <div style={{ background: "yellow", height: HACKER_HEIGHT, width: HACKER_WIDTH, margin: `0 ${HACKER_MARGIN}px 40px` }}>
            Test 4
          </div>
          <div style={{ background: "blue", height: HACKER_HEIGHT, width: HACKER_WIDTH, margin: `0 ${HACKER_MARGIN}px 40px` }}>
            Test 2
          </div>
          <div style={{ background: "yellow", height: HACKER_HEIGHT, width: HACKER_WIDTH, margin: `0 ${HACKER_MARGIN}px 40px` }}>
            Test 4
          </div>
          <div style={{ background: "blue", height: HACKER_HEIGHT, width: HACKER_WIDTH, margin: `0 ${HACKER_MARGIN}px 40px` }}>
            Test 2
          </div>
          <div style={{ background: "yellow", height: HACKER_HEIGHT, width: HACKER_WIDTH, margin: `0 ${HACKER_MARGIN}px 40px` }}>
            Test 4
          </div>
          <div style={{ background: "blue", height: HACKER_HEIGHT, width: HACKER_WIDTH, margin: `0 ${HACKER_MARGIN}px 40px` }}>
            Test 2
          </div>
          <div style={{ background: "yellow", height: HACKER_HEIGHT, width: HACKER_WIDTH, margin: `0 ${HACKER_MARGIN}px 40px` }}>
            Test 4
          </div>
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
          name: "IBMPlexSansBold",
          data: IBMPlexSansBold,
          weight: 700,
        },
      ],
    }
  );
}
