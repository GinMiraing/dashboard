"use server";

import Prisma from "@/lib/prisma";

import { DataTable } from "@/components/ui/data-table";
import Pagination from "@/components/ui/pagination";

import columns from "./columns";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const currentPage = Number(searchParams.page) || 1;
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const comments = await Prisma.comment.findMany({
    take: limit,
    skip: offset,
  });

  const totalComments = await Prisma.comment.count();
  const totalPage = Math.ceil(totalComments / limit);

  return (
    <div className="mx-auto flex w-full max-w-screen-xl flex-col space-y-4 py-10">
      <DataTable
        data={comments}
        columns={columns}
        invisibleColumns={["Avatar"]}
      />
      <Pagination
        currentPage={currentPage}
        totalPage={totalPage}
      />
    </div>
  );
}
