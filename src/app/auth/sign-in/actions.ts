"use server";

import { z } from "zod";
import { api } from "@/utils/api";
import { sessionExpires, setAuthCookie } from "@/utils/auth";

const signInSchema = z.object({
  email: z
    .string()
    .email({ message: "Please, provide a valid e-mail address." }),
  password: z.string().min(1, { message: "Please, provide your password." }),
  rememberMe: z
    .string()
    .transform((value) => value === "on")
    .default("off"),
});

export type SignInDataKeys = keyof z.infer<typeof signInSchema>;

export async function signInWithEmailAndPassword(data: FormData) {
  const result = signInSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return { success: false, message: null, errors };
  }

  try {
    const { content } = await api.post<{ token: string }>("signIn", {
      body: JSON.stringify(result.data),
      headers: { "Content-Type": "application/json" },
    });
    if (!content?.data?.token) {
      throw new Error("Invalid token");
    }

    setAuthCookie(content.data.token, sessionExpires(result.data.rememberMe));
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message, errors: null };
    }

    console.error(error);

    return {
      success: false,
      message: "Unexpected error, try again in a few minutes.",
      errors: null,
    };
  }

  return { success: true, message: null, errors: null };
}
