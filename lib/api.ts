// lib/api.ts
// Reusable fetch wrapper that attaches the JWT token automatically

export async function fetchWithAuth(
  endpoint: string,
  token: string,
  options: RequestInit = {}
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    }
  )

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }

  return res.json()
}