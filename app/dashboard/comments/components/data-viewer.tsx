"use client";

import { ColumnDef, VisibilityState } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useState } from "react";

import { CommentPrismaType } from "@/lib/types";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import CreateForm from "./create-form";
import UpdateForm from "./update-form";

const columns: ColumnDef<CommentPrismaType>[] = [
  {
    id: "Id",
    accessorKey: "id",
    header: "ID",
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return <div className="min-w-8 text-sm">{`# ${value}`}</div>;
    },
  },
  {
    id: "Avatar",
    accessorKey: "email_md5",
    header: "Avatar",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return (
        <Avatar className="h-8 w-8 rounded-full object-cover object-center">
          <AvatarImage src={`https://cravatar.cn/avatar/${value}`} />
          <AvatarFallback>{value.slice(0, 1)}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    id: "Nick",
    accessorKey: "nick",
    header: "Nick",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return <div className="min-w-16 text-sm">{value}</div>;
    },
  },
  {
    id: "Created At",
    accessorKey: "timestamp",
    header: "Created At",
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return (
        <div className="text-nowrap text-sm">
          {dayjs.unix(value).format("YYYY-MM-DD HH:mm")}
        </div>
      );
    },
  },
  {
    id: "Email",
    accessorKey: "email",
    header: "Email",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return <div className="text-sm">{value}</div>;
    },
  },
  {
    id: "Role",
    accessorKey: "is_admin",
    header: "Role",
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return <Badge>{value ? "Admin" : "User"}</Badge>;
    },
  },
  {
    id: "Path",
    accessorKey: "path",
    header: "Path",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return <div className="text-sm">{value}</div>;
    },
  },
  {
    id: "Content",
    accessorKey: "content",
    header: "Content",
    cell: ({ getValue }) => {
      const value = getValue() as string;

      const sliceContent =
        value.length > 30 ? `${value.slice(0, 30)}...` : value;

      return (
        <Popover modal>
          <PopoverTrigger asChild>
            <div className="line-clamp-2 text-sm">{sliceContent}</div>
          </PopoverTrigger>
          <PopoverContent
            sideOffset={8}
            asChild
          >
            <div className="text-justify text-sm/7">{value}</div>
          </PopoverContent>
        </Popover>
      );
    },
  },
];

const cellId = columns.map((column) => column.id as string);

const DataViewer = ({ data }: { data: CommentPrismaType[] }) => {
  const [open, setOpen] = useState<{
    createDialog: boolean;
    updateDialog: boolean;
  }>({
    createDialog: false,
    updateDialog: false,
  });

  const [comment, setComment] = useState<CommentPrismaType | undefined>();

  const [invisibleColumns, setInvisibleColumns] = useState<VisibilityState>(
    () => {
      return cellId.reduce<VisibilityState>((acc, id) => {
        return {
          ...acc,
          [id]: true,
        };
      }, {});
    },
  );

  return (
    <div>
      <div className="flex items-center justify-between space-x-4">
        <Button
          onClick={() => setOpen((prev) => ({ ...prev, createDialog: true }))}
        >
          Create New Comment
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-32">Columns</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {cellId.map((id) => (
              <DropdownMenuCheckboxItem
                key={id}
                checked={invisibleColumns[id]}
                onCheckedChange={() =>
                  setInvisibleColumns((prev) => ({
                    ...prev,
                    [id]: !prev[id],
                  }))
                }
              >
                {id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DataTable
        data={data}
        columns={columns}
        invisibleColumns={invisibleColumns}
        clickCallback={(data) => {
          setComment(data);
          setOpen((prev) => ({ ...prev, updateDialog: true }));
        }}
      />
      <UpdateForm
        open={open.updateDialog}
        data={comment}
        openChangeCallback={(open) =>
          setOpen((prev) => ({ ...prev, updateDialog: open }))
        }
      />
      <CreateForm
        open={open.createDialog}
        openChangeCallback={(open) =>
          setOpen((prev) => ({ ...prev, createDialog: open }))
        }
      />
    </div>
  );
};

export default DataViewer;
