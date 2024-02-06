import { z } from "zod";

export const UserCreateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  site_url: z.union([z.string().length(0), z.string().url()]),
});

export type UserCreateType = z.infer<typeof UserCreateSchema>;
