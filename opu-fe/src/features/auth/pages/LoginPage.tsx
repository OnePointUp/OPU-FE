"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("로그인 시도", { email, pw });
    alert("로그인 시도: " + email);
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">로그인</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          className="border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          type="email"
          required
        />
        <input
          className="border px-3 py-2 rounded"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="password"
          type="password"
          required
        />
        <button className="bg-black text-white py-2 rounded" type="submit">
          로그인
        </button>
      </form>
    </div>
  );
}
