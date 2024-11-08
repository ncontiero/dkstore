import { type CookiesFn, getCookie } from "cookies-next";
import {
  type Method,
  type Route,
  deleteRoutes,
  getRoutes,
  patchRoutes,
  postRoutes,
  putRoutes,
} from "./apiRoutes";
import { type FetcherOpts, type FetcherResponse, fetcher } from "./fetcher";

export type APIOptions = Omit<FetcherOpts, "method">;
export type APIGetOptions = Omit<APIOptions, "body">;

/**
 * Class representing an API client for making HTTP requests.
 */
export class API {
  private cookieStore: CookiesFn | undefined;
  private token: string | null = null;
  private headers?: APIOptions["headers"];

  /**
   * Initializes the API client by setting up necessary configurations.
   */
  async init() {
    if (typeof window === "undefined") {
      const { cookies } = await import("next/headers");
      this.cookieStore = cookies;
    }
    this.token =
      (await getCookie("token", { cookies: this.cookieStore })) ?? null;
    this.headers = {
      Authorization: `Bearer ${this.token}`,
    };
  }

  /**
   * Private method to handle fetching data with specified method, path, and options.
   * @param method - The HTTP method for the request.
   * @param path - The URL path for the request.
   * @param opts - Additional options for the request.
   * @returns A promise that resolves to the response data.
   */
  private async _fetcher<T>(
    method: Method,
    path: string,
    opts?: APIOptions,
  ): Promise<FetcherResponse<T>> {
    if (!this.token) await this.init();
    const { headers, ...rest } = opts || {};

    return fetcher(path, {
      ...rest,
      headers: { ...headers, ...this.headers },
      method,
    });
  }

  get<T>(
    path: Route<"GET">,
    opts?: APIGetOptions,
  ): Promise<FetcherResponse<T>> {
    return this._fetcher("GET", getRoutes[path], opts);
  }
  post<T>(path: Route<"POST">, opts?: APIOptions): Promise<FetcherResponse<T>> {
    return this._fetcher("POST", postRoutes[path], opts);
  }
  put<T>(path: Route<"PUT">, opts?: APIOptions): Promise<FetcherResponse<T>> {
    return this._fetcher("PUT", putRoutes[path], opts);
  }
  patch<T>(
    path: Route<"PATCH">,
    opts?: APIOptions,
  ): Promise<FetcherResponse<T>> {
    return this._fetcher("PATCH", patchRoutes[path], opts);
  }
  delete<T>(
    path: Route<"DELETE">,
    opts?: APIOptions,
  ): Promise<FetcherResponse<T>> {
    return this._fetcher("DELETE", deleteRoutes[path], opts);
  }
}

export const api = new API();
