import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setPage(1); // Reset à la page 1 quand on change de recherche
  }, [query]);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:4000/api/tmdb/search/${encodeURIComponent(
            query
          )}?page=${page}`
        );
        const data = await response.json();
        if (data.success) {
          setResults(data.results);
          setTotalPages(data.total_pages);
        }
      } catch (error) {
        console.error("Erreur:", error);
      }
      setLoading(false);
    };

    fetchResults();
  }, [query, page]);

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
      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6">
        <button
          className="btn"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          ← Précédent
        </button>

        <span className="btn btn-ghost">
          Page {page} / {totalPages}
        </span>

        <button
          className="btn"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Suivant →
        </button>
      </div>
    </div>
  );
};

export default SearchPage;
