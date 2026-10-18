import PetBlock from "@/components/PetBlock/PetBlock";
import Title from "@/components/Title/Title";
import LoginForm from "@/components/LoginForm/LoginForm";
import RegistrationForm from "@/components/RegistrationForm/RegistrationForm";
import Header from "@/components/Header/Header";
import css from "./AuthPage.module.css";

export default function AuthPage({ registration = false }: { registration?: boolean }) {
  return <div className={css.page}><div className={css.container}>
    <Header />
    <main className={css.content}>
      <PetBlock authVariant={registration ? "register" : "login"} src={registration ? "/auth/cat.png" : "/auth/dog.png"} alt={registration ? "Ginger cat Jack" : "Corgi Rich"} review={registration ? { emoji: "🐈", name: "Jack", birthday: "18.10.2021", text: "Jack is a gray Persian cat with green eyes. He loves to be pampered and groomed, and enjoys playing with toys." } : { emoji: "🐶", name: "Rich", birthday: "21.09.2020", text: "Rich would be the perfect addition to an active family that loves to play and go on walks. I bet he would love having a doggy playmate too!" }} />
      <section className={`${css.panel} ${registration ? css.registration : ""}`} aria-label={registration ? "Registration" : "Log in"}>
        <div className={css.inner}><Title className={css.title}>{registration ? "Registration" : "Log in"}</Title>
          <p className={css.description}>{registration ? "Thank you for your interest in our platform." : "Welcome! Please enter your credentials to login to the platform:"}</p>
          {registration ? <RegistrationForm /> : <LoginForm />}
        </div>
      </section>
    </main>
  </div></div>;
}
