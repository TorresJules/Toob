import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Loader from "../components/Loader";
import API_URL from "../config/api";
import { useAuth } from "../contexts/AuthContext";

const MovieDetail = ({ movieId: propMovieId }) => {
  // Utiliser la prop si fournie, sinon useParams (pour compatibilité)
  const { id: paramId } = useParams();
  const movieId = propMovieId || paramId;
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const containerRef = useRef(null);

  // États pour les favoris
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}/api/tmdb/movies/${movieId}`
        );

        if (response.data.success) {
          setMovie(response.data.movie);
        } else {
          setError("Impossible de récupérer les détails du film.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Une erreur est survenue.");
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  // Vérifier si le film est en favoris
  useEffect(() => {
    const checkFavorite = async () => {
      if (!isAuthenticated || !token || !movieId) return;

      try {
        const response = await fetch(`${API_URL}/api/user-movies/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (data.success) {
          // Vérifier si le movieId est dans la liste des favoris
          // favoriteMovies est un tableau d'objets { movieId, addedAt }
          const favoriteIds = data.favoriteMovies.map((fav) => fav.movieId);
          setIsFavorite(favoriteIds.includes(Number(movieId)));
        }
      } catch (error) {
        console.error("Erreur vérification favoris:", error);
      }
    };

    checkFavorite();
  }, [isAuthenticated, token, movieId]);

  // Toggle favoris
  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setLoadingFavorite(true);

    try {
      if (isFavorite) {
        // Retirer des favoris
        const response = await fetch(`${API_URL}/api/user-movies/favorites`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ movieId: Number(movieId) }),
        });
        const data = await response.json();
        if (data.success) {
          setIsFavorite(false);
        }
      } else {
        // Ajouter aux favoris
        const response = await fetch(`${API_URL}/api/user-movies/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ movieId: Number(movieId) }),
        });
        const data = await response.json();
        if (data.success) {
          setIsFavorite(true);
        }
      }
    } catch (error) {
      console.error("Erreur toggle favoris:", error);
    } finally {
      setLoadingFavorite(false);
    }
  };

  // Gestion du scroll pour hide/show header
  const handleScroll = () => {
    if (!containerRef.current) return;
    const currentScrollY = containerRef.current.scrollTop;

    if (currentScrollY < lastScrollY || currentScrollY < 10) {
      setIsHeaderVisible(true);
    } else if (currentScrollY > lastScrollY && currentScrollY > 60) {
      setIsHeaderVisible(false);
    }

    setLastScrollY(currentScrollY);
  };

  return (
    <motion.div
      ref={containerRef}
      onScroll={handleScroll}
      className="fixed inset-0 z-40 bg-base-100 overflow-y-auto"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
    >
      {/* Header local pour MovieDetail sur mobile */}
      <div
        className={`lg:hidden fixed top-0 left-0 right-0 z-50 navbar bg-base-100 shadow-lg px-4 transition-transform duration-300 ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex-1">
          <span className="text-xl font-bold truncate max-w-[250px]">
            {movie?.title || "Chargement..."}
          </span>
        </div>
      </div>

      {/* Spacer pour le header */}
      <div className="lg:hidden h-16"></div>

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
            <strong className="font-bold">Erreur: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      ) : movie ? (
        <motion.div
          className="container mx-auto px-4 py-8 pb-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row gap-8">
            {/* Movie Poster */}
            <div className="md:w-1/3">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full rounded-lg shadow-lg"
              />

              {/* Bouton Favoris */}
              <button
                onClick={handleToggleFavorite}
                disabled={loadingFavorite}
                className={`btn w-full mt-4 gap-2 ${
                  isFavorite ? "btn-secondary" : "btn-primary"
                }`}
              >
                {loadingFavorite ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill={isFavorite ? "currentColor" : "none"}
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
                )}
                {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              </button>

              <div className="mt-4 flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-base-200 text-base-content rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Movie Details */}
            <div className="md:w-2/3">
              <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
              {movie.tagline && (
                <p className="text-xl text-base-content/60 italic mb-4">
                  {movie.tagline}
                </p>
              )}

              <div className="flex items-center gap-4 mb-6">
                <div className="badge badge-primary">
                  {new Date(movie.release_date).getFullYear()}
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1">
                    {movie.vote_average.toFixed(1)}/10
                  </span>
                </div>
                <div>
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Synopsis</h2>
                <p className="text-base-content/80">
                  {movie.overview || "Aucun synopsis disponible."}
                </p>
              </div>

              {/* Cast */}
              {movie.credits?.cast?.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">
                    Casting principal
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {movie.credits.cast.slice(0, 4).map((person) => (
                      <div key={person.id} className="text-center">
                        <img
                          src={
                            person.profile_path
                              ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                              : "/placeholder-avatar.png"
                          }
                          alt={person.name}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <p className="font-medium mt-1">{person.name}</p>
                        <p className="text-sm text-base-content/60">
                          {person.character}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trailer */}
              {movie.videos?.results?.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Bande-annonce</h2>
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={`https://www.youtube.com/embed/${movie.videos.results[0].key}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Embedded youtube"
                      className="w-full h-full"
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ) : null}
    </motion.div>
  );
};

export default MovieDetail;
