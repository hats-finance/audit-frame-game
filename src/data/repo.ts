import { ObjectId } from "mongodb";
import { db } from "./client";

const editSessionsDB = db.getEditSessionsDb();
const profilesDB = db.getProfilesDb();

export const getOptedInCompetitions = async () => {
  try {
    return editSessionsDB
      .find({
        optedInUsers: { $exists: true, $ne: [] },
      })
      .toArray();
  } catch (error) {
    return null;
  }
};

export const getEditSessionById = async (editSessionId: string) => {
  try {
    return editSessionsDB.findOne({
      _id: new ObjectId(editSessionId),
    });
  } catch (error) {
    return null;
  }
};

export const getGenesisEditSessionByAddress = async (address: string, chainId?: string | number) => {
  try {
    if (chainId) {
      return editSessionsDB.findOne({
        vaultAddress: address.toLowerCase(),
        chainId: Number(chainId),
        editingExistingVault: { $ne: true },
      });
    } else {
      return editSessionsDB.findOne({
        vaultAddress: address.toLowerCase(),
        editingExistingVault: { $ne: true },
      });
    }
  } catch (error) {
    return null;
  }
};

export const getAllHackersProfiles = async () => {
  try {
    return profilesDB.find().toArray();
  } catch (error) {
    return [];
  }
};
