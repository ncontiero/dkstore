import { z } from "zod";
import { passwordSchema } from "@/utils/password";
import { emailSchema, nameSchema } from "../schema";

export const updateUserNameSchema = z.object({
  name: nameSchema,
});
export type UpdateUserNameSchema = z.infer<typeof updateUserNameSchema>;

export const updateUserEmailSchema = z.object({
  email: emailSchema,
});
export type UpdateUserEmailSchema = z.infer<typeof updateUserEmailSchema>;

export const updateUserPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmNewPassword: z.string().min(1, "Confirm new password is required"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });
export type UpdateUserPasswordSchema = z.infer<typeof updateUserPasswordSchema>;

export const deleteUserSchema = z.object({
  confirmEmail: emailSchema,
  confirmPassword: z.string().min(1, "Password is required"),
});
export type DeleteUserSchema = z.infer<typeof deleteUserSchema>;
