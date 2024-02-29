import { OPEN_VOTINGS_TIME_BEFORE_START } from "@/consts/votings";
import { IEditSession } from "@/data/models";

export type ICompetitionStatus = "voting" | "in-progress" | "ended" | "coming" | "invalid";

export const getCompetitionStatus = (editSession: IEditSession | null): ICompetitionStatus => {
  if (!editSession) return "invalid";

  const startTime = (editSession.description ?? editSession.editedDescription)["project-metadata"].starttime;
  const endTime = (editSession.description ?? editSession.editedDescription)["project-metadata"].endtime;
  if (!startTime || !endTime) return "invalid";

  const now = Date.now() / 1000;
  if (now < startTime && now >= startTime - OPEN_VOTINGS_TIME_BEFORE_START) {
    return "voting";
  }

  if (now >= startTime && now < endTime) return "in-progress";
  if (now >= endTime) return "ended";
  if (now < startTime) return "coming";

  return "invalid";
};
