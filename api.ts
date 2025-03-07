import { queryClient } from "./queryClient";

export type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
};

export async function apiRequest<T>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

// Query client setup for mutations
export async function mutateData(url: string, method: string, data?: unknown) {
  const response = await apiRequest(url, {
    method: method as ApiRequestOptions["method"],
    body: data,
  });

  // Invalidate relevant queries
  await queryClient.invalidateQueries();

  return response;
}

// Re-export queryClient for modules that need it
export { queryClient };