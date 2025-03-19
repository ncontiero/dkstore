import type { ReactElement } from "react";
import {
  type Options,
  render as renderReactEmail,
} from "@react-email/components";
import { env } from "./env";

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
