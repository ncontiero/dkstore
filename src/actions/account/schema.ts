import { z } from "zod";
import { emailSchema, nameSchema } from "../schema";

export const updateUserNameSchema = z.object({
  name: nameSchema,
});
export type UpdateUserNameSchema = z.infer<typeof updateUserNameSchema>;

export const updateUserEmailSchema = z.object({
  email: emailSchema,
});
export type UpdateUserEmailSchema = z.infer<typeof updateUserEmailSchema>;

export const deleteUserSchema = z.object({
  confirmEmail: emailSchema,
  confirmPassword: z.string().min(1, "Password is required"),
});
export type DeleteUserSchema = z.infer<typeof deleteUserSchema>;
