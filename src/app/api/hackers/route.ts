import { NextRequest, NextResponse } from "next/server";
import { FrameRequest, getFrameMessage } from "@coinbase/onchainkit";
import { config } from "@/config/config";
import { IAllTimeLeaderboard, IProfileData } from "@/data/models";
import { getEditSessionByAddressOrId } from "@/data/requests/getEditSessionByAddressOrId";
import { getUserFromMessage } from "@/helpers/getUserFromMessage";
import { getEditSessionIdOrAddressFromMessage } from "@/helpers/getEditSessionIdOrAddressFromMessage";
import { getAllProfiles } from "@/data/requests/getAllProfiles";
import { IHackerProfile } from "@hats.finance/shared";

const HACKERS_PER_PAGE = 10;

const getUserAction = (comingPage: number, buttonIdx: number, totalHackers: number): "prev" | "vote" | "next" => {
  const isFirstPage = comingPage === 0;
  const isLastPage = totalHackers <= (comingPage + 1) * HACKERS_PER_PAGE;

  if (isFirstPage) {
    return buttonIdx === 1 ? "vote" : "next";
  } else if (isLastPage) {
    return buttonIdx === 1 ? "prev" : "vote";
  } else {
    return buttonIdx === 1 ? "prev" : buttonIdx === 2 ? "vote" : "next";
  }
};

export async function POST(req: NextRequest): Promise<Response> {
  const body: FrameRequest = await req.json();
  const { searchParams } = new URL(req.url);

  const { isValid, message } = await getFrameMessage(body);

  if (!isValid) {
    console.error(message);
    throw new Error("Invalid frame request");
  }

  const leaderboard = ((await fetch(`${config.apiURL}/utils/get-leaderboard`).then((res) => res.json()))?.leaderboard ??
    []) as IAllTimeLeaderboard;
  const editSessionIdOrAddress = getEditSessionIdOrAddressFromMessage(message);
  const competitionData = await getEditSessionByAddressOrId(editSessionIdOrAddress);
  const allOptedInUsers = competitionData?.optedInUsers ?? [];
  const optedInUsersOnLeaderboard = allOptedInUsers.filter((u) =>
    leaderboard.find((l) => l.username?.toLowerCase() === u.toLowerCase())
  );
  const allProfiles = await getAllProfiles();

  const isActionInHackersData = searchParams.get("isActionInHackers");
  const isActionInHackers = JSON.parse(isActionInHackersData || "false") as boolean;
  console.log("isActionInHackers -> ", isActionInHackers);

  let votedHacker = undefined as IProfileData | "invalid" | undefined;
  let page = 0;
  if (isActionInHackers) {
    const pageData = searchParams.get("page");
    const comingPage = JSON.parse(pageData || "0") as number;

    const whichAction = getUserAction(comingPage, message.button, optedInUsersOnLeaderboard.length);
    if (whichAction === "prev") {
      page = comingPage - 1;
    } else if (whichAction === "next") {
      page = comingPage + 1;
    } else {
      page = comingPage;
      const votedUsername = message.input;
      const votedHackerProfile = allProfiles.find((p) => p.username.toLowerCase() === votedUsername.toLowerCase());
      if (votedHackerProfile) {
        votedHacker = {
          username: votedHackerProfile.username,
          avatar: votedHackerProfile.avatar,
        } as IProfileData;
        // TODO: EXECUTE VOTE
      } else {
        votedHacker = "invalid";
      }
    }
  }

  console.log("Page -> ", page);

  // TODO: Get HATS Points
  const user = getUserFromMessage(message);
  const userToSend = encodeURIComponent(JSON.stringify(user));

  const hackersProfiles = optedInUsersOnLeaderboard
    .slice(page * HACKERS_PER_PAGE, (page + 1) * HACKERS_PER_PAGE)
    .map((username) => {
      const profile = allProfiles.find((p) => p.username === username) as IHackerProfile;
      const leaderboardStats = leaderboard.find((l) => l.username?.toLowerCase() === username.toLowerCase());

      return {
        username: profile.username,
        avatar: profile.avatar,
        highestSeverity: leaderboardStats?.highestSeverity,
        totalAmountRewards: leaderboardStats?.totalAmount.usd,
        totalFindings: leaderboardStats?.totalSubmissions,
      } satisfies IProfileData;
    });
  const hackersProfilesToSend = encodeURIComponent(JSON.stringify(hackersProfiles));
  const totalPages = Math.ceil(optedInUsersOnLeaderboard.length / HACKERS_PER_PAGE);

  console.log("hackersProfiles -> ", hackersProfiles);

  const buttons = [
    page !== 0 ? "⬅️ Previous" : undefined,
    "Submit Vote 🗳️",
    optedInUsersOnLeaderboard.length > (page + 1) * HACKERS_PER_PAGE ? "Next ➡️" : undefined,
  ].filter((b) => b !== undefined);

  if (votedHacker && votedHacker !== "invalid") {
    const votedHackerToSend = encodeURIComponent(JSON.stringify(votedHacker));

    return new NextResponse(`
    <!DOCTYPE html>
    <html>
        <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image:aspect_ratio" content="1:1" />
            <meta property="fc:frame:image" content="${config.hostURL}/game/voted?user=${userToSend}&hacker=${votedHackerToSend}" />
            <meta property="og:image" content="${config.hostURL}/game/voted?user=${userToSend}&hacker=${votedHackerToSend}" />
            <meta property="fc:frame:button:1" content="Continue" />
            <meta property="fc:frame:post_url" content="${config.hostURL}/api/voted" />
        </head>
    </html>
  `);
  }

  return new NextResponse(`
  <!DOCTYPE html>
  <html>
      <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image:aspect_ratio" content="1:1" />
          <meta property="fc:frame:image" content="${
            config.hostURL
          }/game/hackers?user=${userToSend}&hackers=${hackersProfilesToSend}&invalidVote=${
    votedHacker === "invalid"
  }&page=${page}&totalPages=${totalPages}" />
          <meta property="og:image" content="${
            config.hostURL
          }/game/hackers?user=${userToSend}&hackers=${hackersProfilesToSend}&invalidVote=${
    votedHacker === "invalid"
  }&page=${page}&totalPages=${totalPages}" />
          <meta property="fc:frame:input:text" content="Vote by entering the username" />
          ${buttons.map((b, i) => `<meta property="fc:frame:button:${i + 1}" content="${b}" />`).join("\n")}
          <meta property="fc:frame:post_url" content="${config.hostURL}/api/hackers?page=${page}&isActionInHackers=true" />
      </head>
  </html>
`);
}
