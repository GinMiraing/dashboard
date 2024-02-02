"use server";

import Prisma from "@/lib/prisma";

import Pagination from "@/components/ui/pagination";

import DataViewer from "./components/data-viewer";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const currentPage = Number(searchParams.page) || 1;
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const nickFilter = searchParams.nick as string;

  const comments = await Prisma.comment.findMany({
    where: {
      nick: nickFilter
        ? {
            contains: nickFilter,
          }
        : undefined,
    },
    take: limit,
    skip: offset,
  });

  const totalComments = await Prisma.comment.count({
    where: {
      nick: nickFilter
        ? {
            contains: nickFilter,
          }
        : undefined,
    },
  });
  const totalPage = Math.ceil(totalComments / limit);

  return (
    <div className="mx-auto flex w-full max-w-screen-xl flex-col space-y-4 py-10">
      <div className="mb-8 h-40 w-full rounded-md border bg-slate-100 p-4">
        <div className="flex h-full w-full items-center justify-center font-medium text-2xl">
          Comment
        </div>
      </div>
      <DataViewer data={comments} />
      {totalPage > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPage={totalPage}
        />
      )}
    </div>
  );
}
