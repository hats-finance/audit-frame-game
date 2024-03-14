import { config } from "@/config/config";
import styles from "./page.module.scss";
import { Metadata } from "next";
import { consts } from "@/consts/wording";
import { getEditSessionByAddressOrId } from "@/data/requests/getEditSessionByAddressOrId";
import { ICompetitionStatus, getCompetitionStatus } from "@/helpers/getCompetitionStatus";
import { getCompetitionCountdown } from "@/helpers/getCompetitionCountdown";

export const dynamic = "force-dynamic";

type IProps = {
  params: { addressOrEditSessionId: string };
};

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
  const { addressOrEditSessionId } = params;
  const editSession = await getEditSessionByAddressOrId(addressOrEditSessionId);
  const competitionStatus = getCompetitionStatus(editSession);
  const competitionCountDown = getCompetitionCountdown(editSession);

  const statusToFrame: { [K in ICompetitionStatus]: string } = {
    coming: "coming-competition",
    voting: "home",
    "in-progress": "inprogress-competition",
    invalid: "invalid-competition",
    ended: "ended-competition",
  };

  const statusToPost: { [K in ICompetitionStatus]: string } = {
    coming: "",
    voting: `${config.hostURL}/api/start`,
    // voting: `${config.hostURL}/api/results`,
    "in-progress": "",
    invalid: "",
    ended: "",
  };

  const statusToButton: { [K in ICompetitionStatus]: string } = {
    coming: "Coming soon!",
    voting: "Start game!",
    "in-progress": "Competition in progress. Wait for results.",
    invalid: "Invalid competition",
    ended: "Competition ended. Wait for results.",
  };

  const countdownToSend = encodeURIComponent(JSON.stringify(competitionCountDown ?? null));

  return {
    title: consts.title,
    description: consts.description,
    openGraph: {
      title: consts.title,
      images: [`${config.hostURL}/assets/images/home.jpg`],
    },
    metadataBase: new URL(config.hostURL as string),
    other: {
      "fc:frame": "vNext",
      "fc:frame:image:aspect_ratio": "1:1",
      "fc:frame:image": `${config.hostURL}/game/start?frameImage=${statusToFrame[competitionStatus]}&status=${competitionStatus}&countdown=${countdownToSend}                                                                                    `,
      "fc:frame:post_url": statusToPost[competitionStatus],
      "fc:frame:button:1": statusToButton[competitionStatus],
    },
  };
}

export default function Home() {
  return <main className={styles.main}>Hats Finance - Audit Frame Game ({config.env})</main>;
}
