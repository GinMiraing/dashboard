import { MD5 } from "crypto-js";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import Prisma from "@/lib/prisma";
import RedisClient from "@/lib/redis";
import { CommentSchemaType } from "@/lib/types";

const CommentSchema = z.object({
  nick: z.string().min(1),
  email: z.string().email(),
  email_md5: z.string().length(32),
  link: z.union([z.string().length(0), z.string().url()]),
  content: z.string().min(1),
  is_admin: z.boolean(),
  is_hidden: z.boolean(),
  timestamp: z.number(),
  reply_count: z.number().min(0),
  path: z.string().min(1),
  parent_id: z.number().min(0),
  reply_id: z.number().min(0),
  reply_nick: z.union([z.string().length(0), z.string().min(1)]),
});

export async function POST(request: Request) {
  const uniqueKey = request.headers.get("api-key");

  if (!uniqueKey) {
    return NextResponse.json({ message: "forbidden" }, { status: 403 });
  }

  const exist = await RedisClient.get(uniqueKey);

  if (!exist) {
    return NextResponse.json({ message: "forbidden" }, { status: 403 });
  }

  const data: Omit<
    CommentSchemaType,
    "email_md5" | "is_admin" | "is_hidden" | "timestamp" | "reply_count"
  > = await request.json();

  const calculatedAttributes = {
    email_md5: data.email ? MD5(data.email).toString() : "",
    is_admin: data.link === "https://blog.zengjunyin.com" ? 1 : 0,
    is_hidden: 0,
    timestamp: dayjs().unix(),
    reply_count: 0,
  };

  try {
    CommentSchema.parse({
      ...data,
      ...calculatedAttributes,
    });
  } catch (e) {
    return NextResponse.json({ message: "bad request" }, { status: 400 });
  }

  const result = await Prisma.comment.create({
    data: {
      ...data,
      ...calculatedAttributes,
    },
  });

  return NextResponse.json({
    data: result,
  });
}

export async function PUT(request: Request) {
  return NextResponse.json(
    {
      message: "error",
    },
    { status: 500 },
  );
}
