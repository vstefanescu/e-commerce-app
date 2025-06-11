// src/lib/api.ts
export async function api<T>(
  url: string,
  method: string,
  body?: object,
  token?: string
): Promise<T> {
  const res = await fetch(url, {
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
