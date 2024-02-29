import { getAllHackersProfiles } from "../repo";

export const getAllProfiles = async () => {
  try {
    const profiles = await getAllHackersProfiles();
    return profiles;
  } catch (error) {
    console.log(error);
    return [];
  }
};
