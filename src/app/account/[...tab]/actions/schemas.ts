import { z } from "zod";

export const updateUserNameSchema = z.object({
  name: z.string().min(3).max(32),
});
export type UpdateUserNameSchema = z.infer<typeof updateUserNameSchema>;

export const updateUserEmailSchema = z.object({
  email: z.string().email(),
});
export type UpdateUserEmailSchema = z.infer<typeof updateUserEmailSchema>;

export const deleteUserSchema = z.object({
  confirmEmail: z.string().email(),
  confirmPassword: z.string().min(8),
});
export type DeleteUserSchema = z.infer<typeof deleteUserSchema>;
