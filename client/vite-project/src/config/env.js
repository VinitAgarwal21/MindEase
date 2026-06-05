const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const rawModelServiceUrl = import.meta.env.VITE_MODEL_SERVICE_URL || "http://localhost:8000";

export const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, "");
export const MODEL_SERVICE_URL = rawModelServiceUrl.replace(/\/$/, "");
