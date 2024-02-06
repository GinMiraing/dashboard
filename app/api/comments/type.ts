import { z } from "zod";

import { PaginationSchema } from "@/lib/types";

export const CommentQuerySchema = PaginationSchema.extend({
  is_post: z.boolean(),
  id: z.number().int().min(0),
});

export const CommentCreateSchema = z.object({
  is_post: z.boolean(),
  id: z.number().int().min(1),
  user_name: z.string().min(1),
  user_email_md5: z.string().length(32),
  user_site_url: z.union([z.string().length(0), z.string().url()]),
  content: z.string().min(1),
});

export type CommentCreateType = z.infer<typeof CommentCreateSchema>;
