"use client";

import { useState } from "react";

import NoticesList from "@/components/NoticesList/NoticesList";
import type { Notice } from "@/types/notice";

import css from "@/app/profile/page.module.css";

type ProfileTab = "favorites" | "viewed";

type Props = {
  favorites: Notice[];
  viewed: Notice[];
  onFavoritesChange: (ids: string[]) => void;
};

export default function MyNotices({
  favorites,
  viewed,
  onFavoritesChange,
}: Props) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("favorites");

  return (
    <section className={css.noticesSection}>
      <div className={css.tabs} role="tablist" aria-label="My notices">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "favorites"}
          className={`${css.tab} ${
            activeTab === "favorites" ? css.activeTab : ""
          }`}
          onClick={() => setActiveTab("favorites")}
        >
          My favorite pets
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "viewed"}
          className={`${css.tab} ${
            activeTab === "viewed" ? css.activeTab : ""
          }`}
          onClick={() => setActiveTab("viewed")}
        >
          Viewed
        </button>
      </div>

      <div className={css.noticesContent}>
        {activeTab === "favorites" ? (
          <NoticesList
            notices={favorites}
            variant="profile"
            onFavoritesChange={onFavoritesChange}
          />
        ) : (
          <NoticesList notices={viewed} variant="profile" />
        )}
      </div>
    </section>
  );
}
