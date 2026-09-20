const BASE_URL = import.meta.env.VITE_API_URL;

// Uploaded images are stored as backend-relative paths (e.g. "/uploads/x.jpg").
// Prepend the backend's origin so the browser fetches them from the right place —
// external URLs (like seeded Unsplash images) are left untouched.
const API_ORIGIN = BASE_URL.replace(/\/api\/?$/, "");
export function getImageUrl(path?: string | null): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_ORIGIN}${path}`;
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const isFormData = options.body instanceof FormData;
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = body.message || message;
    } catch {
      // response wasn't JSON; keep the generic message
    }
    throw new Error(message);
  }
  return res.json();
}