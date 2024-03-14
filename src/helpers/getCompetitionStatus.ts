import { OPEN_VOTINGS_TIME_BEFORE_START } from "@/consts/votings";
import { IEditSession } from "@/data/models";

export type ICompetitionStatus = "voting" | "in-progress" | "ended" | "coming" | "invalid";

export const getCompetitionStatus = (editSession: IEditSession | null): ICompetitionStatus => {
  if (!editSession) return "invalid";

  const competitionDescription = editSession.description ?? editSession.editedDescription;
  if (!competitionDescription) return "invalid";

  const startTime = competitionDescription["project-metadata"].starttime;
  const endTime = competitionDescription["project-metadata"].endtime;
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
