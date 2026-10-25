"use client";

import EditUserBtn from "@/components/EditUserBtn/EditUserBtn";
import UserBlock from "@/components/UserBlock/UserBlock";
import PetsBlock from "@/components/PetsBlock/PetsBlock";
import LogOutBtn from "@/components/LogOutBtn/LogOutBtn";

import type { Pet } from "@/types/pet";
import css from "@/app/profile/page.module.css";

type UserInfo = {
  name: string;
  email: string;
  phone: string;
  avatar: string;
};

type Props = {
  user: UserInfo;
  pets: Pet[];
  deletingPetId: string | null;
  onEdit: () => void;
  onDeletePet: (pet: Pet) => void;
};

export default function UserCard({
  user,
  pets,
  deletingPetId,
  onEdit,
  onDeletePet,
}: Props) {
  return (
    <section className={css.profileCard}>
      <div className={css.profileTop}>
        <span className={css.userBadge}>
          User
          <svg aria-hidden="true">
            <use href="/icons/sprite.svg#icon-user" />
          </svg>
        </span>

        <EditUserBtn onClick={onEdit} />
      </div>

      <UserBlock
        name={user.name}
        email={user.email}
        phone={user.phone}
        avatar={user.avatar}
        onEdit={onEdit}
      />

      <PetsBlock
        pets={pets}
        deletingPetId={deletingPetId}
        onDeletePet={onDeletePet}
      />

      <LogOutBtn className={css.logoutButton} label="LOGOUT" />
    </section>
  );
}
