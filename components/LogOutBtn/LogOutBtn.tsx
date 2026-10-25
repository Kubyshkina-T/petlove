"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import ModalApproveAction from "@/components/ModalApproveAction/ModalApproveAction";

type Props = {
  className?: string;
  label?: string;
};

type LogoutResponse = {
  success?: boolean;
  backendError?: string | null;
};

export default function LogOutBtn({ className, label = "LOG OUT" }: Props) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to clear the local session.");
      }

      const result: LogoutResponse = await response.json();

      setIsOpen(false);

      window.dispatchEvent(new Event("petlove-auth-changed"));

      if (result.backendError) {
        toast.error(result.backendError);
      } else {
        toast.success("You have logged out successfully.");
      }

      router.replace("/home");
      router.refresh();
    } catch {
      toast.error("Could not log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => setIsOpen(true)}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? "LOGGING OUT..." : label}
      </button>

      <ModalApproveAction
        isOpen={isOpen}
        isLoading={isLoggingOut}
        onClose={() => setIsOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
