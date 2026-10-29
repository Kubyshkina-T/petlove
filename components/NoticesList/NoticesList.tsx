"use client";

import { useCallback, useEffect, useState } from "react";

import NoticesItem from "@/components/NoticesItem/NoticesItem";
import ModalAttention from "@/components/ModalAttention/ModalAttention";
import ModalNotice from "@/components/ModalNotice/ModalNotice";

import type { Notice } from "@/types/notice";
import css from "./NoticesList.module.css";

type Props = {
  notices: Notice[];
  variant?: "default" | "profile";
  onFavoritesChange?: (ids: string[]) => void;
};

type FavoritesResponse = {
  isAuthenticated: boolean;
  favoriteIds: string[];
};

export default function NoticesList({
  notices,
  variant = "default",
  onFavoritesChange,
}: Props) {
  const [isAttentionOpen, setIsAttentionOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [favoriteError, setFavoriteError] = useState("");

  const [pendingFavoriteId, setPendingFavoriteId] = useState<string | null>(
    null,
  );

  const closeAttention = useCallback(() => {
    setIsAttentionOpen(false);
  }, []);

  const closeNotice = useCallback(() => {
    setSelectedNotice(null);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadFavorites = async () => {
      setFavoritesLoading(true);
      setFavoriteError("");

      try {
        const response = await fetch("/api/notices/favorites", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load favorites.");
        }

        const data: FavoritesResponse = await response.json();

        if (controller.signal.aborted) return;

        setFavoriteIds(data.favoriteIds);

        if (!data.isAuthenticated) {
          window.dispatchEvent(new Event("petlove-auth-changed"));
        }
      } catch {
        if (!controller.signal.aborted) {
          setFavoriteError(
            "Could not load favorites. Please refresh the page.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setFavoritesLoading(false);
        }
      }
    };

    void loadFavorites();

    return () => controller.abort();
  }, []);

  const checkAuthentication = async (): Promise<boolean> => {
    const response = await fetch("/api/auth/session", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to check session.");
    }

    const data: { isAuthenticated: boolean } = await response.json();

    return data.isAuthenticated;
  };

  // Open notice and register it as viewed on the backend
  const handleLearnMore = async (notice: Notice) => {
    if (isCheckingAuth) return;

    setIsCheckingAuth(true);
    setFavoriteError("");

    try {
      const isAuthenticated = await checkAuthentication();

      if (!isAuthenticated) {
        setIsAttentionOpen(true);
        return;
      }

      const response = await fetch(
        `/api/notices/${encodeURIComponent(notice._id)}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      if (response.status === 401) {
        window.dispatchEvent(new Event("petlove-auth-changed"));

        setIsAttentionOpen(true);
        return;
      }

      if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new Error(result?.message ?? "Failed to load notice.");
      }

      const fullNotice: Notice = await response.json();

      setSelectedNotice(fullNotice);
    } catch (error) {
      setFavoriteError(
        error instanceof Error
          ? error.message
          : "Could not open notice. Please try again.",
      );
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleFavorite = async (notice: Notice) => {
    if (pendingFavoriteId || favoritesLoading) return;

    setFavoriteError("");

    try {
      const authenticated = await checkAuthentication();

      if (!authenticated) {
        setIsAttentionOpen(true);
        return;
      }

      setPendingFavoriteId(notice._id);

      const isFavorite = favoriteIds.includes(notice._id);

      const response = await fetch(`/api/notices/favorites/${notice._id}`, {
        method: isFavorite ? "DELETE" : "POST",
      });

      if (response.status === 401) {
        window.dispatchEvent(new Event("petlove-auth-changed"));

        setIsAttentionOpen(true);

        throw new Error("Your session has expired. Please log in again.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(errorData?.message ?? "Failed to update favorites.");
      }

      const updatedFavorites: string[] = await response.json();

      setFavoriteIds(updatedFavorites);
      onFavoritesChange?.(updatedFavorites);
    } catch (error) {
      setFavoriteError(
        error instanceof Error ? error.message : "Failed to update favorites.",
      );
    } finally {
      setPendingFavoriteId(null);
    }
  };

  return (
    <>
      {notices.length === 0 ? (
        <p>No notices found.</p>
      ) : (
        <ul
          className={`${css.list} ${
            variant === "profile" ? css.profileList : ""
          }`}
        >
          {notices.map((notice) => (
            <NoticesItem
              key={notice._id}
              notice={notice}
              onLearnMore={() => void handleLearnMore(notice)}
              onFavorite={() => void handleFavorite(notice)}
              isFavorite={favoriteIds.includes(notice._id)}
              isFavoriteLoading={favoritesLoading || pendingFavoriteId !== null}
            />
          ))}
        </ul>
      )}

      {favoriteError && (
        <div role="alert">
          <p>{favoriteError}</p>

          <button type="button" onClick={() => setFavoriteError("")}>
            Close
          </button>
        </div>
      )}

      <ModalAttention isOpen={isAttentionOpen} onClose={closeAttention} />

      <ModalNotice
        notice={selectedNotice}
        onClose={closeNotice}
        onFavorite={handleFavorite}
        isFavorite={
          selectedNotice ? favoriteIds.includes(selectedNotice._id) : false
        }
        isFavoriteLoading={favoritesLoading || pendingFavoriteId !== null}
      />
    </>
  );
}
