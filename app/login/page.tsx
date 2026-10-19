"use client";

import Link from "next/link";
import PetBlock from "@/components/PetBlock/PetBlock";
import Title from "@/components/Title/Title";
import LoginForm, { type LoginValues } from "@/components/LoginForm/LoginForm";
import css from "./page.module.css";

export default function LoginPage() {
  const handleLogin = async (data: LoginValues) => {
    void data;
  };

  return (
    <main className={css.page}>
      <PetBlock
        src="/auth/dog.png"
        alt="Corgi Rich"
        authVariant="login"
        review={{
          emoji: "🐶",
          name: "Rich",
          birthday: "21.09.2020",
          text: "Rich would be the perfect addition to an active family that loves to play and go on walks. I bet he would love having a doggy playmate too!",
        }}
      />

      <section className={css.content}>
        <Title>Log in</Title>

        <p className={css.description}>
          Welcome! Please enter your credentials to login to the platform:
        </p>

        <LoginForm onSubmit={handleLogin} />

        <p className={css.registerText}>
          Don&apos;t have an account?{" "}
          <Link href="/register" className={css.registerLink}>
            Register
          </Link>
        </p>
      </section>
    </main>
  );
}
