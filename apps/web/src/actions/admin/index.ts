"use server";

import { prisma } from "@dkstore/db";
import { slugify } from "@dkstore/utils/slugify";
import { adminActionClient } from "@/lib/safe-action";
import {
  addOrUpdateProductAdminSchema,
  deleteProductAdminSchema,
  enableOrDisableUserAdminSchema,
} from "./schema";

export const enableOrDisableUserAdminAction = adminActionClient
  .schema(enableOrDisableUserAdminSchema)
  .action(async ({ clientInput: { userId } }) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new Error("User not found");
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isAdmin: !user.isAdmin },
    });
  });

export const addOrUpdateProductAdminAction = adminActionClient
  .schema(addOrUpdateProductAdminSchema)
  .action(async ({ clientInput }) => {
    const slug = slugify(clientInput.name, {
      lower: true,
      strict: true,
    }).concat(`-${Math.random().toString(36).slice(2, 7)}`);

    await prisma.product.upsert({
      where: { id: clientInput.id ?? "" },
      create: { ...clientInput, slug },
      update: { ...clientInput, slug, updatedAt: new Date() },
    });
  });

export const deleteProductAdminAction = adminActionClient
  .schema(deleteProductAdminSchema)
  .action(async ({ clientInput: { id } }) => {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { orderProducts: true },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.orderProducts.length === 0) {
      await prisma.product.delete({ where: { id } });
      return;
    }

    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  });
