import Image from "next/image";
import css from "./PetBlock.module.css";

type PetReview = {
  emoji: string;
  name: string;
  birthday: string;
  text: string;
};

type PetBlockProps = {
  src: string;
  alt: string;
  review?: PetReview;
  authVariant?: "login" | "register";
};

export default function PetBlock({
  src,
  alt,
  review,
  authVariant,
}: PetBlockProps) {
  const isAuthPage = Boolean(authVariant);

  const wrapperClass = [
    css.wrapper,
    isAuthPage && css.auth,
    authVariant === "register" && css.register,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClass}>
      <Image
        src={isAuthPage ? "/auth/shape.svg" : "/icons/orange-shape.svg"}
        alt=""
        width={572}
        height={715}
        className={css.shape}
        aria-hidden="true"
      />

      <Image
        src={src}
        alt={alt}
        width={335}
        height={280}
        className={css.image}
        sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 600px"
      />

      {review && (
        <div className={css.review}>
          <div className={css.avatar} aria-hidden="true">
            {review.emoji}
          </div>

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
      )}
    </div>
  );
}
