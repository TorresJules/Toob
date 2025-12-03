import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
  // État du formulaire
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Récupérer la fonction register du contexte
  const { register } = useAuth();

  // Pour rediriger après inscription
  const navigate = useNavigate();

  // Fonction appelée quand on soumet le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setError("");
    setIsLoading(true);

    // Appeler la fonction register du contexte
    const result = await register(username, email, password);

    if (result.success) {
      // Rediriger vers l'accueil
      navigate("/");
    } else {
      // Afficher l'erreur
      setError(result.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center">
            Créer un compte
          </h2>

          {/* Afficher l'erreur si elle existe */}
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Champ Username */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nom d'utilisateur</span>
              </label>
              <input
                type="text"
                placeholder="johndoe"
                className="input input-bordered"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Champ Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Champ Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Mot de passe</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {/* Bouton Submit */}
            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary ${isLoading ? "loading" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? "Création..." : "Créer mon compte"}
              </button>
            </div>
          </form>

          {/* Lien vers login */}
          <p className="text-center mt-4">
            Déjà un compte ?{" "}
            <Link to="/login" className="link link-primary">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
