import { z } from "zod";

export const enableOrDisableUserAdminSchema = z.object({
  userId: z.string().uuid(),
});

export const addOrUpdateProductAdminSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().max(255).optional().or(z.null()),
  price: z.coerce.number().min(0),
  stock: z.coerce.number().min(0),
  isActive: z.boolean().default(true).optional(),
  deletedAt: z.date().optional().or(z.null()),
});
export type AddOrUpdateProductAdminSchema = z.infer<
  typeof addOrUpdateProductAdminSchema
>;

export const deleteProductAdminSchema = z.object({
  id: z.string().uuid(),
});
