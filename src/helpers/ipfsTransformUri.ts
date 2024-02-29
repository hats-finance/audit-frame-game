import { IPFS_PREFIX } from "@/consts/urls";

export const ipfsTransformUri = (uri: string | undefined) => {
  if (!uri || typeof uri !== "string") return "";

  if (uri.startsWith("ipfs")) {
    let ipfs;
    if (uri.startsWith("ipfs://ipfs/")) {
      ipfs = uri.slice(12);
    } else if (uri.startsWith("ipfs:///ipfs/")) {
      ipfs = uri.slice(13);
    } else if (uri.startsWith("ipfs/")) {
      ipfs = uri.slice(5);
    } else if (uri.startsWith("ipfs://")) {
      ipfs = uri.slice(7);
    }
    return `${IPFS_PREFIX}/${ipfs}`;
  } else if (uri.startsWith("http")) {
    return uri;
  } else if (uri.startsWith("blob")) {
    return uri;
  }
  return `${IPFS_PREFIX}/${uri}`;
};
