import { NextResponse } from "next/server";

import { BadRequest, NotFound } from "@/lib/backend";
import Prisma from "@/lib/prisma";
import { IdSchema } from "@/lib/types";

export const revalidate = 0;

export async function GET(
  req: Request,
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
      id: true,
      title: true,
      description: true,
      cover_url: true,
      md_file_url: true,
      tag: true,
      create_at: true,
      favor: {
        select: {
          user_id: true,
        },
      },
    },
    where: {
      id: Number(id),
    },
  });

  if (!post) {
    return NotFound();
  }

  const comments = await Prisma.comment.findMany({
    select: {
      id: true,
      post_id: true,
      user_name: true,
      user_email_md5: true,
      user_site_url: true,
      content: true,
      create_at: true,
      reply: {
        select: {
          reply_id: true,
          reply_name: true,
          user_name: true,
          user_email_md5: true,
          user_site_url: true,
          content: true,
          create_at: true,
          favor: {
            select: {
              user_id: true,
            },
          },
        },
        where: {
          published: true,
        },
        orderBy: [
          {
            create_at: "asc",
          },
        ],
      },
      favor: {
        select: {
          user_id: true,
        },
      },
    },
    where: {
      post_id: post.id,
      published: true,
    },
    orderBy: [
      {
        create_at: "desc",
      },
    ],
  });

  return NextResponse.json({
    data: {
      ...post,
      favor: post.favor.map((item) => item.user_id),
      comments: comments.map((comment) => {
        return {
          ...comment,
          favor: comment.favor.map((item) => item.user_id),
          reply: comment.reply.map((reply) => {
            return {
              ...reply,
              favor: reply.favor.map((item) => item.user_id),
            };
          }),
        };
      }),
    },
  });
}
