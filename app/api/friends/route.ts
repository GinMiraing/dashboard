import { NextResponse } from "next/server";

import { BadRequest, CheckApiKey, Forbidden } from "@/lib/backend";
import Prisma from "@/lib/prisma";
import {
  FriendCreateSchema,
  FriendCreateSchemaType,
  PaginationSchema,
} from "@/lib/types";

export const revalidate = 0;

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  const querys = {
    page: Number(params.get("page")) || 1,
    size: Number(params.get("size")) || 1000,
  };

  try {
    PaginationSchema.parse(querys);
  } catch (e) {
    return BadRequest();
  }

  const data = await Prisma.friend.findMany({
    select: {
      id: true,
      name: true,
      link: true,
      avatar: true,
      description: true,
      category: true,
    },
    where: {
      is_hidden: 0,
    },
    skip: (querys.page - 1) * querys.size,
    take: querys.size,
    orderBy: [{ sorting: "desc" }, { id: "asc" }],
  });

  return NextResponse.json({
    data,
  });
}

export async function POST(request: Request) {
  try {
    await CheckApiKey(request);
  } catch (e) {
    return Forbidden();
  }

  const data: FriendCreateSchemaType = await request.json();

  try {
    FriendCreateSchema.parse(data);
  } catch (e) {
    return BadRequest();
  }

  const result = await Prisma.friend.create({
    data: {
      ...data,
      is_hidden: 0,
    },
  });

  return NextResponse.json({
    data: result,
  });
}
