"use client";

import UserBar from "@/components/UserBar/UserBar";
import LogOutBtn from "@/components/LogOutBtn/LogOutBtn";

import css from "./UserNav.module.css";

type Props = {
  name: string;
  avatar?: string;
};

export default function UserNav({ name, avatar }: Props) {
  return (
    <div className={css.userNav}>
      <LogOutBtn className={css.logout} label="LOG OUT" />
      <UserBar name={name} avatar={avatar} />
    </div>
  );
}
