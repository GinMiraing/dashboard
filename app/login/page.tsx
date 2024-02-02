"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import RedisClient from "@/lib/redis";

import LoginCard from "./components/loginCard";

export default async function Page() {
  const session = cookies().get("SESSION");

  if (session) {
    const userData = await RedisClient.get(session.value);

    if (userData) {
      return redirect("/dashboard");
    }
  }

  return (
    <main className="flex h-screen w-full items-center justify-center">
      <LoginCard />
    </main>
  );
}
