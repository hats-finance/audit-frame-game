import { NextRequest, NextResponse } from "next/server";
import { FrameRequest, getFrameMessage } from "@coinbase/onchainkit";
import { config } from "@/config/config";
import { getUserFromMessage } from "@/helpers/getUserFromMessage";
import { getEditSessionIdOrAddressFromMessage } from "@/helpers/getEditSessionIdOrAddressFromMessage";
import { getEditSessionByAddressOrId } from "@/data/requests/getEditSessionByAddressOrId";
import { ICompetitionStatus, getCompetitionStatus } from "@/helpers/getCompetitionStatus";
import { getCompetitionCountdown } from "@/helpers/getCompetitionCountdown";

export async function POST(req: NextRequest): Promise<Response> {
  const body: FrameRequest = await req.json();

  const { isValid, message } = await getFrameMessage(body);

  if (!isValid) {
    console.error(message);
    throw new Error("Invalid frame request");
  }

  const user = await getUserFromMessage(message);
  const userToSend = encodeURIComponent(JSON.stringify(user));

  const addressOrEditSessionId = getEditSessionIdOrAddressFromMessage(message);
  const editSession = await getEditSessionByAddressOrId(addressOrEditSessionId);
  const competitionStatus = getCompetitionStatus(editSession);
  const competitionCountDown = getCompetitionCountdown(editSession);

  const statusToFrame: { [K in ICompetitionStatus]: string } = {
    coming: "coming-competition",
    voting: "home",
    invalid: "invalid-competition",
    "in-progress": "inprogress-competition",
    ended: "ended-competition",
  };

  const statusToPost: { [K in ICompetitionStatus]: string } = {
    coming: "",
    voting: `${config.hostURL}/api/start`,
    invalid: "",
    "in-progress": `${config.hostURL}/api/start?goToResults=true`,
    ended: `${config.hostURL}/api/start?goToResults=true`,
  };

  const statusToButton: { [K in ICompetitionStatus]: string } = {
    coming: "Coming soon!",
    voting: "Start game ➡️",
    invalid: "Invalid competition",
    "in-progress": "See vote and leaderboard ➡️",
    ended: "See vote and leaderboard ➡️",
  };

  const countdownToSend = encodeURIComponent(JSON.stringify(competitionCountDown ?? null));

  return new NextResponse(`
  <!DOCTYPE html>
  <html>
      <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image:aspect_ratio" content="1:1" />
          <meta property="fc:frame:image" content="${config.hostURL}/game/start?user=${userToSend}&frameImage=${statusToFrame[competitionStatus]}&status=${competitionStatus}&countdown=${countdownToSend}" />
          <meta property="og:image" content="${config.hostURL}/game/start?user=${userToSend}&frameImage=${statusToFrame[competitionStatus]}&status=${competitionStatus}&countdown=${countdownToSend}" />
          <meta property="fc:frame:button:1" content="${statusToButton[competitionStatus]}" />
          <meta property="fc:frame:post_url" content="${statusToPost[competitionStatus]}" />
      </head>
  </html>
`);
}
