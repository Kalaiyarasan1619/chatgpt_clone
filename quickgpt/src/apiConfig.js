/** Local FastAPI default; override with VITE_API_BASE_URL (e.g. Java backend on 8080). */
const DEFAULT_DEV = "http://localhost:8000";
const DEFAULT_PROD = "https://chatgpt-clone-resx.onrender.com";

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? DEFAULT_PROD : DEFAULT_DEV)
).replace(/\/$/, "");
