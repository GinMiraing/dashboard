import { SHA256 } from "crypto-js";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

import { InternalServerError } from "@/lib/backend";
import RedisClient from "@/lib/redis";

export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const timestamp = dayjs().unix();
    const nonce = Math.floor(Math.random() * 10000);
    const key = SHA256(`${timestamp}${nonce}`).toString();

    await RedisClient.set(key, 1, "EX", 10, "NX");

    return NextResponse.json({ data: key });
  } catch (e) {
    console.log(e);
    return InternalServerError("generate unique key failed");
  }
}
