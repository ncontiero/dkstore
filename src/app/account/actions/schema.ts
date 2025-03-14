import { z } from "zod";
import { passwordSchema } from "@/utils/password";

export const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email("Invalid email address"),
});
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

export const updateUserPasswordSchema = z.object({
  currentPassword: z.string().min(1, "Please enter your current password"),
  newPassword: passwordSchema,
});
export type UpdateUserPasswordSchema = z.infer<typeof updateUserPasswordSchema>;
