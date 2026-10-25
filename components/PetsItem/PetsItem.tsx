import Image from "next/image";

import type { Pet } from "@/types/pet";
import css from "@/app/profile/page.module.css";

type Props = {
  pet: Pet;
  onDelete: (pet: Pet) => void;
  isDeleting: boolean;
};

export default function PetsItem({ pet, onDelete, isDeleting }: Props) {
  const formattedBirthday = pet.birthday
    ? new Date(`${pet.birthday.slice(0, 10)}T00:00:00Z`).toLocaleDateString(
        "en-GB",
        {
          timeZone: "UTC",
        },
      )
    : "Unknown";

  return (
    <article className={css.petCard}>
      <div className={css.petImage}>
        <Image src={pet.imgURL} alt={pet.name} fill sizes="66px" unoptimized />
      </div>

      <div className={css.petInfo}>
        <div className={css.petHeading}>
          <h3 className={css.petTitle}>{pet.title}</h3>

          <button
            type="button"
            className={css.deletePetButton}
            onClick={() => onDelete(pet)}
            disabled={isDeleting}
            aria-label={`Remove ${pet.name}`}
          >
            <svg aria-hidden="true">
              <use href="/icons/sprite.svg#icon-trash" />
            </svg>
          </button>
        </div>

        <div className={css.petDetails}>
          <p className={css.detail}>
            <span className={css.detailLabel}>Name</span>
            <span className={css.detailValue}>{pet.name}</span>
          </p>

          <p className={css.detail}>
            <span className={css.detailLabel}>Birthday</span>
            <span className={css.detailValue}>{formattedBirthday}</span>
          </p>

          <p className={css.detail}>
            <span className={css.detailLabel}>Sex</span>
            <span className={css.detailValue}>{pet.sex}</span>
          </p>

          <p className={css.detail}>
            <span className={css.detailLabel}>Species</span>
            <span className={css.detailValue}>{pet.species}</span>
          </p>
        </div>
      </div>
    </article>
  );
}
