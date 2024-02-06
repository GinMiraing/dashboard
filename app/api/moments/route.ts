import { NextResponse } from "next/server";

import { BadRequest } from "@/lib/backend";
import Prisma from "@/lib/prisma";
import { PaginationSchema } from "@/lib/types";

import { MomentCreateSchema, MomentCreateType } from "./type";

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

  const moments = await Prisma.moment.findMany({
    select: {
      id: true,
      content: true,
      image_url: true,
      tag: true,
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
        create_at: "desc",
      },
    ],
    take: querys.size,
  });

  const comments = await Prisma.comment.findMany({
    select: {
      id: true,
      moment_id: true,
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
      moment_id: {
        in: moments.map((moment) => moment.id),
      },
      published: true,
    },
    orderBy: [
      {
        create_at: "desc",
      },
    ],
  });

  const total = await Prisma.moment.count({
    where: {
      published: true,
    },
  });

  return NextResponse.json({
    data: {
      moments: moments.map((moment) => {
        return {
          ...moment,
          favor: moment.favor.map((favor) => favor.user_id),
          comments: comments
            .filter((comment) => comment.moment_id === moment.id)
            .map((comment) => {
              return {
                ...comment,
                moment_id: undefined,
                favor: comment.favor.map((favor) => favor.user_id),
                reply: comment.reply.map((reply) => {
                  return {
                    ...reply,
                    favor: reply.favor.map((favor) => favor.user_id),
                  };
                }),
              };
            }),
        };
      }),
      total,
    },
  });
}

export async function POST(req: Request) {
  const data: MomentCreateType = await req.json();

  try {
    MomentCreateSchema.parse(data);
  } catch (e) {
    return BadRequest();
  }

  const moment = await Prisma.moment.create({
    data: {
      ...data,
    },
  });

  return NextResponse.json({
    data: moment,
  });
}
