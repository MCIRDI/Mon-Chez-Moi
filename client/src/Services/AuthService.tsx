import api from "./api";
import axios from "axios";

export async function register(fields: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}) {
  console.log("Register data being sent:", fields);
  const response = await api.post("/register", fields);
  console.log(response.data);
  localStorage.setItem("token", response.data.token.plainTextToken);
  return response.data;
}

export async function login(fields: { email: string; password: string }) {
  try {
    const response = await api.post("/login", fields);
    console.log("the user infos :" + response.data.user);
    localStorage.setItem("token", response.data.token.plainTextToken);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "An error occurred during login.";
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error(
          "Network error: Unable to connect to the server. Please try again later.",
        );
      }
    } else {
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

export async function forgotPassword(email: string) {
  try {
    const response = await api.post("/forgot-password", { email });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "An error occurred while sending reset instructions.";
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error(
          "Network error: Unable to connect to the server. Please try again later.",
        );
      }
    } else {
      throw new Error("An unexpected error occurred. Please try again later.");
    }
  }
}

export async function resetPassword(fields: {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}) {
  try {
    const response = await api.post("/reset-password", fields);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "An error occurred while resetting password.";
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error(
          "Network error: Unable to connect to the server. Please try again later.",
        );
      }
    } else {
      throw new Error("An unexpected error occurred. Please try again later.");
    }
  }
}
