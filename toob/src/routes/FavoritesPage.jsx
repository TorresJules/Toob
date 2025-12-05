import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import MovieCard from "../components/MovieCard";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import API_URL from "../config/api";

const FavoritesPage = () => {
  const { token, isAuthenticated } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/user-movies/favorites/details`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (data.success) {
          setMovies(data.movies);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Erreur de chargement des favoris");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token]);

  // Si non connecté
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Mes Favoris</h1>
        <p className="mb-4">Connectez-vous pour voir vos favoris.</p>
        <Link to="/login" className="btn btn-primary">
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Mes Favoris</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-lg mb-4">Vous n'avez pas encore de favoris.</p>
          <Link to="/" className="btn btn-primary">
            Découvrir des films
          </Link>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
