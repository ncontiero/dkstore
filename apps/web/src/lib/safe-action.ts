import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { getSession } from "./auth/db";

export const actionClient = createSafeActionClient({
  handleServerError(error) {
    if (error instanceof Error) {
      return error.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await getSession({ includeUserPass: true });

  if (!session) {
    throw new Error("You must be logged in to perform this action");
  }
  if (session.expires < new Date()) {
    throw new Error("Your session has expired");
  }

  return next({ ctx: { session } });
});

export const adminActionClient = authActionClient.use(
  ({ next, ctx: { session } }) => {
    if (!session.user.isAdmin) {
      throw new Error("You must be an admin to perform this action");
    }

    return next({ ctx: { session } });
  },
);
