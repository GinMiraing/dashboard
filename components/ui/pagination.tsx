"use client";

import { useRouter } from "next/navigation";

import { useCreateQueryString } from "@/lib/hooks";
import { cn } from "@/lib/utils";

import { Button } from "./button";

const Pagination: React.FC<{
  currentPage: number;
  totalPage: number;
}> = ({ currentPage, totalPage }) => {
  const router = useRouter();
  const { createQueryString } = useCreateQueryString();

  const pages = [
    currentPage - 2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2,
  ].filter((item) => item > 1 && item < totalPage);

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        onClick={() =>
          router.push(
            createQueryString([
              {
                name: "page",
                value: "1",
              },
            ]),
          )
        }
        disabled={currentPage === 1}
        className="flex h-9 w-9 items-center justify-center rounded"
      >
        1
      </Button>
      <div
        className={cn("flex h-9 w-9 items-center justify-center", {
          hidden: currentPage < 4,
        })}
      >
        ...
      </div>
      {pages.map((page) => (
        <Button
          key={page}
          onClick={() =>
            router.push(
              createQueryString([
                {
                  name: "page",
                  value: page.toString(),
                },
              ]),
            )
          }
          disabled={currentPage === page}
          className="flex h-9 w-9 items-center justify-center rounded"
        >
          {page}
        </Button>
      ))}
      <div
        className={cn("flex h-9 w-9 items-center justify-center", {
          hidden: currentPage >= totalPage - 2,
        })}
      >
        ...
      </div>
      <Button
        onClick={() =>
          router.push(
            createQueryString([
              {
                name: "page",
                value: totalPage.toString(),
              },
            ]),
          )
        }
        disabled={currentPage === totalPage}
        className={cn("flex h-9 w-9 items-center justify-center rounded", {
          hidden: totalPage === 1,
        })}
      >
        {totalPage}
      </Button>
    </div>
  );
};

export default Pagination;
