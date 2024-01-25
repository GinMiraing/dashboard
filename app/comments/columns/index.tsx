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

export default columns;
