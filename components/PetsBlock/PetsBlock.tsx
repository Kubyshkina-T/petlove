import AddPet from "@/components/AddPet/AddPet";
import PetsList from "@/components/PetsList/PetsList";

import type { Pet } from "@/types/pet";
import css from "@/app/profile/page.module.css";

type Props = {
  pets: Pet[];
  deletingPetId: string | null;
  onDeletePet: (pet: Pet) => void;
};

export default function PetsBlock({ pets, deletingPetId, onDeletePet }: Props) {
  return (
    <div className={css.petsSection}>
      <div className={css.petsHeading}>
        <h2 className={css.sectionTitle}>My pets</h2>
        <AddPet />
      </div>

      <PetsList
        pets={pets}
        deletingPetId={deletingPetId}
        onDeletePet={onDeletePet}
      />
    </div>
  );
}
