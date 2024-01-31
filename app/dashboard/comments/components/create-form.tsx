"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { createComment } from "@/lib/axios";
import { CommentCreateSchema, CommentCreateSchemaType } from "@/lib/types";
import { formatError } from "@/lib/utils";

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

const CreateForm: React.FC<{
  open: boolean;
  openChangeCallback: (open: boolean) => void;
}> = ({ open, openChangeCallback }) => {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const form = useForm<CommentCreateSchemaType>({
    resolver: zodResolver(CommentCreateSchema),
    defaultValues: {
      nick: "",
      email: "",
      content: "",
      link: "",
      path: "",
      parent_id: 0,
      reply_id: 0,
      reply_nick: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: CommentCreateSchemaType) => {
    try {
      setLoading(true);
      const res = await createComment(data);
      openChangeCallback(false);
      form.reset();
      router.refresh();
      toast({
        title: "Comment created",
        description: `Your comment has been created. ID: ${res.id}`,
        duration: 1000,
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Create comment failed",
        description: formatError(e),
        duration: 1000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        openChangeCallback(value);
        form.reset();
      }}
    >
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Create Comment</DialogTitle>
          <DialogDescription>
            Create a new comment. Click create when you're done.
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
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateForm;
