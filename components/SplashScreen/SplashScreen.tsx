import css from "@/components/SplashScreen/SplashScreen.module.css";
import Image from "next/image";

export default function SplashScreen() {
  return (
    <div className={css.wrapper}>
      <Image
        src="/public/main.jpg"
        alt="Petlove main page"
        fill
        priority
        className={css.image}
      />
      <div className={css.logo}>
        <span>petl</span>

        <Image
          src="/heart-icon.png"
          alt=""
          width={20}
          height={20}
          className={css.heart}
        />

        <span>ve</span>
      </div>
    </div>
  );
}
