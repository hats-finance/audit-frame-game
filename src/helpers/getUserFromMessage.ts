import { IFarcasterUser } from "@/data/models";
import { getFarcasterUserHatsPoints } from "@/data/requests/getFarcasterUserHatsPoints";
import { FrameValidationData } from "@coinbase/onchainkit";

export const getUserFromMessage = async (message: FrameValidationData) => {
  const viewerFid = message.interactor.fid;
  const hatsPoints = await getFarcasterUserHatsPoints(viewerFid);

  return { fid: viewerFid, hatsPoints, liked: message.liked, recasted: message.recasted } as IFarcasterUser;
};
