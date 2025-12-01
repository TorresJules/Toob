import React, { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import Loader from "../components/Loader";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("/api/tmdb/popular");
        if (!response.ok) throw new Error("Erreur de chargement");

        const { results } = await response.json();
        setMovies(results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (error) return <div className="alert alert-error mt-4">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-primary">Films tendances</h1>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
