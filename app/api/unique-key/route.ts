import { SHA256 } from "crypto-js";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

import RedisClient from "@/lib/redis";

export async function GET(request: Request) {
  try {
    const timestamp = dayjs().unix();
    const nonce = Math.floor(Math.random() * 10000);
    const key = SHA256(`${timestamp}${nonce}`).toString();

    await RedisClient.set(key, 1, "EX", 10, "NX");

    return NextResponse.json({ data: key });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "generate unique key failed" },
      {
        status: 500,
      },
    );
  }
}
