import Image from "next/image";
import css from "./PetBlock.module.css";

type PetReview = {
  emoji: string;
  name: string;
  birthday: string;
  text: string;
};

type Props = {
  src: string;
  alt: string;
  review: PetReview;
};

export default function PetBlock({ src, alt, review }: Props) {
  return (
    <div className={css.wrapper}>
      <Image
        src="/icons/orange-shape.svg"
        alt=""
        width={572}
        height={715}
        className={css.shape}
      />
      <Image
        src={src}
        alt={alt}
        width={335}
        height={280}
        className={css.image}
      />

      <div className={css.review}>
        <div className={css.avatar}>{review.emoji}</div>

        <div className={css.reviewContent}>
          <div className={css.reviewTop}>
            <span className={css.name}>{review.name}</span>

            <span className={css.birthday}>
              Birthday: <strong>{review.birthday}</strong>
            </span>
          </div>

          <p className={css.reviewText}>{review.text}</p>
        </div>
      </div>
    </div>
  );
}
