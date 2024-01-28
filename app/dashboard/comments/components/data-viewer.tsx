"use client";

import { useState } from "react";

import { CommentPrismaType } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";

import columns from "../columns";
import CreateForm from "./create-form";
import UpdateForm from "./update-form";

const DataViewer = ({ data }: { data: CommentPrismaType[] }) => {
  const [open, setOpen] = useState<{
    createDialog: boolean;
    updateDialog: boolean;
  }>({
    createDialog: false,
    updateDialog: false,
  });

  const [comment, setComment] = useState<CommentPrismaType | undefined>();

  return (
    <div>
      <div>
        <Button
          onClick={() => setOpen((prev) => ({ ...prev, createDialog: true }))}
        >
          Create New Comment
        </Button>
      </div>
      <DataTable
        data={data}
        columns={columns}
        invisibleColumns={["Avatar", "Role"]}
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
