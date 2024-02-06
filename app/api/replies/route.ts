import { NextResponse } from "next/server";

import { BadRequest } from "@/lib/backend";
import Prisma from "@/lib/prisma";

import { ReplyCreateSchema, ReplyCreateType } from "./type";

export const revalidate = 0;

export async function POST(req: Request) {
  const data: ReplyCreateType = await req.json();

  try {
    ReplyCreateSchema.parse(data);
  } catch (e) {
    return BadRequest();
  }

  const result = await Prisma.reply.create({
    data: {
      ...data,
    },
  });

  return NextResponse.json({ data: result });
}
