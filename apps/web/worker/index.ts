import { logger } from "@/utils/logger";
import { sendEmailWorker } from "./email";

const gracefulShutdown = async (signal: string) => {
  logger.warn(`Received ${signal}, closing/reloading workers...`);
  await sendEmailWorker.close();
  process.exit(0);
};

process.on("unhandledRejection", (error) => {
  logger.error(error);
  gracefulShutdown("unhandledRejection");
});
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

logger.info("Starting workers...");
