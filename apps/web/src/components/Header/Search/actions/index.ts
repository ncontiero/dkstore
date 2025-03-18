"use server";

import { redirect } from "next/navigation";
import { actionClient } from "@/lib/safe-action";
import { searchSchema } from "./schema";

export const searchAction = actionClient
  .schema(searchSchema)
  // eslint-disable-next-line require-await
  .action(async ({ parsedInput: { search } }) => {
    redirect(`/search?q=${search}`);
  });
