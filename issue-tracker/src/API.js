import axios from "axios";

// Set dynamic base URL
const baseURL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_BASE_URL_DEV
    : import.meta.env.VITE_BASE_URL_PROD;

console.log("Base URL being used:", baseURL);

// Create Axios instance
const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach JWT token from localStorage to all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle unauthorized access or token expiry
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401 || status === 403) {
        console.warn("Unauthorized or token expired. Redirecting to login...");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Debug function to check API configuration
export const debugAPIConfig = () => {
  console.log("Current API Configuration:");
  console.log("Base URL:", baseURL);
  console.log("Environment:", import.meta.env.MODE);
  console.log("Access Token:", localStorage.getItem("accessToken"));
};

// Logout function: Remove tokens and redirect to login
export const logout = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (refreshToken) {
    try {
      await API.post("/logout/", { refresh: refreshToken });
      console.log("Refresh token blacklisted successfully.");
    } catch (error) {
      console.error("Failed to blacklist refresh token:", error);
      // Still proceed to clear tokens
    }
  }

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  return true;  // Indicate logout is complete
};

export default API;
