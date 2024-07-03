import { env } from "@/env.js";

export interface FetcherOpts extends RequestInit {
  searchParams?: Record<string, string> | URLSearchParams | null;
  throwError?: boolean;
}
export interface FetcherResponseData<ResponseData> {
  status: number;
  message: string;
  data: ResponseData | null;
  success: boolean;
}
export interface FetcherResponse<ResponseData> {
  content: FetcherResponseData<ResponseData> | null;
  ok: boolean;
  errorMsg: string | null;
}

export async function fetcher<ResponseData = unknown>(
  path: string,
  opts?: FetcherOpts,
): Promise<FetcherResponse<ResponseData>> {
  const throwError = opts?.throwError ?? true;
  const url = new URL(`${env.NEXT_PUBLIC_API_URL}${path}`);
  if (opts?.searchParams)
    url.search = new URLSearchParams(opts.searchParams).toString();
  const res = await fetch(url.toString(), opts);
  let content: FetcherResponseData<ResponseData> | null = null;
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const json = JSON.parse(await res.text());
      msg = json.message || msg;
    } catch {}
    if (throwError) throw new Error(msg);
    return { content, ok: false, errorMsg: msg };
  }
  try {
    const contentLength = res.headers.get("Content-Length");
    content =
      contentLength === "0" || res.body === null
        ? null
        : (JSON.parse(await res.text()) as FetcherResponseData<ResponseData>);
  } catch (error) {
    if (throwError) throw error;
  }
  return { content, ok: res.ok, errorMsg: null };
}
