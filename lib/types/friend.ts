import { z } from "zod";

export const FriendUpdateSchema = z.object({
  name: z.string().min(1),
  link: z.string().url(),
  avatar: z.union([z.string().length(0), z.string().url()]),
  description: z.string().min(1),
  category: z.string().min(1),
  is_hidden: z.union([z.literal(1), z.literal(0)]),
  sorting: z.number().int().min(0),
});

export const FriendCreateSchema = FriendUpdateSchema.omit({
  is_hidden: true,
});

export type FriendUpdateSchemaType = z.infer<typeof FriendUpdateSchema>;

export type FriendCreateSchemaType = z.infer<typeof FriendCreateSchema>;

export type FriendPrismaType = {
  id: number;
  name: string;
  link: string;
  avatar: string;
  description: string;
  category: string;
  is_hidden: number;
  sorting: number;
};
