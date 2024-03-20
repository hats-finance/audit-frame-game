import { IEditSession } from "../models";
import { getVaultDescription } from "@/helpers/getVaultDescription";
import { config } from "@/config/config";

export const getEditSessionByAddressOrId = async (addressOrEditSessionId: string | undefined): Promise<IEditSession | null> => {
  try {
    if (!addressOrEditSessionId) return null;

    let editSession: IEditSession | null;
    // Is it an address?
    if (addressOrEditSessionId.startsWith("0x") && addressOrEditSessionId.length === 42) {
      editSession = await await fetch(`${config.apiURL}/edit-session/genesis/${addressOrEditSessionId}`).then((res) =>
        res.json()
      );
      if (!editSession) return null;
      const vaultDesc = await getVaultDescription(addressOrEditSessionId, editSession!.chainId!);
      return { ...editSession, description: vaultDesc };
    } else {
      editSession = await await fetch(`${config.apiURL}/edit-session/${addressOrEditSessionId}`).then((res) => res.json());
      if (!editSession) return null;
      return editSession;
    }
  } catch (error) {
    console.log("uyy");
    console.log(error);
    return null;
  }
};
