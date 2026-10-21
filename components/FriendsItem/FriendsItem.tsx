import Image from "next/image";
import type { Friend, WorkDay } from "@/types/friend";
import css from "./FriendsItem.module.css";

type Props = {
  friend: Friend;
};

function getWorkingHours(workDays?: WorkDay[]): string {
  if (!workDays?.length) return "Not specified";

  const openedDays = workDays.filter((day) => day.isOpen && day.from && day.to);

  if (openedDays.length === 0) {
    return workDays.every((day) => day.isOpen)
      ? "Day and night"
      : "Not specified";
  }

  const firstDay = openedDays[0];

  const sameHours = openedDays.every(
    (day) => day.from === firstDay.from && day.to === firstDay.to,
  );

  if (!sameHours) return "See schedule";

  if (
    workDays.every((day) => day.isOpen) &&
    firstDay.from === "00:00" &&
    (firstDay.to === "23:59" || firstDay.to === "24:00")
  ) {
    return "Day and night";
  }

  return `${firstDay.from} - ${firstDay.to}`;
}

export default function FriendsItem({ friend }: Props) {
  const { title, url, addressUrl, imageUrl, address, workDays, phone, email } =
    friend;

  const hours = getWorkingHours(workDays);

  const phoneHref = phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : null;

  return (
    <li className={css.card}>
      <span className={css.hours}>{hours}</span>

      <div className={css.logoWrapper}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${title} logo`}
            width={80}
            height={80}
            className={css.logo}
          />
        ) : (
          <span className={css.placeholder}>🐾</span>
        )}
      </div>

      <div className={css.content}>
        <h2 className={css.title}>
          {url ? (
            <a href={url} target="_blank" rel="noopener noreferrer">
              {title}
            </a>
          ) : (
            title
          )}
        </h2>

        <address className={css.contacts}>
          {email && (
            <p>
              <span>Email: </span>
              <a href={`mailto:${email}`}>{email}</a>
            </p>
          )}

          {address && (
            <p>
              <span>Address: </span>
              {addressUrl ? (
                <a href={addressUrl} target="_blank" rel="noopener noreferrer">
                  {address}
                </a>
              ) : (
                address
              )}
            </p>
          )}

          {phone && phoneHref && (
            <p>
              <span>Phone: </span>
              <a href={phoneHref}>{phone}</a>
            </p>
          )}
        </address>
      </div>
    </li>
  );
}
