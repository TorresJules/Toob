import jwt from "jsonwebtoken";

// Middleware pour vérifier le token JWT
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Vérifier si le header Authorization existe et commence par "Bearer"
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // 2. Extraire le token (enlever "Bearer ")
      token = req.headers.authorization.split(" ")[1];
      // "Bearer eyJhbGci..." → ["Bearer", "eyJhbGci..."] → "eyJhbGci..."
    }

    // 3. Si pas de token, renvoyer une erreur
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Non autorisé - Token manquant",
      });
    }

    // Vérifier le token avec jwt.verify()
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Ajouter les infos du token dans req.user
    req.user = { id: decoded.id }

    // Passer au middleware/contrôleur suivant
    next();

  } catch (error) {

    // Token expiré
    if (error.name === "TokenExpiredError") {
        return res.status(401).json({
        success: false,
        message: "Token expiré - Veuillez vous reconnecter",
        });
    }

    // Token invalide (mauvaise signature, corrompu, etc.)
    if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
        success: false,
        message: "Token invalide",
        });
    }

    // Autres erreurs
    return res.status(401).json({
        success: false,
        message: "Non autorisé",
    });
  }
};