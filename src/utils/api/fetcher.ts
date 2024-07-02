import { env } from "@/env.js";

export interface FetcherOpts extends RequestInit {
  searchParams?: Record<string, string> | URLSearchParams | null;
  throwError?: boolean;
}
export interface FetcherResponse<T> {
  data: T | null;
  ok: boolean;
  errorMsg: string | null;
}

export async function fetcher<T = unknown>(
  path: string,
  opts?: FetcherOpts,
): Promise<FetcherResponse<T>> {
  const throwError = opts?.throwError ?? true;
  const url = new URL(`${env.NEXT_PUBLIC_API_URL}${path}`);
  if (opts?.searchParams)
    url.search = new URLSearchParams(opts.searchParams).toString();
  const res = await fetch(url.toString(), opts);
  let data: T | null = null;
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const json = JSON.parse(await res.text());
      msg = json.message || msg;
    } catch {}
    if (throwError) throw new Error(msg);
    return { data, ok: false, errorMsg: msg };
  }
  try {
    const contentLength = res.headers.get("Content-Length");
    data =
      contentLength === "0" || res.body === null
        ? null
        : (JSON.parse(await res.text()) as T);
  } catch (error) {
    if (throwError) throw error;
  }
  return { data, ok: res.ok, errorMsg: null };
}
