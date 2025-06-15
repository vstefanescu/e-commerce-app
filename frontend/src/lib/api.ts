const API_URL = import.meta.env.VITE_API_URL || "";

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
    try {
      const errorJson = await res.json();
      console.error(`❌ API error on ${method} ${fullUrl}:`, errorJson);
      throw new Error(errorJson.message || "A apărut o eroare.");
    } catch {
      const text = await res.text().catch(() => "Eroare necunoscută");
      console.error(
        `❌ API error (text fallback) on ${method} ${fullUrl}:`,
        text
      );
      throw new Error("A apărut o eroare.");
    }
  }

  try {
    return await res.json();
  } catch {
    return {} as T;
  }
}
