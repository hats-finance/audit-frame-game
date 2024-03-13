import styles from "./page.module.scss";

export const dynamic = "force-dynamic";
export const runtime = "experimental-edge";

export default function Home() {
  return <main className={styles.main}>Hats Finance - Audit Frame Game</main>;
}
