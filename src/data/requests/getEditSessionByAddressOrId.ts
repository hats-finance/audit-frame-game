import { getEditSessionById, getGenesisEditSessionByAddress } from "../repo";
import { IEditSession } from "../models";
import { WithId } from "mongodb";
import { getVaultDescription } from "@/helpers/getVaultDescription";

export const getEditSessionByAddressOrId = async (
  addressOrEditSessionId: string | undefined
): Promise<WithId<IEditSession> | null> => {
  try {
    if (!addressOrEditSessionId) return null;

    let editSession: WithId<IEditSession> | null;
    // Is it an address?
    if (addressOrEditSessionId.startsWith("0x") && addressOrEditSessionId.length === 42) {
      editSession = await getGenesisEditSessionByAddress(addressOrEditSessionId);
      if (!editSession) return null;
      const vaultDesc = await getVaultDescription(addressOrEditSessionId, editSession!.chainId!);
      return { ...editSession, description: vaultDesc };
    } else {
      editSession = await getEditSessionById(addressOrEditSessionId);
      if (!editSession) return null;
      return editSession;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
