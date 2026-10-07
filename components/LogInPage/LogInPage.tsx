import css from "@/components/LogInPage/LogInPage.module.css";
import PetBlock from "../PetBlock/PetBlock";

export default function LogInPage() {
  return (
    <div className={css.loginWrapper}>
      <PetBlock
        src="/log-in.png"
        alt="Dog"
        review={{
          emoji: "🐶",
          name: "Rich",
          birthday: "21.09.2020",
          text: "Rich would be the perfect addition to an active family that loves to play and go on walks. I bet he would love having a doggy playmate too!",
        }}
      />
    </div>
  );
}
