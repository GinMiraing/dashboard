import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import RedisClient from "@/lib/redis";

export default async function Page() {
  const session = cookies().get("SESSION");

  if (!session) {
    return redirect("/login");
  }

  const userData = await RedisClient.get(session.value);

  if (!userData) {
    return redirect("/login");
  }

  console.log(JSON.parse(userData));

  return <div>123</div>;
}
