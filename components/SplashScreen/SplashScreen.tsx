"use client";

import { useState } from "react";
import Image from "next/image";

import Loader from "@/components/Loader/Loader";
import css from "./SplashScreen.module.css";

export default function SplashScreen() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div className={css.wrapper}>
      <Image
        src="/main.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className={`${css.image} ${isImageLoaded ? css.imageVisible : ""}`}
        onLoad={() => setIsImageLoaded(true)}
      />

      <div className={css.overlay} />

      <div className={css.content}>
        {!isImageLoaded ? (
          <div className={css.loaderWrapper}>
            <Loader />
          </div>
        ) : (
          <div className={css.logo} aria-label="PetLove">
            <span>petl</span>

            <svg className={css.heart} aria-hidden="true">
              <use href="/icons/sprite.svg#icon-heart" />
            </svg>

            <span>ve</span>
          </div>
        )}
      </div>
    </div>
  );
}
