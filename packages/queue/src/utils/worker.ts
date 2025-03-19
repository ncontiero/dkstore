import { type Processor, type WorkerOptions, Worker } from "@/bullmq";
import { createWorkerOpts } from "@/configs";

export const createWorker = <T>(
  name: string,
  processor: Processor<T>,
  opts?: WorkerOptions,
) => new Worker<T>(name, processor, createWorkerOpts(opts));
