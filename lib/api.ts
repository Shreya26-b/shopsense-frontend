// lib/api.ts
export async function fetchWithAuth(
  endpoint: string,
  token: string,
  options: RequestInit = {}
) {
  const res = await fetch(
    `${process.env.BACKEND_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization:  `Bearer ${token}`,
        ...options.headers,
      },
      cache: "no-store",
    }
  )

  if (res.status === 401) {
    throw new Error("UNAUTHORIZED")
  }

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }

  return res.json()
}