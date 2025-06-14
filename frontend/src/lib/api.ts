const API_URL = import.meta.env.VITE_API_URL;

export async function api<T>(
  url: string,
  method: string,
  body?: Record<string, unknown>,
  token?: string
): Promise<T> {
  const fullUrl = `${API_URL}${url}`;
  const res = await fetch(fullUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "Unknown error");
    console.error(`❌ API error on ${method} ${fullUrl}:`, errorBody);
    throw new Error("API error");
  }

  return res.json();
}