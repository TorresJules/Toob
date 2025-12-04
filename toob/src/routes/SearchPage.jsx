import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:4000/api/tmdb/search/${encodeURIComponent(query)}`
        );
        const data = await response.json();
        if (data.success) {
          setResults(data.results);
        }
      } catch (error) {
        console.error("Erreur:", error);
      }
      setLoading(false);
    };

    fetchResults();
  }, [query]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Résultats pour "{query}"</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <p>Aucun résultat trouvé.</p>
      )}
    </div>
  );
};

export default SearchPage;
