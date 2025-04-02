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
  isToSendEmail: z.boolean().default(true),
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

export const revokeSessionSchema = z.object({
  sessionId: z.string().uuid(),
});

export const addOrUpdateAddressSchema = z.object({
  id: z.number().optional(),
  country: z.string().min(1, "Country is required"),
  zipCode: z.string().min(1, "Zip Code is required"),
  street: z.string().min(1, "Street is required"),
  number: z.string().min(1, "Number is required"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Neighborhood is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  isDefault: z.boolean().default(false).optional(),
});
export type AddOrUpdateAddressSchema = z.infer<typeof addOrUpdateAddressSchema>;

export const deleteAddressSchema = z.object({
  id: z.number().min(1, "Address ID is required"),
});
export type DeleteAddressSchema = z.infer<typeof deleteAddressSchema>;
