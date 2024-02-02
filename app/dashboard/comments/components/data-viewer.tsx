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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

      return <div className="line-clamp-2 text-sm">{sliceContent}</div>;
    },
  },
];

const defaultInvisibleColumns: VisibilityState = columns
  .map((column) => column.id as string)
  .reduce((acc, id) => {
    return {
      ...acc,
      [id]: true,
    };
  }, {});

const DataViewer = ({ data }: { data: CommentPrismaType[] }) => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [comment, setComment] = useState<CommentPrismaType | undefined>();
  const [invisibleColumns, setInvisibleColumns] = useState<VisibilityState>(
    defaultInvisibleColumns,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end space-x-4">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              className="w-32"
              variant="outline"
            >
              Custom Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {columns.map((column) => {
              const id = column.id as string;
              return (
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
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={() => setCreateDialogOpen((prev) => !prev)}>
          New Comment
        </Button>
      </div>
      <DataTable
        data={data}
        columns={columns}
        invisibleColumns={invisibleColumns}
        clickCallback={(data) => {
          setComment(data);
          setUpdateDialogOpen((prev) => !prev);
        }}
      />
      <UpdateForm
        open={updateDialogOpen}
        data={comment}
        openChangeCallback={setUpdateDialogOpen}
      />
      <CreateForm
        open={createDialogOpen}
        openChangeCallback={setCreateDialogOpen}
      />
    </div>
  );
};

export default DataViewer;
