import { z } from "zod";
import { passwordSchema } from "@/utils/password";
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
