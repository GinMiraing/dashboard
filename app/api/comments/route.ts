import { MD5 } from "crypto-js";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

import { BadRequest, CheckApiKey, Forbidden } from "@/lib/backend";
import Prisma from "@/lib/prisma";
import {
  CommentCreateSchema,
  CommentCreateSchemaType,
  CommentQuerySchema,
} from "@/lib/types";

export const revalidate = 0;

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  const querys = {
    path: params.get("path"),
    page: Number(params.get("page")) || 1,
    size: Number(params.get("size")) || 1000,
  };

  try {
    CommentQuerySchema.parse(querys);
  } catch (e) {
    return BadRequest("invalid query");
  }

  const mainComments = await Prisma.comment.findMany({
    select: {
      id: true,
      nick: true,
      email_md5: true,
      link: true,
      content: true,
      timestamp: true,
      is_admin: true,
      reply_count: true,
    },
    where: {
      path: querys.path || undefined,
      is_hidden: 0,
      parent_id: 0,
    },
    take: querys.size,
    skip: (querys.page - 1) * querys.size,
    orderBy: [
      {
        id: "desc",
      },
    ],
  });

  const ids = mainComments.map(({ id }) => id);

  const subComments = await Prisma.comment.findMany({
    select: {
      id: true,
      nick: true,
      email_md5: true,
      link: true,
      content: true,
      timestamp: true,
      is_admin: true,
      parent_id: true,
      reply_id: true,
      reply_nick: true,
    },
    where: {
      path: querys.path || undefined,
      parent_id: {
        in: ids,
      },
      is_hidden: 0,
    },
    orderBy: {
      id: "asc",
    },
  });

  const data = mainComments.map((mainComment) => ({
    ...mainComment,
    reply: subComments.reduce<
      {
        id: number;
        nick: string;
        email_md5: string;
        link: string;
        content: string;
        is_admin: number;
        reply_id: number;
        reply_nick: string;
        parent_id: undefined;
      }[]
    >((acc, item) => {
      if (item.parent_id === mainComment.id) {
        acc.push({
          ...item,
          parent_id: undefined,
        });
      }
      return acc;
    }, []),
  }));

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

  const data: CommentCreateSchemaType = await request.json();

  try {
    CommentCreateSchema.parse(data);
  } catch (e) {
    return BadRequest();
  }

  const calculatedAttributes = {
    email_md5: data.email ? MD5(data.email).toString() : "",
    is_admin: data.link === "https://blog.zengjunyin.com" ? 1 : 0,
    is_hidden: 0,
    timestamp: dayjs().unix(),
    reply_count: 0,
  };

  const result = await Prisma.comment.create({
    data: {
      ...data,
      ...calculatedAttributes,
    },
  });

  if (data.parent_id) {
    await Prisma.comment.updateMany({
      where: {
        id: {
          in: [data.parent_id, data.reply_id],
        },
      },
      data: {
        reply_count: {
          increment: 1,
        },
      },
    });
  }

  return NextResponse.json({
    data: result,
  });
}
