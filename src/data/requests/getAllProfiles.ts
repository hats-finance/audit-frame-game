import { config } from "@/config/config";
import { IHackerProfile } from "@hats.finance/shared";

export const getAllProfiles = async (): Promise<IHackerProfile[]> => {
  try {
    const profiles = (await fetch(`${config.apiURL}/profile/all`).then((res) => res.json()))?.profiles ?? [];
    return profiles;
  } catch (error) {
    console.log(error);
    return [];
  }
};
