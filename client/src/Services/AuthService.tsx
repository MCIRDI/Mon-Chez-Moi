import api from "./api";
import axios from "axios";
export async function register(fields: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await api.post("/register", fields);
  console.log(response.data);
  localStorage.setItem("token", response.data.token.plainTextToken); // Store the token in local storage
  return response.data;
}
// export async function login(fields: { email: string; password: string }) {
//   const response = await api.post("/login", fields);
//   console.log(response.data);
// }
export async function login(fields: { email: string; password: string }) {
  try {
    const response = await api.post("/login", fields);
    console.log("the user infos :" + response.data.user); // Successful login response
    localStorage.setItem("token", response.data.token.plainTextToken); // Store the token in local storage
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // If the error is an Axios error
      if (error.response) {
        // If the error is related to the response (e.g., 401, 400)
        const errorMessage =
          error.response.data.message || "An error occurred during login.";
        // console.log("Error:", errorMessage);
        throw new Error(errorMessage); // Throw a user-friendly error message
      } else if (error.request) {
        // If the error is related to the request itself (no response received)
        // console.log("No response received:", error.request);
        throw new Error(
          "Network error: Unable to connect to the server. Please try again later."
        );
      }
    } else {
      // If the error is not an Axios error, it might be some other error (e.g., a coding error)
      // console.log("Error occurred:", (error as Error).message);
      throw new Error("An unexpected error occurred. Please try again later.");
    }
  }
}

export async function getUser() {
  const token = localStorage.getItem("token");
  const response = await api.get("/user", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
