import css from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={css.loader} role="status" aria-label="Loading">
      <div className={css.paws} aria-hidden="true">
        {[0, 1, 2, 3].map((index) => (
          <svg key={index} className={css.paw} viewBox="0 0 33 31">
            <use href="/icons/sprite.svg#icon-lapa" />
          </svg>
        ))}
      </div>

      <p className={css.text}>Finding your furry friends...</p>
    </div>
  );
}
