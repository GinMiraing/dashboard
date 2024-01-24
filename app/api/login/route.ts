import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  cookies().set("SESSION", "123", {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
    priority: "high",
  });

  return NextResponse.json({ message: "ok" });
}
