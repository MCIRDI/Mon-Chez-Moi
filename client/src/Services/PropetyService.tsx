import api from "./api";

export async function fetchProperties() {
  const response = await api.get("/properties");
  return response.data;
}
export async function fatchPropertyById(id: number) {
  const response = await api.get("/properties/" + id);
  return response.data;
}
export async function createProperty(property: JSON) {
  const response = await api.post("/properties", property);
  return response.data;
}
