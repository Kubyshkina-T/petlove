import css from "./page.module.css";
import SplashScreen from "@/components/SplashScreen/SplashScreen";

export default function Home() {
  return (
    <main className={css.page}>
      <div className={css.container}>
        <SplashScreen />
      </div>
    </main>
  );
}
