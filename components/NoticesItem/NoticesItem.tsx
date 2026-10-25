"use client";

import Image from "next/image";
import type { Notice } from "@/types/notice";
import css from "./NoticesItem.module.css";

type Props = {
  notice: Notice;
  onLearnMore: () => void;
  onFavorite: () => void;
  isFavorite: boolean;
  isFavoriteLoading: boolean;
};

export default function NoticesItem({
  notice,
  onLearnMore,
  onFavorite,
  isFavorite,
  isFavoriteLoading,
}: Props) {
  const {
    title,
    imgURL,
    popularity,
    name,
    birthday,
    sex,
    species,
    category,
    comment,
    price,
  } = notice;

  const formattedBirthday = new Date(
    `${birthday}T00:00:00Z`,
  ).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });

  const formattedPrice =
    typeof price === "number" ? `$${price.toFixed(2)}` : "Free";

  return (
    <li className={css.card}>
      <div className={css.imageWrapper}>
        <Image
          src={imgURL}
          alt={title}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
          className={css.image}
        />
      </div>

      <div className={css.heading}>
        <h2 className={css.title}>{title}</h2>

        <span className={css.popularity}>
          <svg className={css.star} aria-hidden="true">
            <use href="/icons/sprite.svg#icon-star" />
          </svg>
          {popularity}
        </span>
      </div>

      <dl className={css.details}>
        <div>
          <dt>Name</dt>
          <dd>{name}</dd>
        </div>

        <div>
          <dt>Birthday</dt>
          <dd>{formattedBirthday}</dd>
        </div>

        <div>
          <dt>Sex</dt>
          <dd>{sex}</dd>
        </div>

        <div>
          <dt>Species</dt>
          <dd>{species}</dd>
        </div>

        <div>
          <dt>Category</dt>
          <dd>{category}</dd>
        </div>
      </dl>

      <p className={css.comment}>{comment}</p>

      <p className={css.price}>{formattedPrice}</p>

      <div className={css.actions}>
        <button type="button" className={css.learnMore} onClick={onLearnMore}>
          Learn more
        </button>

        <button
          type="button"
          className={`${css.favorite} ${isFavorite ? css.favoriteActive : ""}`}
          onClick={onFavorite}
          disabled={isFavoriteLoading}
          aria-pressed={isFavorite}
          aria-label={
            isFavorite
              ? `Remove ${title} from favorites`
              : `Add ${title} to favorites`
          }
        >
          <svg className={css.heart} aria-hidden="true">
            <use href="/icons/sprite.svg#icon-heart" />
          </svg>
        </button>
      </div>
    </li>
  );
}
