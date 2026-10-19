"use client";

import Link from "next/link";

import PetBlock from "@/components/PetBlock/PetBlock";
import RegistrationForm, {
  type RegistrationValues,
} from "@/components/RegistrationForm/RegistrationForm";
import Title from "@/components/Title/Title";

import css from "./page.module.css";

export default function RegisterPage() {
  const handleRegister = async (data: RegistrationValues) => {
    console.log("Registration data:", {
      name: data.name,
      email: data.email,
    });
  };

  return (
    <main className={css.page}>
      <PetBlock src="/auth/cat.png" alt="Cat" authVariant="register" />

      <section className={css.content}>
        <Title>Registration</Title>

        <p className={css.description}>
          Thank you for your interest in our platform.
        </p>

        <RegistrationForm onSubmit={handleRegister} />

        <p className={css.loginText}>
          Already have an account?{" "}
          <Link href="/login" className={css.loginLink}>
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}
