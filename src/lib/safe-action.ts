import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { getUser } from "./auth/user";

export const actionClient = createSafeActionClient({
  handleServerError(error) {
    if (error instanceof Error) {
      return error.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const user = await getUser({ includePass: true });

  if (!user) {
    throw new Error("You must be logged in to perform this action");
  }

  return next({ ctx: { user } });
});
