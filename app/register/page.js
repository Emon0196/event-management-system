"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useStore from "../../store/useStore";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useStore();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        setUser(data.user); // ✅ Update Zustand
        router.push("/");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white shadow p-8 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <button type="submit" className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Register
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
  Already have an account?{" "}
  <Link href="/login" className="underline text-blue-600">
    Login
  </Link>
</p>
      </form>
    </div>
  );
}
