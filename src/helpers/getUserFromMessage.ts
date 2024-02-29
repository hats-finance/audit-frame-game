import { IFarcasterUser } from "@/data/models";
import { FrameValidationData } from "@coinbase/onchainkit";

export const getUserFromMessage = (message: FrameValidationData) => {
  const viewerFid = message.interactor.fid;
  return { fid: viewerFid, hatsPoints: 5, liked: message.liked, recasted: message.recasted } as IFarcasterUser;
};
