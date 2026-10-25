"use client";

import { useRouter } from "next/navigation";

import PetBlock from "@/components/PetBlock/PetBlock";
import AddPetForm, {
  type AddPetValues,
} from "@/components/AddPetForm/AddPetForm";

import css from "./page.module.css";

export default function AddPetPage() {
  const router = useRouter();

  const handleAddPet = async (data: AddPetValues) => {
    const response = await fetch("/api/profile/pets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      window.dispatchEvent(new Event("petlove-auth-changed"));

      router.replace("/login");

      throw new Error("Your session has expired.");
    }

    if (!response.ok) {
      const result = await response.json().catch(() => null);

      throw new Error(result?.message ?? "Failed to add pet.");
    }

    router.replace("/profile");
    router.refresh();
  };

  return (
    <main className={css.page}>
      <div className={css.container}>
        <div className={css.petBlock}>
          <PetBlock src="/add_pet.png" alt="Dog" />
        </div>

        <section className={css.formSection}>
          <div className={css.heading}>
            <h1 className={css.title}>Add my pet</h1>

            <span className={css.subtitle}>/ Personal details</span>
          </div>

          <AddPetForm
            onSubmit={handleAddPet}
            onCancel={() => router.push("/profile")}
          />
        </section>
      </div>
    </main>
  );
}
