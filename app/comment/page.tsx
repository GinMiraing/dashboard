"use server";

import prisma from "@/lib/prisma";

import { DataTable } from "@/components/ui/data-table";

import columns from "./columns";

export default async function Page() {
  const comments = await prisma.comment.findMany({
    take: 80,
  });

  return (
    <div className="mx-auto flex w-full max-w-screen-xl py-10">
      <DataTable
        data={comments}
        columns={columns}
      />
    </div>
  );
}
