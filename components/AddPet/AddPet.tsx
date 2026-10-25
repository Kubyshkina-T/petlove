import Link from "next/link";
import css from "./AddPet.module.css";

export default function AddPet() {
  return (
    <Link href="/add-pet" className={css.addPetButton}>
      Add pet
      <span aria-hidden="true">+</span>
    </Link>
  );
}
