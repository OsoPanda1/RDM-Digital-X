const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const DEFAULT_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS || 10_000);

export class ApiError extends Error {
  status: number;
  requestId?: string;

  constructor(status: number, message: string, requestId?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.requestId = requestId;
  }
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends PaginationMeta {
  data: T[];
}

function buildUrl(path: string, params?: Record<string, string | number | undefined | null>) {
  if (!path.startsWith("/")) throw new ApiError(400, "API path must start with '/'");
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin);
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
  });
  return url;
}

function getAuthToken() {
  try {
    return window.localStorage.getItem("rdmx_token");
  } catch {
    return null;
  }
}

async function requestJson<T>(path: string, init: RequestInit = {}, params?: Record<string, string | number | undefined | null>) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  const requestId = crypto.randomUUID();
  const token = getAuthToken();

  try {
    const headers = new Headers(init.headers);
    headers.set("Accept", "application/json");
    headers.set("X-Request-ID", requestId);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

    const res = await fetch(buildUrl(path, params).toString(), {
      ...init,
      headers,
      credentials: "same-origin",
      signal: controller.signal,
    });

    const responseRequestId = res.headers.get("X-Request-ID") ?? requestId;
    if (!res.ok) {
      const message = await res.text().catch(() => res.statusText);
      throw new ApiError(res.status, message || `${init.method ?? "GET"} ${path}: ${res.statusText}`, responseRequestId);
    }

    return (await res.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(408, `Timeout API ${path}`, requestId);
    }
    throw new ApiError(0, error instanceof Error ? error.message : `Error API ${path}`, requestId);
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function apiGet<T>(path: string, params?: Record<string, string>): Promise<T> {
  return requestJson<T>(path, { method: "GET" }, params);
}

export async function apiGetPaginated<T>(
  path: string,
  params: Record<string, string | number | undefined | null> = {},
): Promise<PaginatedResponse<T>> {
  return requestJson<PaginatedResponse<T>>(path, { method: "GET" }, params);
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  return requestJson<T>(path, { method: "POST", body: JSON.stringify(body) });
}
