import { logger } from "@dkstore/utils";
import { sendEmailWorker } from "./workers";

const gracefulShutdown = async (signal: string) => {
  logger.warn(`Received ${signal}, closing/reloading workers...`);
  await sendEmailWorker.close();
  process.exit(0);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("uncaughtException", (err) => {
  logger.error(err);
  gracefulShutdown("uncaughtException");
});
process.on("unhandledRejection", (err) => {
  logger.error(err);
  gracefulShutdown("unhandledRejection");
});
