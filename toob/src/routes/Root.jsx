// routes/Root.jsx
import React, { useState, useEffect } from "react";
import {
  Outlet,
  NavLink,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SearchBar from "../components/SearchBar";
import { AnimatePresence } from "framer-motion";
import MovieDetail from "./MovieDetail";

function Root() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // État pour le header mobile (hide/show au scroll)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // État pour la searchbar expandée (mobile)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // Vérifier si on est sur une page de détails de film
  const isMovieDetailPage = location.pathname.startsWith("/movies/");
  const movieId = isMovieDetailPage
    ? location.pathname.split("/movies/")[1]
    : null;

  // Fonction de déconnexion
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Gestion du scroll pour hide/show header mobile
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Si on scroll vers le haut OU qu'on est tout en haut -> montrer le header
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsHeaderVisible(true);
      }
      // Si on scroll vers le bas et qu'on a scrollé un peu -> cacher le header
      else if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsHeaderVisible(false);
        setIsSearchExpanded(false); // Fermer la recherche si on scroll
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="app-container min-h-screen flex flex-col">
      {/* Header Mobile */}
      <header
        className={`lg:hidden navbar bg-base-100 shadow-lg px-4 fixed top-0 left-0 right-0 z-50 transition-transform duration-300 gap-0 ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Logo - caché quand recherche expandée */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${
            isSearchExpanded ? "max-w-0 opacity-0" : "max-w-[150px] opacity-100"
          }`}
        >
          <NavLink
            to="/"
            className="pl-0 btn btn-ghost text-xl whitespace-nowrap"
          >
            ( ͡° ͜ʖ ͡°) Toob
          </NavLink>
        </div>

        {/* Barre de recherche mobile - toujours flex-1, le logo disparaît */}
        <div className="flex-1 transition-all duration-300 ease-out">
          <SearchBar
            isExpanded={isSearchExpanded}
            onExpand={() => setIsSearchExpanded(true)}
            onCollapse={() => setIsSearchExpanded(false)}
          />
        </div>
      </header>

      {/* Header Desktop */}
      <header className="hidden lg:flex navbar bg-base-100 shadow-lg px-4 sticky top-0 z-50">
        {/* Logo / Titre */}
        <div className="flex-1">
          <NavLink to="/" className="btn btn-ghost text-xl">
            ( ͡° ͜ʖ ͡°) Toob
          </NavLink>
        </div>

        {/* Barre de recherche desktop */}
        <div className="mr-2">
          <SearchBar />
        </div>

        {/* Navigation Desktop */}
        <nav className="flex-none">
          <ul className="menu menu-horizontal px-1 gap-2 items-center">
            <li>
              <NavLink to="/" className="btn btn-ghost">
                Accueil
              </NavLink>
            </li>

            {isAuthenticated ? (
              <>
                <li>
                  <NavLink to="/favorites" className="btn btn-ghost">
                    Favoris
                  </NavLink>
                </li>
                <li>
                  <span className="p-0">
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={user?.avatar}
                      alt="Avatar user"
                    />
                  </span>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline btn-error"
                  >
                    Déconnexion
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/login" className="btn btn-ghost">
                    Connexion
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/register" className="btn btn-primary">
                    Inscription
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>

      {/* Spacer pour le header mobile fixed */}
      <div className="lg:hidden h-16"></div>

      {/* Contenu principal - Outlet pour les pages normales */}
      <main className="container mx-auto px-0 py-4 flex-1 pb-24 lg:pb-4 relative">
        <Outlet />
      </main>

      {/* MovieDetail en overlay avec animation */}
      <AnimatePresence>
        {isMovieDetailPage && movieId && (
          <MovieDetail key={movieId} movieId={movieId} />
        )}
      </AnimatePresence>

      {/* Footer (desktop seulement) */}
      <footer className="hidden lg:block footer footer-center p-4 bg-base-300 text-base-content">
        <p>© {new Date().getFullYear()} - Toob 🎬</p>
      </footer>

      {/* Bottom Navigation Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-300 z-50">
        <div className="flex justify-around items-center h-16 px-4">
          {/* Favoris / Films likés */}
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-base-content/70 hover:text-base-content"
              }`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
            <span className="text-xs">Favoris</span>
          </NavLink>

          {/* Découvrir */}
          {/* <NavLink
            to="/discover"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-base-content/70 hover:text-base-content"
              }`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="10" strokeWidth={2} />
              <polygon
                fill="currentColor"
                stroke="none"
                points="12,2 14.5,9.5 12,12 9.5,9.5"
                opacity="0.6"
              />
              <polygon
                fill="currentColor"
                stroke="none"
                points="12,22 9.5,14.5 12,12 14.5,14.5"
                opacity="0.6"
              />
              <polygon
                fill="currentColor"
                stroke="none"
                points="12,12 14.5,9.5 22,12 14.5,14.5"
              />
              <polygon
                fill="currentColor"
                stroke="none"
                points="12,12 9.5,14.5 2,12 9.5,9.5"
              />
            </svg>
            <span className="text-xs">Découvrir</span>
          </NavLink> */}

          {/* Profil avec Avatar */}
          <NavLink
            to={isAuthenticated ? "/profile" : "/login"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-base-content/70 hover:text-base-content"
              }`
            }
          >
            {isAuthenticated && user?.avatar ? (
              <img
                className="w-7 h-7 rounded-full object-cover ring-2 ring-base-300"
                src={user.avatar}
                alt="Profil"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            )}
            <span className="text-xs">
              {isAuthenticated ? "Profil" : "Connexion"}
            </span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}

export default Root;
