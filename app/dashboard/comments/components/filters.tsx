import { zodResolver } from "@hookform/resolvers/zod";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useCreateQueryString } from "@/lib/hooks";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  nick: z.string().min(1),
});

type FormSchemaType = z.infer<typeof FormSchema>;

const Filters: React.FC = () => {
  const router = useRouter();
  const { createQueryString } = useCreateQueryString();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nick: "",
    },
    mode: "onSubmit",
  });

  const getDefaultNick = useCallback(() => {
    return searchParams.get("nick") || "";
  }, [searchParams]);

  const onSubmit = (value: FormSchemaType) => {
    const url = createQueryString([
      {
        name: "nick",
        value: value.nick,
      },
      {
        name: "page",
        value: "1",
      },
    ]);

    router.push(url, {
      scroll: false,
    });
  };

  useEffect(() => {
    form.setValue("nick", getDefaultNick());
  }, [searchParams]);

  return (
    <div className="relative flex w-60 items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (e) => {
            toast({
              variant: "destructive",
              title: "Search Failed",
              description: e.nick?.message,
              duration: 1000,
            });
          })}
        >
          <FormField
            control={form.control}
            name="nick"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    className="w-60 pr-16"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {form.watch("nick") && (
            <Button
              onClick={() => form.setValue("nick", "")}
              className="absolute right-10 top-0 flex h-10 w-7 items-center justify-center bg-transparent p-0 text-black hover:cursor-pointer hover:bg-transparent"
              type="button"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center rounded-r-md border bg-slate-100 p-0 text-black hover:cursor-pointer hover:bg-slate-200"
            type="submit"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Filters;
