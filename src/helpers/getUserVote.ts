import { config } from "@/config/config";
import { FrameRequest } from "@coinbase/onchainkit";

export const getUserVote = async (
  frameRequest: FrameRequest | undefined
): Promise<{ voted: boolean; votedUsername: string | undefined }> => {
  try {
    const res = await fetch(`${config.apiURL}/games/vote/check`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ frameRequest: frameRequest }),
    });
    const resData = await res.json();
    return { voted: resData.voted, votedUsername: resData.votedUsername };
  } catch (error) {
    console.log("Error checking vote -> ", error);
    return { voted: false, votedUsername: undefined };
  }
};
