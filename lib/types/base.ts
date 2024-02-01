import { z } from "zod";

export enum Role {
  ADMIN = 1,
}

export const IdSchema = z.number().int().min(0);

export const PaginationSchema = z.object({
  page: z.number().int().min(1),
  size: z.number().int().min(1),
});
