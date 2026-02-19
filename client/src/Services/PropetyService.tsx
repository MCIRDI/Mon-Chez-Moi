import api from "./api";
import axios from "axios";

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
  filters: Record<string, string | number>,
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

export async function createProperty(property: FormData) {
  const token = localStorage.getItem("token");

  const response = await api.post("/properties", property, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`, // send token
    },
  });

  return response.data;
}

export async function updateProperty(id: number, property: FormData) {
  const token = localStorage.getItem("token");

  // Create a new axios instance without default headers for FormData
  const apiInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    timeout: 50000,
  });

  // Add _method parameter to simulate PUT request
  property.append('_method', 'PUT');

  const response = await apiInstance.post(`/properties/${id}`, property, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

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
