import { ZodError } from "zod";
import { logger } from "@/utils/logger";

export class BadRequestError extends Error {
  constructor(message?: string) {
    super(message ?? "Bad request.");
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message ?? "Unauthorized.");
    this.name = "UnauthorizedError";
  }
}

export function errorHandler(error: unknown) {
  if (error instanceof ZodError) {
    return {
      status: 400,
      message: "Validation error",
      errors: error.flatten().fieldErrors,
    };
  }

  if (error instanceof BadRequestError) {
    return {
      status: 400,
      message: error.message,
    };
  }

  if (error instanceof UnauthorizedError) {
    return {
      status: 401,
      message: error.message,
    };
  }

  logger.error(error);

  return {
    status: 500,
    message: "Internal server error",
  };
}
