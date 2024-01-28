import { MD5 } from "crypto-js";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

import { BadRequest, CheckApiKey, Forbidden } from "@/lib/backend";
import Prisma from "@/lib/prisma";
import { CommentCreateSchema, CommentCreateSchemaType } from "@/lib/types";

export async function POST(request: Request) {
  try {
    await CheckApiKey(request);
  } catch (e) {
    return Forbidden();
  }

  const data: CommentCreateSchemaType = await request.json();

  try {
    CommentCreateSchema.parse(data);
  } catch (e) {
    return BadRequest();
  }

  const calculatedAttributes = {
    email_md5: data.email ? MD5(data.email).toString() : "",
    is_admin: data.link === "https://blog.zengjunyin.com" ? 1 : 0,
    is_hidden: 0,
    timestamp: dayjs().unix(),
    reply_count: 0,
  };

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
