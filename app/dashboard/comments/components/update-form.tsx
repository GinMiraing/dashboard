"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { deleteComment, updateComment } from "@/lib/axios";
import {
  CommentPrismaType,
  CommentUpdateSchema,
  CommentUpdateSchemaType,
} from "@/lib/types";
import { formatError } from "@/lib/utils";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useToast } from "@/components/ui/use-toast";

const UpdateForm: React.FC<{
  open: boolean;
  openChangeCallback: (open: boolean) => void;
  data?: CommentPrismaType;
}> = ({ data, open, openChangeCallback }) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<CommentUpdateSchemaType>({
    resolver: zodResolver(CommentUpdateSchema),
    mode: "onSubmit",
  });

  const [loading, setLoading] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);

  const commentId = useRef(1);

  const onSubmit = async (data: CommentUpdateSchemaType) => {
    try {
      setLoading(true);
      const res = await updateComment(commentId.current, data);
      openChangeCallback(false);
      router.refresh();
      toast({
        title: "Update comment success",
        description: `Comment updated successfully. ID: ${res.id}`,
        duration: 1000,
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Update comment failed",
        description: formatError(e),
        duration: 1000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      const res = await deleteComment(id);
      setAlertDialogOpen(false);
      openChangeCallback(false);
      router.refresh();
      toast({
        title: "Delete comment success",
        description: `Comment deleted successfully. ID: ${res.id}`,
        duration: 1000,
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Delete comment failed",
        description: formatError(e),
        duration: 1000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      form.reset({
        ...data,
        is_admin: data.is_admin ? 1 : 0,
        is_hidden: data.is_hidden ? 1 : 0,
      });
      commentId.current = data.id;
    }
  }, [data]);

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={openChangeCallback}
      >
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Edit Comment</DialogTitle>
            <DialogDescription>
              Make changes to comment here. Click save when you're done.
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
              <DialogFooter className="mt-6 space-x-4">
                <Button
                  disabled={loading}
                  type="submit"
                >
                  Save
                </Button>
                <Button
                  type="button"
                  disabled={loading}
                  variant="destructive"
                  onClick={() => setAlertDialogOpen(true)}
                >
                  Delete
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={alertDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You will delete comment by id {commentId.current}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={loading}
              onClick={() => setAlertDialogOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={loading}
              onClick={() => handleDelete(commentId.current)}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UpdateForm;
