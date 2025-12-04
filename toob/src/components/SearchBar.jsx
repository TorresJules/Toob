import { useState, useEffect, useRef } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 400);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  // useEffect 1 : Recherche API
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    const searchMovies = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:4000/api/tmdb/search/${encodeURIComponent(
            debouncedQuery
          )}`
        );
        const data = await response.json();

        if (data.success) {
          setResults(data.results);
        }
      } catch (error) {
        console.error("Erreur recherche:", error); // ← Corrigé
      }
      setIsLoading(false);
    };

    searchMovies(); // ← Maintenant il est bien appelé !
  }, [debouncedQuery]);

  // useEffect 2 : Clic extérieur (SÉPARÉ)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // ← [] = s'exécute une seule fois au montage

  // useEffect 3 : Ouvrir dropdown quand résultats
  useEffect(() => {
    if (results.length > 0) {
      setShowDropdown(true);
    }
  }, [results]);

  const onChangeHandler = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <label className="!cursor-text flex gap-2 items-center input input-bordered !bg-base-200 focus-within:!bg-base-200 focus-within:!border-base-300 !active:bg-base-200 hover:!bg-base-200">
        <svg
          className="h-[1em]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="oklch(0.7 0 0)"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input
          value={query}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          onChange={onChangeHandler}
          type="search"
          className="!bg-transparent focus:!bg-transparent"
          placeholder="Chercher un film ( ͡° ͜ʖ ͡°)"
        />
      </label>
      {showDropdown && results.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-1 bg-base-100 shadow-lg rounded-lg max-h-80 overflow-y-auto z-50">
          {results.slice(0, 5).map((movie) => (
            <div
              key={movie.id}
              className="p-2 hover:bg-base-200 cursor-pointer"
              onClick={() => {
                navigate(`/movies/${movie.id}`);
                setShowDropdown(false);
                setQuery("");
              }}
            >
              {movie.title} ({movie.release_date?.split("-")[0]})
            </div>
          ))}
          <button
            className="btn btn-ghost w-full"
            onClick={() => {
              navigate(`/search?query=${encodeURIComponent(query)}`);
              setShowDropdown(false);
            }}
          >
            Voir tous les résultats
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
