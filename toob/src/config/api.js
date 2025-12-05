// Configuration de l'API
const API_URL = import.meta.env.PROD
  ? "https://toob-zs36.onrender.com"
  : "http://localhost:4000";

export default API_URL;
