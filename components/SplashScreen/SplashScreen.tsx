import css from "@/components/SplashScreen/SplashScreen.module.css";
import Image from "next/image";

export default function SplashScreen() {
  return (
    <div className={css.wrapper}>
      <Image
        src="/main.jpg"
        alt="Petlove main page"
        fill
        priority
        className={css.image}
      />
      <div className={css.logo}>
        petl
        <svg className={css.heart} aria-hidden="true">
          <use href="/icons/sprite.svg#icon-heart" />
        </svg>
        ve
      </div>
    </div>
  );
}
