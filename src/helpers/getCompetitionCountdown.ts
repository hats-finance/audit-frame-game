import { OPEN_VOTINGS_TIME_BEFORE_START } from "@/consts/votings";
import { IEditSession } from "@/data/models";
import { getCompetitionStatus } from "./getCompetitionStatus";

export type ICompetitionCountdown = {
  days: string | undefined;
  hours: string;
  minutes: string;
  seconds: string;
};

const appendZero = (value: number) => (value < 10 ? `0${value}` : `${value}`);

export const getCompetitionCountdown = (editSession: IEditSession | null): ICompetitionCountdown | undefined => {
  if (!editSession) return undefined;

  const competitionStatus = getCompetitionStatus(editSession);
  const competitionStartTime = (editSession.description ?? editSession.editedDescription)["project-metadata"].starttime;
  if (competitionStatus === "invalid" || competitionStatus === "ended" || competitionStatus === "in-progress") return undefined;
  if (!competitionStartTime) return undefined;

  // If the competition is coming, we need to calculate the countdown for the start of the voting period
  if (competitionStatus === "coming") {
    const now = Date.now() / 1000;
    const timeLeft = competitionStartTime - now - OPEN_VOTINGS_TIME_BEFORE_START;
    const days = Math.floor(timeLeft / (60 * 60 * 24));
    const hours = Math.floor((timeLeft % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((timeLeft % (60 * 60)) / 60);
    const seconds = Math.floor((timeLeft % (60 * 60)) / 60);
    return { days: days.toString(), hours: appendZero(hours), minutes: appendZero(minutes), seconds: appendZero(seconds) };
  }

  // If the competion is in voting period or in progress, we need to calculate the countdown for start of the competition
  if (competitionStatus === "voting") {
    const now = Date.now() / 1000;
    const timeLeft = competitionStartTime - now;
    const days = Math.floor(timeLeft / (60 * 60 * 24));
    const hours = Math.floor((timeLeft % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((timeLeft % (60 * 60)) / 60);
    const seconds = Math.floor((timeLeft % (60 * 60)) / 60);
    return { days: days.toString(), hours: appendZero(hours), minutes: appendZero(minutes), seconds: appendZero(seconds) };
  }
};
