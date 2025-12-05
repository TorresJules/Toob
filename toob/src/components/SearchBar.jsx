import { useState, useEffect, useRef } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

const SearchBar = ({ isExpanded, onExpand, onCollapse }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 400);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

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
          `${API_URL}/api/tmdb/search/${encodeURIComponent(debouncedQuery)}`
        );
        const data = await response.json();

        if (data.success) {
          setResults(data.results);
        }
      } catch (error) {
        console.error("Erreur recherche:", error);
      }
      setIsLoading(false);
    };

    searchMovies();
  }, [debouncedQuery]);

  // useEffect 2 : Clic extérieur
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
        // Appeler onCollapse si on est en mode mobile expandé
        if (onCollapse) {
          onCollapse();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCollapse]);

  // useEffect 3 : Ouvrir dropdown quand résultats
  useEffect(() => {
    if (results.length > 0) {
      setShowDropdown(true);
    }
  }, [results]);

  // useEffect 4 : Fermer dropdown au scroll
  useEffect(() => {
    const handleScroll = () => {
      if (showDropdown) {
        setShowDropdown(false);
        setQuery("");
        setResults([]);
      }
      if (onCollapse) {
        onCollapse();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showDropdown, onCollapse]);

  // Focus sur l'input quand on expand (mobile)
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const onChangeHandler = (e) => {
    setQuery(e.target.value);
  };

  const handleFocus = () => {
    if (results.length > 0) {
      setShowDropdown(true);
    }
    // Appeler onExpand si disponible (mode mobile)
    if (onExpand) {
      onExpand();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
      setShowDropdown(false);
      if (onCollapse) {
        onCollapse();
      }
    }
  };

  const handleResultClick = (movieId) => {
    navigate(`/movies/${movieId}`);
    setShowDropdown(false);
    setQuery("");
    if (onCollapse) {
      onCollapse();
    }
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <form onSubmit={handleSubmit}>
        <label className="!cursor-text flex gap-2 items-center input input-bordered !bg-base-200 !border-base-300 focus-within:!bg-base-200 focus-within:!border-base-300 focus-within:!outline-none !active:bg-base-200 hover:!bg-base-200">
          <svg
            className="h-[1em] flex-shrink-0"
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
            ref={inputRef}
            value={query}
            onFocus={handleFocus}
            onChange={onChangeHandler}
            type="text"
            className="!bg-transparent focus:!bg-transparent w-full min-w-0"
            placeholder="Chercher un film"
          />
          {/* Bouton fermer quand expandé (mobile) */}
          {isExpanded && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuery("");
                setShowDropdown(false);
                if (onCollapse) {
                  onCollapse();
                }
              }}
              className="flex-shrink-0 p-1 hover:bg-base-300 rounded-full transition-colors"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </label>
      </form>

      {showDropdown && results.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-1 bg-base-100 shadow-lg rounded-lg max-h-80 overflow-y-auto z-50">
          {results.slice(0, 5).map((movie) => (
            <div
              key={movie.id}
              className="p-2 hover:bg-base-200 cursor-pointer"
              onClick={() => handleResultClick(movie.id)}
            >
              {movie.title} ({movie.release_date?.split("-")[0]})
            </div>
          ))}
          <button
            className="btn btn-ghost w-full"
            onClick={() => {
              navigate(`/search?query=${encodeURIComponent(query)}`);
              setShowDropdown(false);
              if (onCollapse) {
                onCollapse();
              }
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
