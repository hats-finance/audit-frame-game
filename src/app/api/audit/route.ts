import { NextRequest, NextResponse } from "next/server";
import { FrameRequest, getFrameMessage } from "@coinbase/onchainkit";
import { config } from "@/config/config";
import { ICompetitionData } from "@/data/models";
import { getEditSessionByAddressOrId } from "@/data/requests/getEditSessionByAddressOrId";
import { getUserFromMessage } from "@/helpers/getUserFromMessage";
import { getEditSessionIdOrAddressFromMessage } from "@/helpers/getEditSessionIdOrAddressFromMessage";

export async function POST(req: NextRequest): Promise<Response> {
  const body: FrameRequest = await req.json();

  const { isValid, message } = await getFrameMessage(body);

  if (!isValid) {
    console.error(message);
    throw new Error("Invalid frame request");
  }

  const user = await getUserFromMessage(message);
  const userToSend = encodeURIComponent(JSON.stringify(user));

  const editSessionIdOrAddress = getEditSessionIdOrAddressFromMessage(message);
  const competitionData = await getEditSessionByAddressOrId(editSessionIdOrAddress);
  const competition = competitionData
    ? encodeURIComponent(
        JSON.stringify({
          optedInUsers: competitionData.optedInUsers?.length ?? 0,
          logo: competitionData.editedDescription["project-metadata"].icon,
          name: competitionData.editedDescription["project-metadata"].name,
        } as ICompetitionData)
      )
    : "";

  return new NextResponse(`
  <!DOCTYPE html>
  <html>
      <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image:aspect_ratio" content="1:1" />
          <meta property="fc:frame:image" content="${config.hostURL}/game/audit?user=${userToSend}&competition=${competition}" />
          <meta property="og:image" content="${config.hostURL}/game/audit?user=${userToSend}&competition=${competition}" />
          <meta property="fc:frame:button:1" content="View White Hat Hackers ->" />
          <meta property="fc:frame:post_url" content="${config.hostURL}/api/hackers" />
      </head>
  </html>
`);
}
