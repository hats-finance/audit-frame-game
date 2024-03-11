import { NextRequest, NextResponse } from "next/server";
import { FrameRequest, getFrameMessage } from "@coinbase/onchainkit";
import { config } from "@/config/config";
import { getUserFromMessage } from "@/helpers/getUserFromMessage";

export async function POST(req: NextRequest): Promise<Response> {
  const body: FrameRequest = await req.json();

  const { isValid, message } = await getFrameMessage(body);

  if (!isValid) {
    console.error(message);
    throw new Error("Invalid frame request");
  }

  // TODO: Get HATS Points
  const user = getUserFromMessage(message);
  const userToSend = encodeURIComponent(JSON.stringify(user));

  return new NextResponse(`
  <!DOCTYPE html>
  <html>
      <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image:aspect_ratio" content="1:1" />
          <meta property="fc:frame:image" content="${config.hostURL}/game/done?user=${userToSend}" />
          <meta property="og:image" content="${config.hostURL}/game/done?user=${userToSend}" />
          <meta property="fc:frame:button:1" content="Join the Audit F(r)ame Game Channel" />
          <meta property="fc:frame:post_url" content="redirectToDiscord" />
      </head>
  </html>
`);
}
