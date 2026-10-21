import Image from "next/image";
import css from "./page.module.css";

export default function HomePage() {
  return (
    <main className={css.home}>
      <section className={css.hero}>
        <div className={css.content}>
          <h1 className={css.title}>
            Take good <span>care</span> of your small pets
          </h1>

          <p className={css.description}>
            Choosing a pet for your home is a choice that is meant to enrich
            your life with immeasurable joy and tenderness.
          </p>
        </div>

        <div className={css.imageWrapper}>
          <Image
            src="/home_page.jpg"
            alt="Happy dog"
            fill
            priority
            sizes="(max-width: 767px) 100vw, (max-width: 1279px) 100vw, 1280px"
            className={css.image}
          />
        </div>
      </section>
    </main>
  );
}
