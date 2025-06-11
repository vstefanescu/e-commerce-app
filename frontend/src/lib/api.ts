const API_URL = import.meta.env.VITE_API_URL;

export async function api<T>(
  url: string,
  method: string,
  body?: Record<string, unknown>,
  token?: string
): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(body && { body: JSON.stringify(body) }),
  });
  if (!res.ok) {
    throw new Error("API error");
  }
  return res.json();
}
