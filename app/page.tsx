import css from "@/app/page.module.css";
import LogInPage from "@/components/LogInPage/LogInPage";
import SplashScreen from "@/components/SplashScreen/SplashScreen";

export default function Home() {
  return (
    <main>
      <div className={css.container}>
        {/* <SplashScreen /> */}
        <LogInPage />
      </div>
    </main>
  );
}
