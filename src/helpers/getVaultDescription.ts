import { IVaultDescription, getVaultDescriptionHash } from "@hats.finance/shared";
import { getFromIpfs } from "./getFromIpfs";

export const getVaultDescription = async (address: string, chainId: number) => {
  const descHash = (await getVaultDescriptionHash(address, chainId)) ?? null;
  if (!descHash) throw new Error("Failed to get the vault's description hash");

  const getIpfsRes = await getFromIpfs(descHash);
  if (!getIpfsRes.ok) throw new Error("Cannot get ipfs description");

  const ipfsDescription = await getIpfsRes.text();
  const vaultDescription = JSON.parse(ipfsDescription) as IVaultDescription;

  return vaultDescription;
};
