import { NextResponse } from "next/server";

import { BadRequest } from "@/lib/backend";
import Prisma from "@/lib/prisma";
import { PaginationSchema } from "@/lib/types";

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
