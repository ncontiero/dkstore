import { z } from "zod";
import { passwordSchema } from "@/utils/password";

export const signOutSchema = z.object({
  redirectTo: z
    .string()
    .transform((value) => (!value.startsWith("/") ? undefined : value))
    .optional(),
});

export const signInSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  })
  .extend(signOutSchema.shape);

export const signUpSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    password: passwordSchema,
  })
  .merge(signInSchema.omit({ password: true }));

export type SignInSchema = z.infer<typeof signInSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;
