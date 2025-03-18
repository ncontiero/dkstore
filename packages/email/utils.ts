import type { ReactElement } from "react";
import { baseEnv } from "@dkstore/env";
import {
  type Options,
  render as renderReactEmail,
} from "@react-email/components";

export const env = baseEnv();

export function absoluteUrl(path: string) {
  const url = new URL(path, env.SITE_BASEURL);
  return url.toString();
}

export function getFirstName(fullName: string = "Nicolas Contiero") {
  return fullName.split(" ").at(0)!;
}

export async function render(element: ReactElement, options?: Options) {
  return await renderReactEmail(element, options);
}
