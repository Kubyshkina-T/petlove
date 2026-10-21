import FriendsItem from "@/components/FriendsItem/FriendsItem";
import type { Friend } from "@/types/friend";
import css from "./FriendsList.module.css";

type Props = {
  friends: Friend[];
};

export default function FriendsList({ friends }: Props) {
  if (friends.length === 0) {
    return <p>No friends found.</p>;
  }

  return (
    <ul className={css.list}>
      {friends.map((friend) => (
        <FriendsItem key={friend._id} friend={friend} />
      ))}
    </ul>
  );
}
