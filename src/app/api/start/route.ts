import { NextRequest, NextResponse } from "next/server";
import { FrameRequest, getFrameMessage } from "@coinbase/onchainkit";
import { config } from "@/config/config";
import { getUserFromMessage } from "@/helpers/getUserFromMessage";
import { getUserVote } from "@/helpers/getUserVote";
import { IAllTimeLeaderboard, IProfileData } from "@/data/models";
import { getEditSessionIdOrAddressFromMessage } from "@/helpers/getEditSessionIdOrAddressFromMessage";
import { getEditSessionByAddressOrId } from "@/data/requests/getEditSessionByAddressOrId";
import { getAllProfiles } from "@/data/requests/getAllProfiles";
import { IHackerProfile } from "@hats.finance/shared";

export async function POST(req: NextRequest): Promise<Response> {
  const body: FrameRequest = await req.json();

  const { isValid, message } = await getFrameMessage(body);

  if (!isValid) {
    console.error(message);
    throw new Error("Invalid frame request");
  }

  const user = await getUserFromMessage(message);
  const userToSend = encodeURIComponent(JSON.stringify(user));

  // Check if user already voted
  const userVote = await getUserVote(body);
  if (userVote.voted && userVote.votedUsername) {
    const leaderboard = ((await fetch(`${config.apiURL}/utils/get-leaderboard`).then((res) => res.json()))?.leaderboard ??
      []) as IAllTimeLeaderboard;
    const editSessionIdOrAddress = getEditSessionIdOrAddressFromMessage(message);
    const competitionData = await getEditSessionByAddressOrId(editSessionIdOrAddress);
    const allOptedInUsers = competitionData?.optedInUsers ?? [];
    // const optedInUsersOnLeaderboard = allOptedInUsers.filter((u) =>
    //   leaderboard.find((l) => l.username?.toLowerCase() === u.toLowerCase())
    // );
    const allProfiles = await getAllProfiles();

    let hackersProfiles = allOptedInUsers.map((username) => {
      const profile = allProfiles.find((p) => p.username === username) as IHackerProfile;
      const leaderboardStats = leaderboard.find((l) => l.username?.toLowerCase() === username.toLowerCase());

      return {
        idx: undefined,
        username: profile.username,
        avatar: profile.avatar,
        github: profile.github_username,
        highestSeverity: leaderboardStats?.highestSeverity,
        totalAmountRewards: leaderboardStats?.totalAmount.usd,
        totalFindings: leaderboardStats?.totalSubmissions,
      } as IProfileData;
    });
    hackersProfiles.sort((a, b) => (b.totalAmountRewards ?? 0) - (a.totalAmountRewards ?? 0));
    hackersProfiles = hackersProfiles.map((h, i) => ({
      ...h,
      leaderboardPlace: leaderboard.findIndex((l) => l.username?.toLowerCase() === h.username.toLowerCase()) + 1,
      idx: i + 1,
    }));

    const votedHackerProfile = hackersProfiles.find((h) => h.username.toLowerCase() === userVote.votedUsername?.toLowerCase());
    if (!votedHackerProfile) return new NextResponse("Invalid voted hacker", { status: 400 });

    const votedHackerToSend = encodeURIComponent(JSON.stringify(votedHackerProfile));

    return new NextResponse(`
    <!DOCTYPE html>
    <html>
        <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image:aspect_ratio" content="1:1" />
            <meta property="fc:frame:image" content="${config.hostURL}/game/voted?user=${userToSend}&hacker=${votedHackerToSend}" />
            <meta property="og:image" content="${config.hostURL}/game/voted?user=${userToSend}&hacker=${votedHackerToSend}" />
            <meta property="fc:frame:button:1" content="What's next ->" />
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
          <meta property="fc:frame:image" content="${config.hostURL}/game/home?user=${userToSend}" />
          <meta property="og:image" content="${config.hostURL}/game/home?user=${userToSend}" />
          <meta property="fc:frame:button:1" content="Start game" />
          <meta property="fc:frame:post_url" content="${config.hostURL}/api/steps" />
      </head>
  </html>
`);
}
