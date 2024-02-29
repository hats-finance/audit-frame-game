import { FrameValidationData } from "@coinbase/onchainkit";

export const getEditSessionIdOrAddressFromMessage = (message: FrameValidationData) => {
  const url = new URL(message.raw.action.url);
  const editSessionIdOrAddress = url.pathname.split("/").pop();
  return editSessionIdOrAddress;
};
