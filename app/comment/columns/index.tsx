"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

import { CommentSchemaType } from "@/lib/types";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const columns: ColumnDef<CommentSchemaType>[] = [
  {
    id: "Id",
    accessorKey: "id",
    header: "ID",
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return <div className="mr-4 w-8">{`# ${value}`}</div>;
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
      return <div>{value}</div>;
    },
  },
  {
    id: "Created At",
    accessorKey: "timestamp",
    header: "Created At",
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return <div>{dayjs.unix(value).format("YYYY-MM-DD HH:mm")}</div>;
    },
  },
  {
    id: "Email",
    accessorKey: "email",
    header: "Email",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return <div>{value}</div>;
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
          <PopoverTrigger>{sliceContent}</PopoverTrigger>
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
  {
    id: "Role",
    accessorKey: "is_admin",
    header: "Role",
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return <Badge>{value ? "Admin" : "User"}</Badge>;
    },
  },
];

export default columns;
