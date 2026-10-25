import Image from "next/image";
import Link from "next/link";

import css from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={css.page}>
      <section className={css.errorSection}>
        <div className={css.content}>
          <div className={css.code} aria-label="404">
            <span>4</span>

            <div className={css.catCircle}>
              <Image
                src="/error.png"
                alt="Cat"
                fill
                priority
                sizes="(max-width: 767px) 80px, 160px"
                className={css.catImage}
              />
            </div>

            <span>4</span>
          </div>

          <h1 className={css.message}>Ooops! This page not found :(</h1>

          <Link href="/home" className={css.homeButton}>
            To home page
          </Link>
        </div>
      </section>
    </main>
  );
}
