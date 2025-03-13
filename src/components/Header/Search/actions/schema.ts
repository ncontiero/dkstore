import { z } from "zod";

export type SearchSchema = z.infer<typeof searchSchema>;

export const searchSchema = z.object({
  search: z.string().min(1),
});
