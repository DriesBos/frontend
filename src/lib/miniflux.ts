// src/lib/miniflux.ts
import 'server-only';

const baseUrl = process.env.MINIFLUX_BASE_URL;
const token = process.env.MINIFLUX_API_TOKEN;

if (!baseUrl) throw new Error('Missing MINIFLUX_BASE_URL');
if (!token) throw new Error('Missing MINIFLUX_API_TOKEN');

export async function mfFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'X-Auth-Token': token,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    // Avoid caching dynamic feed data
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Miniflux API error ${res.status}: ${text}`);
  }

  // Some endpoints return 204
  if (res.status === 204) return undefined as T;

  return (await res.json()) as T;
}
