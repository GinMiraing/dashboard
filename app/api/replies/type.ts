import { z } from "zod";

export const ReplyCreateSchema = z.object({
  comment_id: z.number().int().min(1),
  reply_id: z.number().int().min(1),
  reply_name: z.string().min(1),
  user_name: z.string().min(1),
  user_email_md5: z.string().length(32),
  user_site_url: z.union([z.string().length(0), z.string().url()]),
  content: z.string().min(1),
});

export type ReplyCreateType = z.infer<typeof ReplyCreateSchema>;
