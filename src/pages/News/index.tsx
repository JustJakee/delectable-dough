import LetterAnnouncement from "../../components/LetterAnnouncement/LetterAnnouncement";
import styles from "./News.module.css";

export default function News() {
  return (
    <div className={styles.page}>
      <LetterAnnouncement />
    </div>
  );
}
