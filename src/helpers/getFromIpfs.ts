function getIpfsUrl(hash: string) {
  return `https://ipfs2.hats.finance/ipfs/${hash}`;
}

export async function getFromIpfs(hash: string): Promise<any | null> {
  try {
    const res = await fetch(getIpfsUrl(hash));
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
}
