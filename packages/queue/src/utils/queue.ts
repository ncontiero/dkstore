import { type QueueOptions, Queue } from "bullmq";
import { createQueueOpts } from "@/configs";

export const createQueue = <T>(name: string, opts?: QueueOptions) =>
  new Queue<T>(name, createQueueOpts(opts));
