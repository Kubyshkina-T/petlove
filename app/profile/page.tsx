"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import NoticesList from "@/components/NoticesList/NoticesList";
import ModalEditUser, {
  type EditUserValues,
} from "@/components/ModalEditUser/ModalEditUser";
import LogOutBtn from "@/components/LogOutBtn/LogOutBtn";
import type { Notice } from "@/types/notice";
import type { Pet } from "@/types/pet";
import Loader from "@/components/Loader/Loader";
import css from "./page.module.css";

type ProfileTab = "favorites" | "viewed";

type Profile = {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  noticesFavorites: Notice[];
  pets: Pet[];
  noticesViewed: Notice[];
};

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState<ProfileTab>("favorites");

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
        <section className={css.profileCard}>
          <div className={css.profileTop}>
            <span className={css.userBadge}>
              User
              <svg aria-hidden="true">
                <use href="/icons/sprite.svg#icon-user" />
              </svg>
            </span>

            <button
              type="button"
              className={css.editButton}
              onClick={() => setIsEditOpen(true)}
              aria-label="Edit profile"
            >
              <svg aria-hidden="true">
                <use href="/icons/sprite.svg#icon-edit-2" />
              </svg>
            </button>
          </div>

          <div className={css.avatarSection}>
            <div className={css.avatarPlaceholder}>
              {profile.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar}
                  alt={`${profile.name}'s avatar`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                <svg aria-hidden="true">
                  <use href="/icons/sprite.svg#icon-user" />
                </svg>
              )}
            </div>

            <button
              type="button"
              className={css.uploadButton}
              onClick={() => setIsEditOpen(true)}
            >
              Edit photo URL
            </button>
          </div>

          <div className={css.information}>
            <h2 className={css.sectionTitle}>My information</h2>

            <div className={css.infoGrid}>
              <div className={css.infoField}>{profile.name}</div>
              <div className={css.infoField}>{profile.email}</div>
              <div className={css.infoField}>
                {profile.phone || "Phone not specified"}
              </div>
            </div>
          </div>

          <div className={css.petsSection}>
            <div className={css.petsHeading}>
              <h2 className={css.sectionTitle}>My pets</h2>

              <button
                type="button"
                className={css.addPetButton}
                onClick={() => router.push("/add-pet")}
              >
                Add pet +
              </button>
            </div>

            <div className={css.petsList}>
              {profile.pets.length > 0 ? (
                profile.pets.map((pet) => (
                  <article key={pet._id} className={css.petCard}>
                    <div className={css.petImage}>
                      <Image
                        src={pet.imgURL}
                        alt={pet.name}
                        fill
                        sizes="66px"
                        unoptimized
                      />
                    </div>

                    <div className={css.petInfo}>
                      <h3 className={css.petName}>{pet.title}</h3>

                      <p>Name: {pet.name}</p>
                      <p>
                        Birthday:{" "}
                        {pet.birthday
                          ? new Date(
                              `${pet.birthday.slice(0, 10)}T00:00:00Z`,
                            ).toLocaleDateString("en-GB", {
                              timeZone: "UTC",
                            })
                          : "Unknown"}
                      </p>
                      <p>Sex: {pet.sex}</p>
                      <p>Species: {pet.species}</p>
                    </div>

                    <button
                      type="button"
                      className={css.deletePetButton}
                      onClick={() => void handleDeletePet(pet)}
                      disabled={deletingPetId !== null}
                      aria-label={`Remove ${pet.name} from my pets`}
                      title="Remove pet"
                    >
                      <svg aria-hidden="true">
                        <use href="/icons/sprite.svg#icon-trash" />
                      </svg>
                    </button>
                  </article>
                ))
              ) : (
                <p className={css.placeholder}>
                  You haven&apos;t added any pets yet.
                </p>
              )}
            </div>
          </div>

          <LogOutBtn className={css.logoutButton} label="LOGOUT" />
        </section>

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
                notices={profile.noticesFavorites}
                variant="profile"
                onFavoritesChange={(ids) => {
                  setProfile((current) =>
                    current
                      ? {
                          ...current,
                          noticesFavorites: current.noticesFavorites.filter(
                            (notice) => ids.includes(notice._id),
                          ),
                        }
                      : null,
                  );
                }}
              />
            ) : (
              <NoticesList notices={profile.noticesViewed} variant="profile" />
            )}
          </div>
        </section>
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
