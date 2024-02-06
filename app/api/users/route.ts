import { MD5 } from "crypto-js";
import { NextResponse } from "next/server";

import { BadRequest, NotFound } from "@/lib/backend";
import Prisma from "@/lib/prisma";

import { UserCreateSchema, UserCreateType } from "./type";

export const revalidate = 0;

export async function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams;
  const emailMD5 = searchParams.get("email_md5");

  if (!emailMD5) {
    return BadRequest();
  }

  const user = await Prisma.user.findFirst({
    select: {
      id: true,
      name: true,
      email_md5: true,
      site_url: true,
    },
    where: {
      email_md5: emailMD5,
    },
  });

  if (!user) {
    return NotFound();
  }

  return NextResponse.json({
    data: user,
  });
}

export async function POST(req: Request) {
  const data: UserCreateType = await req.json();

  try {
    UserCreateSchema.parse(data);
  } catch (e) {
    return BadRequest();
  }

  const emailMD5 = MD5(data.email).toString();

  const user = await Prisma.user.create({
    data: {
      ...data,
      email_md5: emailMD5,
    },
  });

  return NextResponse.json({
    data: user,
  });
}
