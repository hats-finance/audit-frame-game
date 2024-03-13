import { config } from "@/config/config";
import { IFarcasterUserData } from "../models";

export const getFarcasterUserHatsPoints = async (fid: number): Promise<number> => {
  try {
    const user = (await fetch(`${config.apiURL}/game/user/fid/${fid}`).then((res) => res.json()))?.user as
      | IFarcasterUserData
      | undefined;
    return user?.hatsPoints ?? 0;
  } catch (error) {
    return 0;
  }
};
