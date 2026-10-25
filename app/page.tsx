import css from "./page.module.css";
import SplashScreen from "@/components/SplashScreen/SplashScreen";

export default function Home() {
  return (
    <main>
      <div className={css.container}>
        <SplashScreen />
      </div>
    </main>
  );
}
