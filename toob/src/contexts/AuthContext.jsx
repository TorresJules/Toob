import { createContext, useState, useContext, useEffect } from "react";
import API_BASE_URL from "../config/api";

// URL de base de l'API
const API_URL = `${API_BASE_URL}/api/auth`;

// 1. Créer le contexte
const AuthContext = createContext();

// 2. Créer le Provider (composant qui "fournit" les données)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Au chargement : si un token existe, récupérer le profil
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const response = await fetch(`${API_URL}/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();

          if (data.success) {
            setUser(data.user);
          } else {
            // Token invalide, on nettoie
            localStorage.removeItem("token");
            setToken(null);
          }
        } catch (error) {
          console.error("Erreur chargement profil:", error);
          localStorage.removeItem("token");
          setToken(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Fonction register - créer un compte
  const register = async (username, email, password) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Stocker le token dans localStorage
        localStorage.setItem("token", data.token);
        // Mettre à jour l'état
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Erreur register:", error);
      return { success: false, message: "Erreur de connexion au serveur" };
    }
  };

  // Fonction login - se connecter
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Erreur login:", error);
      return { success: false, message: "Erreur de connexion au serveur" };
    }
  };

  // Fonction logout - se déconnecter
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Valeur fournie à tous les composants enfants
  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 4. Hook personnalisé pour utiliser le contexte facilement
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};
