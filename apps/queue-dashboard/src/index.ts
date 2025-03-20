import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter.js";
import { FastifyAdapter } from "@bull-board/fastify";
import { sendEmailQueue } from "@dkstore/queue/email";
import Fastify from "fastify";
import { env } from "./env";

const fastify = Fastify({ logger: true });

const serverAdapter = new FastifyAdapter();

createBullBoard({
  queues: [new BullMQAdapter(sendEmailQueue)],
  serverAdapter,
});

serverAdapter.setBasePath("/");
fastify.register(serverAdapter.registerPlugin(), {
  prefix: "/",
  basePath: "/",
});

const start = async () => {
  try {
    await fastify.listen({ port: env.PORT, host: "0.0.0.0" });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
