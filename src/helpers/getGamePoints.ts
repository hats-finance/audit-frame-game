import { LIKE_POINTS, RECAST_POINTS } from "@/consts/gamePoints";
import { IFarcasterUser } from "@/data/models";

export const getGamePoints = (user: IFarcasterUser | undefined): number => {
  if (!user) return 0;
  return (user.liked ? LIKE_POINTS : 0) + (user.recasted ? RECAST_POINTS : 0);
};
