import { z } from "zod";

export const enableOrDisableUserAdminSchema = z.object({
  userId: z.string().uuid(),
});
