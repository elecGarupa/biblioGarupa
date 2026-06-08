import { PrismaClient } from '@prisma/client';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

const prisma = new PrismaClient();

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  return {
    prisma,
    headers: opts.resHeaders,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
