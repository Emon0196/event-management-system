import { create } from "zustand";

const useStore = create((set, get) => ({
  user: null, // Logged-in user
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user)); // persist in localStorage
    set({ user });
  },
  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null });
  },

  events: [], // All events
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
}));

// Hydrate user from localStorage on client
if (typeof window !== "undefined") {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    useStore.getState().setUser(JSON.parse(storedUser));
  }
}

export default useStore;
