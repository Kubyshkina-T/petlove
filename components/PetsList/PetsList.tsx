import PetsItem from "@/components/PetsItem/PetsItem";

import type { Pet } from "@/types/pet";
import css from "@/app/profile/page.module.css";

type Props = {
  pets: Pet[];
  deletingPetId: string | null;
  onDeletePet: (pet: Pet) => void;
};

export default function PetsList({ pets, deletingPetId, onDeletePet }: Props) {
  if (pets.length === 0) {
    return (
      <div className={css.petsList}>
        <p className={css.placeholder}>You haven&apos;t added any pets yet.</p>
      </div>
    );
  }

  return (
    <div className={css.petsList}>
      {pets.map((pet) => (
        <PetsItem
          key={pet._id}
          pet={pet}
          onDelete={onDeletePet}
          isDeleting={deletingPetId !== null}
        />
      ))}
    </div>
  );
}
