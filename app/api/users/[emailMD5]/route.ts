import { NextResponse } from "next/server";

import { NotFound } from "@/lib/backend";
import Prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { emailMD5: string } },
) {
  const user = await Prisma.user.findFirst({
    select: {
      id: true,
      name: true,
      email_md5: true,
    },
    where: {
      email_md5: params.emailMD5,
      banned: false,
    },
  });

  if (!user) {
    return NotFound();
  }

  return NextResponse.json({
    data: user,
  });
}
