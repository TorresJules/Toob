import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

const ProfilePage = () => {
  const { user, token, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Rediriger si non connecté
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Récupérer le nombre de favoris
  useEffect(() => {
    const fetchFavoritesCount = async () => {
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/api/user-movies/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (data.success) {
          setFavoritesCount(data.count || data.favoriteMovies?.length || 0);
        }
      } catch (error) {
        console.error("Erreur récupération favoris:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritesCount();
  }, [token]);

  // Formater la date d'inscription
  const formatDate = (dateString) => {
    if (!dateString) return "Inconnue";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Avatar */}
      <div className="flex flex-col items-center mb-8">
        <div className="avatar mb-4">
          <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img src={user.avatar} alt={user.username} />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-1">{user.username}</h1>
        <p className="text-base-content/60">{user.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Date d'inscription */}
        <div className="bg-base-200 rounded-xl p-4 text-center">
          <div className="text-base-content/60 text-sm mb-1">Membre depuis</div>
          <div className="font-semibold">{formatDate(user.createdAt)}</div>
        </div>

        {/* Nombre de favoris */}
        <div className="bg-base-200 rounded-xl p-4 text-center">
          <div className="text-base-content/60 text-sm mb-1">Films favoris</div>
          <div className="font-semibold text-2xl text-primary">
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              favoritesCount
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={() => navigate("/favorites")}
          className="btn btn-outline w-full gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          Voir mes favoris
        </button>

        <button
          onClick={handleLogout}
          className="btn btn-error btn-outline w-full gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Se déconnecter
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
