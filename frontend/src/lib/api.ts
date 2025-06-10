export async function api<T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: Record<string, unknown>
): Promise<T> {
  const token = localStorage.getItem('token');
  console.log('Using token:', token);
  const response = await fetch(`https://e-commerce-backend-ov03.onrender.com`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Eroare API');
  }

  return response.json();
}
