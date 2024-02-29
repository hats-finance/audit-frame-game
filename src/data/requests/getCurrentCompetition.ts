// import { getVaultDescription } from "@/helpers/getVaultDescription";
// import { getOptedInCompetitions } from "../repo";
// import { OPEN_VOTINGS_TIME_BEFORE_START } from "@/consts/votings";

// export const getCurrentCompetition = async () => {
//   const optedInComps = await getOptedInCompetitions();
//   if (!optedInComps) return null;

//   for (const comp of optedInComps) {
//     const isDeployed = !!comp.vaultAddress;

//     let startTime: number | undefined;
//     if (isDeployed) {
//       const vaultDesc = await getVaultDescription(comp.vaultAddress!, comp.chainId!);
//       startTime = vaultDesc["project-metadata"].starttime;
//     } else {
//       startTime = comp.editedDescription["project-metadata"].starttime;
//     }

//     if (!startTime) continue;

//     const now = Date.now() / 1000;
//     if (now < startTime && now >= startTime - OPEN_VOTINGS_TIME_BEFORE_START) {
//       return comp;
//     }
//   }
// };
