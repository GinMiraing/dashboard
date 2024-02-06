import { NextResponse } from "next/server";

import { BadRequest } from "@/lib/backend";
import Prisma from "@/lib/prisma";
import { PaginationSchema } from "@/lib/types";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  const querys = {
    page: 1,
    size: Number(params.get("size")) || 1000,
  };

  try {
    PaginationSchema.parse(querys);
  } catch (e) {
    return BadRequest("invalid query");
  }

  const posts = await Prisma.post.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      timestamp: true,
      tag: true,
      md_file_url: true,
      cover_url: true,
    },
    where: {
      is_hidden: 0,
    },
    take: querys.size,
    orderBy: [
      {
        id: "desc",
      },
    ],
  });

  const total = await Prisma.post.count({
    where: {
      is_hidden: 0,
    },
  });

  return NextResponse.json({
    data: {
      posts,
      total,
    },
  });
}
