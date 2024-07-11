export const routes = {
  POST: {
    signUp: "/auth/sign-up",
    signIn: "/auth/sign-in",
  },
  GET: {
    signOut: "/auth/sign-out",
    profile: "/profile",
    verifySession: "/auth/session/verify",
  },
  PUT: {},
  PATCH: {},
  DELETE: {},
} as const;

type Routes = typeof routes;
export type Method = keyof Routes;
export type Route<T extends Method> = keyof Routes[T];

export type PostRoutes = keyof Routes["POST"];
export type GetRoutes = keyof Routes["GET"];
export type PutRoutes = keyof Routes["PUT"];
export type PatchRoutes = keyof Routes["PATCH"];
export type DeleteRoutes = keyof Routes["DELETE"];

export const {
  POST: postRoutes,
  GET: getRoutes,
  PUT: putRoutes,
  PATCH: patchRoutes,
  DELETE: deleteRoutes,
} = routes;
