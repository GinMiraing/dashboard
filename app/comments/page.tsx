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

  const comments = await Prisma.comment.findMany({
    take: limit,
    skip: offset,
  });

  const totalComments = await Prisma.comment.count();
  const totalPage = Math.ceil(totalComments / limit);

  return (
    <div className="mx-auto flex w-full max-w-screen-xl flex-col space-y-4 py-10">
      <DataViewer data={comments} />
      <Pagination
        currentPage={currentPage}
        totalPage={totalPage}
      />
    </div>
  );
}
