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
import { getCompetitionStatus } from "@/helpers/getCompetitionStatus";

export async function POST(req: NextRequest): Promise<Response> {
  const body: FrameRequest = await req.json();
  const { searchParams } = new URL(req.url);

  const { isValid, message } = await getFrameMessage(body);

  if (!isValid) {
    console.error(message);
    throw new Error("Invalid frame request");
  }

  const goToResultsData = searchParams.get("goToResults");
  const goToResults = JSON.parse(goToResultsData || "false") as boolean;

  const user = await getUserFromMessage(message);
  const userToSend = encodeURIComponent(JSON.stringify(user));
  const hasUserLikedOrRecasted = user.liked || user.recasted;

  // Check if user already voted
  const userVote = await getUserVote(body);
  if (userVote.voted && userVote.votedUsername) {
    const leaderboard = ((await fetch(`${config.apiURL}/utils/get-leaderboard`).then((res) => res.json()))?.leaderboard ??
      []) as IAllTimeLeaderboard;
    const editSessionIdOrAddress = getEditSessionIdOrAddressFromMessage(message);
    const competitionData = await getEditSessionByAddressOrId(editSessionIdOrAddress);
    const allOptedInUsers = competitionData?.optedInUsers ?? [];
    const allFarcasterVoters = competitionData?.farcasterVoters ?? [];
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
        votedPoints: allFarcasterVoters
          .filter((v) => v.vote.toLowerCase() === profile.username.toLowerCase())
          .reduce((acc, v) => acc + v.points, 0),
        voters: allFarcasterVoters.filter((v) => v.vote.toLowerCase() === profile.username.toLowerCase()).length ?? 0,
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
            <meta property="fc:frame:button:1" content="See Real-Time Votes ➡️" />
            <meta property="fc:frame:post_url" content="${config.hostURL}/api/results" />
        </head>
    </html>
  `);
  }

  if (goToResults) {
    const editSessionIdOrAddress = getEditSessionIdOrAddressFromMessage(message);
    const competitionData = await getEditSessionByAddressOrId(editSessionIdOrAddress);
    const competitionStatus = getCompetitionStatus(competitionData);
    const allOptedInUsers = competitionData?.optedInUsers ?? [];
    const allFarcasterVoters = competitionData?.farcasterVoters ?? [];
    const allProfiles = await getAllProfiles();

    let hackersProfiles = allOptedInUsers.map((username) => {
      const profile = allProfiles.find((p) => p.username.toLowerCase() === username.toLowerCase()) as IHackerProfile;

      return {
        idx: undefined,
        username: profile.username,
        avatar: profile.avatar,
        github: profile.github_username,
        highestSeverity: "",
        totalAmountRewards: 0,
        totalFindings: 0,
        votedPoints: allFarcasterVoters
          .filter((v) => v.vote.toLowerCase() === profile.username.toLowerCase())
          .reduce((acc, v) => acc + v.points, 0),
        voters: allFarcasterVoters.filter((v) => v.vote.toLowerCase() === profile.username.toLowerCase()).length ?? 0,
      } as IProfileData;
    });
    hackersProfiles = hackersProfiles.filter((p) => p.votedPoints && p.votedPoints > 0);
    hackersProfiles.sort((a, b) => (b.votedPoints ?? 0) - (a.votedPoints ?? 0));

    const profilesToSend = encodeURIComponent(JSON.stringify(hackersProfiles.slice(0, 5)));
    const votingsEnded = ["in-progress", "ended"].includes(competitionStatus);

    return new NextResponse(`
    <!DOCTYPE html>
    <html>
        <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image:aspect_ratio" content="1:1" />
            <meta property="fc:frame:image" content="${config.hostURL}/game/results?user=${userToSend}&results=${profilesToSend}&votingsEnded=${votingsEnded}" />
            <meta property="og:image" content="${config.hostURL}/game/results?user=${userToSend}&results=${profilesToSend}&votingsEnded=${votingsEnded}" />
            <meta property="fc:frame:button:1" content="What's next ➡️" />
            <meta property="fc:frame:post_url" content="${config.hostURL}/api/done" />
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
          <meta property="fc:frame:image" content="${config.hostURL}/game/steps?user=${userToSend}" />
          <meta property="og:image" content="${config.hostURL}/game/steps?user=${userToSend}" />
          <meta property="fc:frame:button:1" content="${
            !hasUserLikedOrRecasted ? "You need to like and/or recast first" : "Go to game rules ➡️"
          }" />
          <meta property="fc:frame:post_url" content="${!hasUserLikedOrRecasted ? "" : `${config.hostURL}/api/rules`}" />
      </head>
  </html>
`);
}
