import { z } from "zod";

export const nameSchema = z
  .string()
  .min(3, "Name must be at least 3 characters long")
  .max(32, "Name must be at most 32 characters long");
export const emailSchema = z.string().email("Invalid email address");
