import { NextResponse } from "next/server";

import { BadRequest } from "@/lib/backend";
import Prisma from "@/lib/prisma";

import { CommentCreateSchema, CommentCreateType } from "./type";

export const revalidate = 0;

export async function POST(req: Request) {
  const data: CommentCreateType = await req.json();

  try {
    CommentCreateSchema.parse(data);
  } catch (e) {
    return BadRequest();
  }

  const result = await Prisma.comment.create({
    data: {
      post_id: data.is_post ? data.id : null,
      moment_id: !data.is_post ? data.id : null,
      user_name: data.user_name,
      user_email_md5: data.user_email_md5,
      user_site_url: data.user_site_url,
      content: data.content,
    },
  });

  return NextResponse.json({
    data: result,
  });
}
