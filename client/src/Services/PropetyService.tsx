import api from "./api";

export async function fetchProperties() {
  const response = await api.get("/properties");
  return response.data;
}
export async function fatchPropertyById(id: number) {
  const response = await api.get("/properties/" + id);
  console.log("Fetched property: ffffff", response.data);
  return response.data;
}
export async function filterProperties(
  filters: Record<string, string | number>
) {
  try {
    const response = await api.get("/properties/filter", {
      params: filters,
    });
    return response.data;
  } catch (error) {
    if (error && typeof error === "object" && "response" in error) {
      const err = error as { response?: { status?: number; data?: unknown } };
      console.error("API error:", err.response?.status, err.response?.data);
    } else {
      console.error("API error:", error);
    }
    throw error;
  }
}
export async function createProperty(property: JSON) {
  const response = await api.post("/properties", property);
  return response.data;
}
export async function Myproperties() {
  const response = await api.get("/MyProperties");
  return response.data;
}

export async function deleteProperty(id: number) {
  const response = await api.delete("/properties/" + id);
  return response.data;
}
export async function getUserFavorites() {
  const response = await api.get("/favorites");
  return response.data;
}
export async function storeFavorites(propertyId: number) {
  const response = await api.post("/storeFavorites", {
    id_property: propertyId,
  });
  console.log("storeFavorites response:", response);
  return response.data;
}

export async function removeFromFavorites(propertyId: number) {
  const response = await api.delete(`/removeFromFavorites/${propertyId}`);
  return response.data;
}
