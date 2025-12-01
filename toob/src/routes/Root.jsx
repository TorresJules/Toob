// routes/Root.jsx
import React from "react";
import { Outlet, NavLink } from "react-router-dom";

function Root() {
  return (
    <div className="app-container">
      <header>
        <nav>
          <ul>
            <li>
              <NavLink to="/">Accueil</NavLink>
            </li>
            <li>
              <NavLink to="/about">À propos</NavLink>
            </li>
            <li>
              <NavLink to="/products">Produits</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Contact</NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        {/* Ici seront rendus les composants enfants */}
        <Outlet />
      </main>

      <footer>
        <p>© {new Date().getFullYear()} - Mon Application</p>
      </footer>
    </div>
  );
}

export default Root;
