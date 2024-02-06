import { NextResponse } from "next/server";

import { BadRequest, NotFound } from "@/lib/backend";
import Prisma from "@/lib/prisma";
import { IdSchema } from "@/lib/types";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const id = params.id;

  try {
    IdSchema.parse(Number(id));
  } catch (e) {
    return BadRequest();
  }

  const post = await Prisma.post.findUnique({
    select: {
      title: true,
      description: true,
      timestamp: true,
      tag: true,
      md_file_url: true,
      cover_url: true,
    },
    where: {
      id: Number(id),
    },
  });

  if (!post) {
    return NotFound();
  }

  return NextResponse.json({
    data: post,
  });
}
