import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@dkstore/db";
import { createJWT, verifyJWT } from "@dkstore/utils/jwt";
import { getSession, redirectUrl } from "./utils";

type SessionProps = {
  id: string;
};

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

      if (!sessionCookie && !token) {
        return reply.redirect(redirectUrl);
      }

      let session: SessionProps | null = null;
      try {
        session = await verifyJWT<SessionProps>(sessionCookie || token);
      } catch {
        return reply.redirect(redirectUrl);
      }

      if (!session || !session.id) {
        return reply.redirect(redirectUrl);
      }

      const dbSession = await prisma.session.findUnique({
        where: { id: session.id },
        include: { user: true },
      });

      if (!dbSession || dbSession.expires < new Date()) {
        return reply.redirect(redirectUrl);
      }
      if (!dbSession.user.isAdmin) {
        const isNotAdminUrl = new URL(redirectUrl);
        isNotAdminUrl.searchParams.set("isNotAdmin", "true");
        return reply.redirect(isNotAdminUrl.toString());
      }

      if (!sessionCookie) {
        const maxAge = 60 * 60 * 24 * 1;
        const newToken = await createJWT<SessionProps>({
          id: dbSession.id,
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

  let session: SessionProps | null = null;
  try {
    session = await verifyJWT<SessionProps>(sessionCookie);
  } catch {
    return reply.redirect(redirectUrl);
  }

  if (!session || !session.id) {
    return reply.redirect(redirectUrl);
  }

  const dbSession = await prisma.session.findUnique({
    where: { id: session.id },
    include: { user: true },
  });

  if (!dbSession || dbSession.expires < new Date()) {
    return reply.redirect(redirectUrl);
  }
  if (!dbSession.user.isAdmin) {
    const isNotAdminUrl = new URL(redirectUrl);
    isNotAdminUrl.searchParams.set("isNotAdmin", "true");
    return reply.redirect(isNotAdminUrl.toString());
  }
}
