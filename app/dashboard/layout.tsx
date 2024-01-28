import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import RedisClient from "@/lib/redis";

import Footer from "./components/footer";
import Header from "./components/header";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = cookies().get("SESSION");

  if (!session) {
    return redirect("/login");
  }

  const userData = await RedisClient.get(session.value);

  if (!userData) {
    return redirect("/login");
  }

  return (
    <>
      <Header userData={JSON.parse(userData)} />
      <main className="mx-auto min-h-[calc(100vh-5rem)] w-full max-w-screen-xl px-6">
        {children}
      </main>
      <Footer />
    </>
  );
}
