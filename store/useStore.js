// lib/useStore.js
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set, get) => ({
      // ----- User -----
      user: null, // logged-in user
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),

      // ----- Events -----
      events: [], // all public events
      setEvents: (events) => set({ events }),
      addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
      updateEvent: (updated) =>
        set((state) => ({
          events: state.events.map((e) => (e._id === updated._id ? updated : e)),
        })),
      removeEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e._id !== id),
        })),

      // ----- Fetch public events for all users -----
      fetchEvents: async () => {
        try {
          const res = await fetch("/api/events", { cache: "no-store" });
          const data = await res.json();
          if (data.success) set({ events: data.data });
        } catch (err) {
          console.error("[FETCH EVENTS ERROR]", err);
        }
      },
    }),
    {
      name: "app-store", // localStorage key
      getStorage: () => (typeof window !== "undefined" ? localStorage : undefined),
      // skipHydration: true, // optional, uncomment if you still see hydration warnings
    }
  )
);

// ----- Hydrate user from localStorage safely on client -----
if (typeof window !== "undefined") {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    useStore.getState().setUser(JSON.parse(storedUser));
  }
}

export default useStore;
