import Title from "@/components/Title/Title";
import FriendsList from "@/components/FriendsList/FriendsList";
import type { Friend } from "@/types/friend";
import css from "./page.module.css";

async function getFriends(): Promise<Friend[]> {
  const url = process.env.PETLOVE_FRIENDS_URL;

  if (!url) {
    throw new Error("PETLOVE_FRIENDS_URL is not configured");
  }

  const response = await fetch(url, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch friends");
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Invalid friends response");
  }

  return data as Friend[];
}

export default async function FriendsPage() {
  let friends: Friend[] = [];
  let error = false;

  try {
    friends = await getFriends();
  } catch (err) {
    console.error("Friends loading error:", err);
    error = true;
  }

  return (
    <main className={css.page}>
      <Title>Our friends</Title>

      {error ? (
        <p role="alert">Failed to load friends.</p>
      ) : (
        <FriendsList friends={friends} />
      )}
    </main>
  );
}
