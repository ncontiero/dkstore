import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@dkstore/db";
import { createJWT, verifyJWT } from "@dkstore/utils/jwt";
import { logger } from "@dkstore/utils/logger";
import { getSession, redirectUrl } from "./utils";

export function authRoutes(app: FastifyInstance) {
  app.get(
    "/auth/sign-in",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            token: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      const sessionCookie = getSession(req.headers.cookie);

      const token = (req.query as any).token;
      logger.info(token);

      if (!sessionCookie && !token) {
        return reply.redirect(redirectUrl);
      }

      let session: { user: { id: string } } | null = null;
      try {
        session = await verifyJWT<{ user: { id: string } }>(
          sessionCookie || token,
        );
      } catch {
        return reply.redirect(redirectUrl);
      }

      if (!session || !session.user?.id) {
        return reply.redirect(redirectUrl);
      }

      const user = await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
      });

      if (!user || !user.isAdmin) {
        return reply.redirect(redirectUrl);
      }

      if (!sessionCookie) {
        const maxAge = 60 * 60 * 24 * 1;
        const newToken = await createJWT({
          user: { id: user.id },
        });

        reply.header(
          "Set-Cookie",
          `session=${newToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}`,
        );
      }

      return reply.redirect("/");
    },
  );
}

export async function authHook(req: FastifyRequest, reply: FastifyReply) {
  if (req.url?.startsWith("/auth/sign-in")) {
    return;
  }

  const sessionCookie = getSession(req.headers.cookie);

  if (!sessionCookie) {
    return reply.redirect(redirectUrl);
  }

  let session: { user: { id: string } } | null = null;
  try {
    session = await verifyJWT<{ user: { id: string } }>(sessionCookie);
  } catch {
    return reply.redirect(redirectUrl);
  }

  if (!session || !session.user?.id) {
    return reply.redirect(redirectUrl);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user || !user.isAdmin) {
    return reply.redirect(redirectUrl);
  }
}
