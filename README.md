# 🎉 Event Management System (Next.js + MongoDB)

A modern full-stack **Event Management Application** built with **Next.js 13+, Tailwind CSS, Zustand (state management), and MongoDB**.  
It allows users to **create, update, delete, RSVP, and manage events** with authentication and authorization.

---

## 🚀 Features

- 🔐 **Authentication & Authorization**
  - JWT-based login/register
  - User session persistence with `localStorage`

- 📅 **Event Management**
  - Create new events
  - Edit/update events
  - Delete events
  - View event details (with banner, description, date, location, category)

- 🙋 **RSVP System**
  - RSVP to events
  - Cancel RSVP
  - Live attendee count

- 👤 **My Events Page**
  - View only events created by the logged-in user
  - Edit or delete your own events
  - Interactive and elegant event cards

- 🎨 **UI/UX**
  - Tailwind CSS + responsive design
  - Smooth hover effects and collapsible sections
  - Mobile-friendly, clean layouts

- 🗂️ **Global State Management (Zustand)**
  - Centralized store for managing `user` and `events`
  - Automatically persists user session into `localStorage`
  - Store methods for:
    - `setUser` / `logout`
    - `setEvents`, `addEvent`, `updateEvent`, `removeEvent`
  - Keeps frontend UI in sync with backend API calls in real-time

---

## 🛠️ Tech Stack

**Frontend**
- Next.js 13+ (App Router, Server Actions)
- React 18
- Zustand (Global State Management)
- Tailwind CSS + Heroicons/React Icons

**Backend**
- Next.js API Routes (Serverless functions)
- MongoDB with Mongoose
- JWT Authentication

**Other Tools**
- ESLint + Prettier for code formatting
- LocalStorage for session persistence

---

## ⚙️ Setup & Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/Emon0196/event-management-system.git
   cd event-management-system

2. **Install dependencies**
   ```bash
   npm install

3. **Configure Environment Variables**
   ```bash
   MONGODB_URI=mongodb+srv://your-mongo-uri
   JWT_SECRET=your-secret-key

4. **Run the development server**
   ```bash
   npm run dev
