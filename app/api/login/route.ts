import { SHA256 } from "crypto-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  BadRequest,
  Forbidden,
  InternalServerError,
  NotFound,
} from "@/lib/backend";
import Prisma from "@/lib/prisma";
import RedisClient from "@/lib/redis";
import { formatError } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const data: {
      email: string;
      password: string;
    } = await request.json();

    if (!data.email || !data.password) {
      return BadRequest("email or password not found");
    }

    const user = await Prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      return NotFound("user not found");
    }

    const encodedPassword = SHA256(data.password).toString();

    if (user.password !== encodedPassword) {
      return Forbidden("password not correct");
    }

    const userData = JSON.stringify({
      username: user.username,
      email: user.email,
      emailMD5: user.email_md5,
      role: user.role,
      avatarUrl: user.avatar_url,
    });

    await RedisClient.set(
      user.email_md5,
      userData,
      "EX",
      60 * 60 * 24 * 30,
      "NX",
    );

    cookies().set("SESSION", user.email_md5, {
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
      priority: "high",
    });

    return NextResponse.json({ data: "login success" });
  } catch (e) {
    return InternalServerError(formatError(e));
  }
}
