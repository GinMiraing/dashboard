"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CommentSchemaType } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

import columns from "../columns";

const FormSchema = z.object({
  nick: z.string().min(1),
  email: z.string().email(),
  email_md5: z.string().length(32),
  link: z.union([z.string().length(0), z.string().url()]),
  content: z.string().min(1),
  is_admin: z.union([z.literal(0), z.literal(1)]),
  is_hidden: z.union([z.literal(0), z.literal(1)]),
  timestamp: z.number(),
  reply_count: z.number().min(0),
  path: z.string().min(1),
  parent_id: z.number().min(0),
  reply_id: z.number().min(0),
  reply_nick: z.union([z.string().length(0), z.string().min(1)]),
});

type FormSchemaType = z.infer<typeof FormSchema>;

const DataViewer = ({ data }: { data: CommentSchemaType[] }) => {
  const [open, setOpen] = useState<{
    dialog: boolean;
    alert: boolean;
  }>({
    dialog: false,
    alert: false,
  });

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: FormSchemaType) => {
    console.log(data);
  };

  return (
    <div>
      <DataTable
        data={data}
        columns={columns}
        invisibleColumns={["Avatar"]}
        clickCallback={(data) => {
          setOpen((prev) => ({ ...prev, dialog: true }));
          form.reset({
            ...data,
            is_admin: data.is_admin ? 1 : 0,
            is_hidden: data.is_hidden ? 1 : 0,
          });
        }}
      />
      <Dialog
        open={open.dialog}
        onOpenChange={(open) => setOpen((prev) => ({ ...prev, dialog: open }))}
      >
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Edit Comment</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <ScrollArea className="no-scrollbar h-[60vh] w-full">
                <div className="w-full space-y-4">
                  <FormField
                    control={form.control}
                    name="nick"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Nick</FormLabel>
                        <FormControl>
                          <Input
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.nick?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Email</FormLabel>
                        <FormControl>
                          <Input
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.email?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email_md5"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Email MD5</FormLabel>
                        <FormControl>
                          <Input
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.email_md5?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Link</FormLabel>
                        <FormControl>
                          <Input
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.link?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Content</FormLabel>
                        <FormControl>
                          <Textarea
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.content?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="is_admin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Admin</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            step={1}
                            min={0}
                            max={1}
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.is_admin?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="is_hidden"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Hidden</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            step={1}
                            min={0}
                            max={1}
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.is_hidden?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="timestamp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Timestamp</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            step={1}
                            min={0}
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.timestamp?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reply_count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Reply Count</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            step={1}
                            min={0}
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.reply_count?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="path"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Path</FormLabel>
                        <FormControl>
                          <Input
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.path?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="parent_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Parent ID</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            step={1}
                            min={0}
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.parent_id?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reply_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Reply ID</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            step={1}
                            min={0}
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.reply_id?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reply_nick"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Reply Nick</FormLabel>
                        <FormControl>
                          <Input
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.reply_nick?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              </ScrollArea>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataViewer;
