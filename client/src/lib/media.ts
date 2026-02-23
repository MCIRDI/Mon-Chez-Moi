const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "https://mon-chez-moi.onrender.com/api";

export function resolvePropertyImageUrl(
  photoPath: string | null | undefined,
  fallback: string,
): string {
  if (!photoPath) return fallback;

  if (/^(https?:\/\/|data:)/i.test(photoPath)) {
    return photoPath;
  }

  return photoPath;
}

export function resolvePropertyPhotoUrl(
  propertyId: number | string | undefined,
  photoSlot: "photo1" | "photo2" | "photo3",
  photoPath: string | null | undefined,
  fallback: string,
): string {
  if (!propertyId || !photoPath) {
    return fallback;
  }

  return `${apiBaseUrl.replace(/\/$/, "")}/properties/${propertyId}/photo/${photoSlot}`;
}
