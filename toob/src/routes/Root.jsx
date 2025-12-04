// routes/Root.jsx
import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SearchBar from "../components/SearchBar";

function Root() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Fonction de déconnexion
  const handleLogout = () => {
    logout();
    navigate("/"); // Redirige vers l'accueil
  };

  return (
    <div className="app-container">
      <header className="navbar bg-base-100 shadow-lg px-4">
        {/* Logo / Titre */}
        <div className="flex-1">
          <NavLink to="/" className="btn btn-ghost text-xl">
            🎬 Toob
          </NavLink>
        </div>

        {/* Navigation */}
        <nav className="flex-none">
          <ul className="menu menu-horizontal px-1 gap-2">
            <li className="!bg-transparent !active:bg-transparent">
              <SearchBar />
            </li>
            <li>
              <NavLink to="/" className="btn btn-ghost">
                Accueil
              </NavLink>
            </li>

            {/* Affichage conditionnel selon l'état de connexion */}
            {isAuthenticated ? (
              // Si connecté
              <>
                <li>
                  <span>
                    <img
                      className="w-10 rounded-full"
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
              // Si non connecté
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

      <main className="container mx-auto p-4">
        <Outlet />
      </main>

      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <p>© {new Date().getFullYear()} - Toob 🎬</p>
      </footer>
    </div>
  );
}

export default Root;