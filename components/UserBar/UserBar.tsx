import Link from "next/link";
import css from "./UserBar.module.css";

type Props = {
  name: string;
  avatar?: string;
};

export default function UserBar({ name, avatar }: Props) {
  return (
    <Link href="/profile" className={css.userBar}>
      <span className={css.avatar}>
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatar}
            alt={`${name}'s avatar`}
            className={css.avatarImage}
          />
        ) : (
          <svg className={css.userIcon} aria-hidden="true">
            <use href="/icons/sprite.svg#icon-user" />
          </svg>
        )}
      </span>

      <span className={css.name}>{name}</span>
    </Link>
  );
}
