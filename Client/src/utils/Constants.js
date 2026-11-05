const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "https://devtinder-uajr.onrender.com";

export const BASE_URL = apiBaseUrl.replace(/\/+$/, "");
