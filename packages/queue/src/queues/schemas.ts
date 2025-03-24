import { z } from "zod";

export const sendEmailSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  isWelcomeEmail: z.boolean().default(false).optional(),
  isEmailVerification: z.boolean().default(false).optional(),
  isEmailChangeEmail: z.boolean().default(false).optional(),
  isEmailChangedEmail: z.object({ newEmail: z.string().email() }).optional(),
  isPasswordChangeEmail: z.boolean().default(false).optional(),
  isPasswordResetEmail: z.boolean().default(false).optional(),
  is2FAEmail: z.object({ action: z.enum(["added", "edited"]) }).optional(),
  isRecoveryCodesGeneratedEmail: z.boolean().default(false).optional(),
  isDeleteAccountEmail: z.boolean().default(false).optional(),
});
export type SendEmailSchema = z.infer<typeof sendEmailSchema>;
