"use server";

import { prisma } from "@dkstore/db";
import { adminActionClient } from "@/lib/safe-action";
import { enableOrDisableUserAdminSchema } from "./schema";

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
