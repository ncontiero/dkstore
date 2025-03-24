import { passwordSchema } from "@dkstore/utils/password";
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

export const generateRecoveryCodesSchema = z.object({
  userId: z.string().uuid(),
});
export type GenerateRecoveryCodesSchema = z.infer<
  typeof generateRecoveryCodesSchema
>;

export const addOrEdit2FASchema = z.object({
  code: z.string().min(6, "Your one-time password must be 6 characters."),
  secret: z.string().min(1, "Secret is required"),
});
export type AddOrEdit2FASchema = z.infer<typeof addOrEdit2FASchema>;

export const verify2FASchema = z.object({
  otpCode: z.string().min(6, "Your one-time password must be 6 characters."),
});
export type Verify2FASchema = z.infer<typeof verify2FASchema>;
