/** Local Spring Boot; production = deployed API. Override anytime with VITE_API_BASE_URL. */
const DEFAULT_DEV = "http://localhost:8080";
const DEFAULT_PROD = "https://chatgpt-clone-springboot.onrender.com";

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? DEFAULT_PROD : DEFAULT_DEV)
).replace(/\/$/, "");
