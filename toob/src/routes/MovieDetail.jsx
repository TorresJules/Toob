import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/tmdb/movies/${id}`);

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

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
        <strong className="font-bold">Erreur: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Movie Poster */}
        <div className="md:w-1/3">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full rounded-lg shadow-lg"
          />

          <div className="mt-4 flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <span
                key={genre.id}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm"
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
            <p className="text-xl text-gray-600 italic mb-4">{movie.tagline}</p>
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
              <span className="ml-1">{movie.vote_average.toFixed(1)}/10</span>
            </div>
            <div>
              {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Synopsis</h2>
            <p className="text-gray-700">
              {movie.overview || "Aucun synopsis disponible."}
            </p>
          </div>

          {/* Cast */}
          {movie.credits?.cast?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Casting principal</h2>
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
                    <p className="text-sm text-gray-600">{person.character}</p>
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
    </div>
  );
};

export default MovieDetail;
