import { config } from "@/config/config";
import styles from "./page.module.scss";
import { Metadata } from "next";
import { consts } from "@/consts/wording";
import { getEditSessionByAddressOrId } from "@/data/requests/getEditSessionByAddressOrId";
import { ICompetitionData } from "@/data/models";

export const dynamic = "force-dynamic";

type IProps = {
  params: { addressOrEditSessionId: string };
};

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
  const { addressOrEditSessionId } = params;
  let competitonData = "null";

  // if (!addressOrEditSessionId.startsWith("0x")) {
  const editSession = await getEditSessionByAddressOrId(addressOrEditSessionId);
  competitonData = editSession
    ? encodeURIComponent(
        JSON.stringify({
          optedInUsers: editSession.optedInUsers?.length ?? 0,
          logo: editSession.editedDescription["project-metadata"].icon,
          name: editSession.editedDescription["project-metadata"].name,
        } as ICompetitionData)
      )
    : "";
  // }

  return {
    title: consts.title,
    description: consts.description,
    openGraph: {
      title: consts.title,
      images: [`${config.hostURL}/game/login`],
    },
    metadataBase: new URL(config.hostURL as string),
    other: {
      "fc:frame": "vNext",
      "fc:frame:image:aspect_ratio": "1:1",
      "fc:frame:image": `${config.hostURL}/game/login?competition=${competitonData}`,
      "fc:frame:post_url": `${config.hostURL}/api/login?competition=${competitonData}`,
      "fc:frame:button:1": "Continue ➡️",
    },
  };
}

export default function Home() {
  return <main className={styles.main}>Hats Finance - Audit Frame Game ({config.env})</main>;
}
