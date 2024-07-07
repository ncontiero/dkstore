"use server";

import type { ActionsReturn } from "@/hooks/useFormState";
import { z } from "zod";
import { cookies } from "next/headers";
import { api } from "@/utils/api";
import { sessionExpires } from "@/utils/auth";
import { env } from "@/env";

const signUpSchema = z
  .object({
    name: z.string().refine((value) => value.split(" ").length > 1, {
      message: "Please, enter your full name.",
    }),
    email: z
      .string()
      .email({ message: "Please, provide a valid e-mail address." }),
    password: z
      .string()
      .min(6, { message: "Password should have at least 6 characters." }),
    password_confirmation: z.string(),
    remember_me: z
      .string()
      .transform((value) => value === "on")
      .default("off"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Password confirmation does not match.",
    path: ["password_confirmation"],
  });

export type SignUpDataKeys = keyof z.infer<typeof signUpSchema>;

export async function signUpAction(
  data: FormData,
): ActionsReturn<SignUpDataKeys> {
  const result = signUpSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, message: null, errors };
  }

  try {
    const { content } = await api.post<{ token: string }>("signUp", {
      body: JSON.stringify(result.data),
      headers: { "Content-Type": "application/json" },
    });
    if (!content?.data?.token) {
      throw new Error("Invalid token");
    }

    cookies().set("token", content.data.token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      path: "/",
      expires: sessionExpires(result.data.remember_me),
    });
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

  return {
    success: true,
    message: "Account created successfully! Verify your email.",
    errors: null,
  };
}
