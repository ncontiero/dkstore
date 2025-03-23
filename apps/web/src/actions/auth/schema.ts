import { passwordSchema } from "@dkstore/utils/password";
import { z } from "zod";
import { emailSchema, nameSchema } from "../schema";

export const signOutSchema = z.object({
  redirectTo: z
    .string()
    .transform((value) => (value.startsWith("/") ? value : undefined))
    .optional(),
});

export const signInSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1, "Password is required"),
    otpCode: z
      .string()
      .min(6, "OTP code must be at least 6 characters long")
      .optional(),
  })
  .extend(signOutSchema.shape);

export const signUpSchema = z
  .object({
    name: nameSchema,
    password: passwordSchema,
  })
  .merge(signInSchema.omit({ password: true }));

export type SignInSchema = z.infer<typeof signInSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    userId: z.string().uuid(),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
