import styles from "./About.module.css";

export default function About() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>The Strudel Lady</h1>
        <p>
          The story of Delectable Dough Baking Company began many years ago. I
          think you could safely say it started from a young girl’s passion,
          after experiencing her first baking class. That young girl was me. I
          loved creating new recipes and trying them out on my family and
          friends. My father encouraged me to recreate my Bobba’s strudel
          recipe. Bakers of that generation usually didn’t write down their
          recipes, so it took many hours of experimentation to perfect. One day,
          my dad said “Jodie, that’s it! You finally did it.” And so, The
          Strudel Lady” was born.
        </p>
      </header>
    </div>
  );
}
