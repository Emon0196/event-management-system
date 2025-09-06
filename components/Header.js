"use client";

import Link from "next/link";
import { useState } from "react";
import useStore from "../store/useStore";
import { FaUserCircle } from "react-icons/fa"; // user icon
import Image from "next/image"; // for logo

export default function Header() {
  const { user, logout } = useStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-gray-700 text-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Logo and Site Name */}
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src="/logo2.webp" // replace with your logo path
          alt="Event Manager Logo"
          width={40}
          height={40}
          className="hover:scale-105 transition-transform duration-200"
        />
        <span className="text-xl font-bold">Event Manager</span>
      </Link>

      {/* Navigation */}
      <nav className="flex items-center space-x-4">
        <Link href="/" className="hover:text-blue-600 transition-colors duration-200">
          Home
        </Link>
        {user && (
          <>
            <Link href="/create-event" className="hover:text-blue-600 transition-colors duration-200">
              Create Event
            </Link>
            <Link href="/my-events" className="hover:text-blue-600 transition-colors duration-200">
              My Events
            </Link>
          </>
        )}
        {!user && (
          <Link href="/login" className="hover:text-blue-600 transition-colors duration-200">
            Login / Register
          </Link>
        )}
      </nav>

      {/* User profile dropdown */}
      {user && (
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-1 focus:outline-none p-1 rounded hover:bg-gray-200 transition-colors duration-200"
          >
            <FaUserCircle size={24} />
            <span className="hidden sm:inline font-medium">{user.name}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
              <p className="px-4 py-2 text-sm text-gray-700 border-b truncate" title={user.email}>
                {user.email}
              </p>
              <button
                onClick={() => {
                  logout();
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
