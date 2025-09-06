"use client";

import Link from "next/link";
import useStore from "../store/useStore";

export default function GuestBanner() {
  const { user } = useStore();

  if (user) return null;

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
      <p>
        Welcome! Please{" "}
        <Link href="/login" className="underline font-semibold">
          log in
        </Link>{" "}
        or{" "}
        <Link href="/register" className="underline font-semibold">
          register
        </Link>{" "}
        to create and manage events.
      </p>
    </div>
  );
}
