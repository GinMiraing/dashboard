import { NextResponse } from "next/server";

import { BadRequest } from "@/lib/backend";
import Prisma from "@/lib/prisma";
import { PaginationSchema } from "@/lib/types";

export const revalidate = 0;

export async function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams;

  const querys = {
    page: 1,
    size: Number(searchParams.get("size")) || 10,
  };

  try {
    PaginationSchema.parse(querys);
  } catch (e) {
    return BadRequest();
  }

  const posts = await Prisma.post.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      cover_url: true,
      tag: true,
      create_at: true,
      _count: {
        select: {
          favor: true,
        },
      },
    },
    where: {
      published: true,
    },
    orderBy: [
      {
        create_at: "desc",
      },
    ],
    take: querys.size,
  });

  const total = await Prisma.post.count({
    where: {
      published: true,
    },
  });

  return NextResponse.json({
    data: {
      posts,
      total,
    },
  });
}
