import { IEditedVaultDescription, IHackerProfile, IVaultDescription, IVaultEditionStatus } from "@hats.finance/shared";

export interface IEditSession {
  editedDescription: IEditedVaultDescription;
  description: IVaultDescription;
  descriptionHash: string;
  vaultAddress?: string;
  chainId?: number;
  fromDescriptionHash?: string;
  pinned: boolean;
  submittedToCreation?: boolean;
  lastCreationOnChainRequest?: Date;
  editingExistingVault?: boolean;
  vaultEditionStatus?: IVaultEditionStatus;
  createdAt?: Date;
  updatedAt?: Date;
  nftAssetsIpfsHash?: string;
  auditTriedToForkCount?: number;
  optedInUsers?: string[];
}

export interface IFarcasterUser {
  fid: number;
  hatsPoints: number;
  liked: boolean;
  recasted: boolean;
}

export interface ICompetitionData {
  optedInUsers: number;
  logo: string;
  name: string;
}

export interface IProfileData {
  username: string;
  avatar?: string;
}
