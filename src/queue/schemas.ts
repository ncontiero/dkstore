import { z } from "zod";

export const sendEmailSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  isWelcomeEmail: z.boolean().default(false).optional(),
  isEmailVerification: z.boolean().default(false).optional(),
});
export type SendEmailSchema = z.infer<typeof sendEmailSchema>;
