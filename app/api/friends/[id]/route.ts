import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { BadRequest, Forbidden, checkAdminToken } from "@/lib/backend";
import Prisma from "@/lib/prisma";
import {
  FriendUpdateSchema,
  FriendUpdateSchemaType,
  IdSchema,
} from "@/lib/types";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = cookies().get("SESSION");

  if (!session) {
    return Forbidden();
  }

  try {
    await checkAdminToken(session.value);
  } catch (e) {
    return Forbidden();
  }

  const id = params.id;

  try {
    IdSchema.parse(Number(id));
  } catch (e) {
    return BadRequest();
  }

  const data: FriendUpdateSchemaType = await request.json();

  try {
    FriendUpdateSchema.parse(data);
  } catch (e) {
    return BadRequest();
  }

  const result = await Prisma.friend.update({
    where: {
      id: Number(id),
    },
    data,
  });

  return NextResponse.json({
    data: result,
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = cookies().get("SESSION");

  if (!session) {
    return Forbidden();
  }

  try {
    await checkAdminToken(session.value);
  } catch (e) {
    return Forbidden();
  }

  const id = params.id;

  try {
    IdSchema.parse(Number(id));
  } catch (e) {
    return BadRequest();
  }

  const result = await Prisma.friend.delete({
    where: {
      id: Number(id),
    },
  });

  return NextResponse.json({ data: result });
}
