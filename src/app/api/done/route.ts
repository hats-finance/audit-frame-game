import { NextRequest, NextResponse } from "next/server";
import { FrameRequest, getFrameMessage } from "@coinbase/onchainkit";
import { config } from "@/config/config";
import { getUserFromMessage } from "@/helpers/getUserFromMessage";
import { getEditSessionIdOrAddressFromMessage } from "@/helpers/getEditSessionIdOrAddressFromMessage";
import { getEditSessionByAddressOrId } from "@/data/requests/getEditSessionByAddressOrId";

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
  const voters = competitionData?.farcasterVoters?.length ?? 0;

  return new NextResponse(`
  <!DOCTYPE html>
  <html>
      <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image:aspect_ratio" content="1:1" />
          <meta property="fc:frame:image" content="${config.hostURL}/game/done?user=${userToSend}&voters=${voters}" />
          <meta property="og:image" content="${config.hostURL}/game/done?user=${userToSend}&voters=${voters}" />
          <meta property="fc:frame:button:1" content="Join the Audit F(r)ame Game Channel" />
          <meta property="fc:frame:button:1:action" content="link" />
          <meta property="fc:frame:button:1:target" content="https://warpcast.com/~/channel/auditgames" />
      </head>
  </html>
`);
}
