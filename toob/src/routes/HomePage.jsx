import React, { useEffect, useState, useRef } from "react";
import MovieCard from "../components/MovieCard";
import Loader from "../components/Loader";
import API_URL from "../config/api";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${API_URL}/api/tmdb/popular`);
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

  // Vérifier si on peut scroller
  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener("resize", checkScrollability);
    return () => window.removeEventListener("resize", checkScrollability);
  }, [movies]);

  const handleScroll = () => {
    checkScrollability();
  };

  if (error) return <div className="alert alert-error mt-4 mx-4">{error}</div>;

  return (
    <div className="space-y-8">
      {/* Section Films tendances */}
      <section>
        <h1 className="text-2xl md:text-3xl font-bold mb-4 px-4">
          Films tendances
        </h1>

        {loading ? (
          <div className="px-4">
            <Loader />
          </div>
        ) : (
          <div className="relative">
            {/* Carousel */}
            <div
              ref={carouselRef}
              onScroll={handleScroll}
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-4"
            >
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="flex-shrink-0 w-[140px] md:w-[180px] lg:w-[200px]"
                >
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>

            {/* Gradient fade sur les bords */}
            <div
              className={`absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-base-100 to-transparent pointer-events-none transition-opacity duration-300 ${
                canScrollLeft ? "opacity-100" : "opacity-0"
              }`}
            />
            <div
              className={`absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-base-100 to-transparent pointer-events-none transition-opacity duration-300 ${
                canScrollRight ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
