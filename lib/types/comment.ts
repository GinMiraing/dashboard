import { z } from "zod";

import { PaginationSchema } from ".";

export const CommentQuerySchema = PaginationSchema.extend({
  path: z.string().optional(),
});

export const CommentUpdateSchema = z.object({
  nick: z.string().min(1),
  email: z.string().email(),
  email_md5: z.string().length(32),
  link: z.union([z.string().length(0), z.string().url()]),
  content: z.string().min(1),
  is_admin: z.union([z.literal(1), z.literal(0)]),
  is_hidden: z.union([z.literal(1), z.literal(0)]),
  timestamp: z.number(),
  reply_count: z.number().min(0),
  path: z.string().min(1),
  parent_id: z.number().min(0),
  reply_id: z.number().min(0),
  reply_nick: z.union([z.string().length(0), z.string().min(1)]),
});

export const CommentCreateSchema = CommentUpdateSchema.pick({
  nick: true,
  email: true,
  link: true,
  content: true,
  path: true,
  parent_id: true,
  reply_id: true,
  reply_nick: true,
});

export type CommentUpdateSchemaType = z.infer<typeof CommentUpdateSchema>;

export type CommentCreateSchemaType = z.infer<typeof CommentCreateSchema>;

export type CommentPrismaType = {
  id: number;
  nick: string;
  email: string;
  email_md5: string;
  link: string;
  content: string;
  is_admin: number;
  is_hidden: number;
  timestamp: number;
  reply_count: number;
  path: string;
  parent_id: number;
  reply_id: number;
  reply_nick: string;
};
