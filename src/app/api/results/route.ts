import { NextRequest, NextResponse } from "next/server";
import { FrameRequest, getFrameMessage } from "@coinbase/onchainkit";
import { config } from "@/config/config";
import { getUserFromMessage } from "@/helpers/getUserFromMessage";
import { getEditSessionIdOrAddressFromMessage } from "@/helpers/getEditSessionIdOrAddressFromMessage";
import { getEditSessionByAddressOrId } from "@/data/requests/getEditSessionByAddressOrId";
import { IHackerProfile } from "@hats.finance/shared";
import { getAllProfiles } from "@/data/requests/getAllProfiles";
import { IProfileData } from "@/data/models";

export async function POST(req: NextRequest): Promise<Response> {
  const body: FrameRequest = await req.json();

  const { isValid, message } = await getFrameMessage(body);

  if (!isValid) {
    console.error(message);
    throw new Error("Invalid frame request");
  }

  const user = await getUserFromMessage(message);
  const userToSend = encodeURIComponent(JSON.stringify(user));

  // Get edit session
  const editSessionIdOrAddress = getEditSessionIdOrAddressFromMessage(message);
  const competitionData = await getEditSessionByAddressOrId(editSessionIdOrAddress);
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

  return new NextResponse(`
  <!DOCTYPE html>
  <html>
      <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image:aspect_ratio" content="1:1" />
          <meta property="fc:frame:image" content="${config.hostURL}/game/results?user=${userToSend}&results=${profilesToSend}" />
          <meta property="og:image" content="${config.hostURL}/game/results?user=${userToSend}&results=${profilesToSend}" />
          <meta property="fc:frame:button:1" content="What's next ➡️" />
          <meta property="fc:frame:post_url" content="${config.hostURL}/api/done" />
      </head>
  </html>
`);
}
