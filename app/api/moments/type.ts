import { z } from "zod";

export const MomentCreateSchema = z.object({
  content: z.string().min(1),
  image_url: z.union([z.string().length(0), z.string().min(1)]),
});

export type MomentCreateType = z.infer<typeof MomentCreateSchema>;
