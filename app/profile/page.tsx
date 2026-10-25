"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import UserCard from "@/components/UserCard/UserCard";
import MyNotices from "@/components/MyNotices/MyNotices";
import ModalEditUser, {
  type EditUserValues,
} from "@/components/ModalEditUser/ModalEditUser";
import Loader from "@/components/Loader/Loader";

import type { Notice } from "@/types/notice";
import type { Pet } from "@/types/pet";

import css from "./page.module.css";

type Profile = {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  noticesFavorites: Notice[];
  noticesViewed: Notice[];
  pets: Pet[];
};

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [deletingPetId, setDeletingPetId] = useState<string | null>(null);

  const [error, setError] = useState("");

  const closeEdit = useCallback(() => {
    setIsEditOpen(false);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProfile() {
      try {
        const response = await fetch("/api/profile", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        if (response.status === 401) {
          window.dispatchEvent(new Event("petlove-auth-changed"));
          router.replace("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load profile.");
        }

        const data: Profile = await response.json();

        if (!controller.signal.aborted) {
          setProfile(data);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError("Could not load profile. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadProfile();

    return () => controller.abort();
  }, [router]);

  const handleSaveProfile = async (data: EditUserValues) => {
    const response = await fetch("/api/profile/edit", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      window.dispatchEvent(new Event("petlove-auth-changed"));
      router.replace("/login");
      throw new Error("Your session has expired.");
    }

    if (!response.ok) {
      const result = await response.json().catch(() => null);

      throw new Error(result?.message ?? "Could not update your profile.");
    }

    const updatedResponse = await fetch("/api/profile", {
      cache: "no-store",
    });

    if (!updatedResponse.ok) {
      throw new Error(
        "Changes were saved, but the profile could not be refreshed.",
      );
    }

    const updatedProfile: Profile = await updatedResponse.json();

    setProfile(updatedProfile);
    setIsEditOpen(false);

    window.dispatchEvent(new Event("petlove-auth-changed"));

    router.refresh();
  };

  const handleDeletePet = async (pet: Pet) => {
    if (deletingPetId) return;

    const confirmed = window.confirm(
      `Are you sure you want to remove ${pet.name} from your pets?`,
    );

    if (!confirmed) return;

    setError("");
    setDeletingPetId(pet._id);

    try {
      const response = await fetch(`/api/profile/pets/${pet._id}`, {
        method: "DELETE",
      });

      if (response.status === 401) {
        window.dispatchEvent(new Event("petlove-auth-changed"));
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new Error(result?.message ?? "Failed to remove pet.");
      }

      setProfile((current) =>
        current
          ? {
              ...current,
              pets: current.pets.filter((item) => item._id !== pet._id),
            }
          : null,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove pet.");
    } finally {
      setDeletingPetId(null);
    }
  };

  const handleFavoritesChange = (ids: string[]) => {
    setProfile((current) =>
      current
        ? {
            ...current,
            noticesFavorites: current.noticesFavorites.filter((notice) =>
              ids.includes(notice._id),
            ),
          }
        : null,
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!profile) {
    return (
      <main className={css.page}>{error && <p role="alert">{error}</p>}</main>
    );
  }

  return (
    <main className={css.page}>
      <div className={css.container}>
        <UserCard
          user={{
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            avatar: profile.avatar,
          }}
          pets={profile.pets}
          deletingPetId={deletingPetId}
          onEdit={() => setIsEditOpen(true)}
          onDeletePet={(pet) => {
            void handleDeletePet(pet);
          }}
        />

        <MyNotices
          favorites={profile.noticesFavorites}
          viewed={profile.noticesViewed}
          onFavoritesChange={handleFavoritesChange}
        />
      </div>

      <ModalEditUser
        isOpen={isEditOpen}
        user={{
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          avatar: profile.avatar,
        }}
        onClose={closeEdit}
        onSave={handleSaveProfile}
      />

      {error && (
        <div role="alert" className={css.pageError}>
          <p>{error}</p>
          <button type="button" onClick={() => setError("")}>
            Close
          </button>
        </div>
      )}
    </main>
  );
}
