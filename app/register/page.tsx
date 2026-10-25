"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import PetBlock from "@/components/PetBlock/PetBlock";
import RegistrationForm, {
  type RegistrationValues,
} from "@/components/RegistrationForm/RegistrationForm";
import Title from "@/components/Title/Title";

import css from "./page.module.css";

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = async (data: RegistrationValues) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
    });

    if (!response.ok) {
      const result = await response.json().catch(() => null);

      throw new Error(
        result?.message ?? "Registration failed. Please try again.",
      );
    }
    window.dispatchEvent(new Event("petlove-auth-changed"));
    router.replace("/profile");
    router.refresh();
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
