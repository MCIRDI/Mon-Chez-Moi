const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "https://mon-chez-moi.onrender.com/api";

const appBaseUrl = apiBaseUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");
const storageBaseUrl = `${appBaseUrl}/storage`;

export function resolvePropertyImageUrl(
  photoPath: string | null | undefined,
  fallback: string,
): string {
  if (!photoPath) return fallback;

  if (/^https?:\/\//i.test(photoPath)) {
    return photoPath;
  }

  return `${storageBaseUrl}/${photoPath.replace(/^\/+/, "")}`;
}

