import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Fonction utilitaire pour générer un JWT
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, // Payload (données dans le token)
    process.env.JWT_SECRET, // Clé secrète
    { expiresIn: process.env.JWT_EXPIRE || "7d" } // Expire dans 7 jours
  );
};

// @desc    Créer un nouveau compte utilisateur
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Validation des champs
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Veuillez remplir tous les champs",
      });
    }

    // 2. Vérifier si l'email existe déjà
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Cet email est déjà utilisé",
      });
    }

    // 3. Vérifier si le username existe déjà
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: "Ce nom d'utilisateur est déjà pris",
      });
    }

    // 4. Hasher le mot de passe
    const salt = await bcrypt.genSalt(10); // Génère un "sel" (aléatoire)
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Créer l'utilisateur dans la base de données
    const user = await User.create({
      username,
      email,
      password: hashedPassword, // Mot de passe hashé
    });

    // 6. Générer un token JWT
    const token = generateToken(user._id);

    // 7. Retourner la réponse
    res.status(201).json({
      success: true,
      message: "Compte créé avec succès",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erreur register:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création du compte",
      error: error.message,
    });
  }
};

// @desc    Connexion d'un utilisateur
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation des champs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Veuillez remplir tous les champs",
      });
    }

    // 2. Trouver l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    // 3. Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    // 4. Générer un token JWT
    const token = generateToken(user._id);

    // 5. Retourner la réponse
    res.status(200).json({
      success: true,
      message: "Connexion réussie",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erreur login:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la connexion",
      error: error.message,
    });
  }
};

// @desc    Récupérer le profil de l'utilisateur connecté
// @route   GET /api/auth/profile
// @access  Private (nécessite un token)
export const getProfile = async (req, res) => {
  try {
    // req.user est ajouté par le middleware auth (on le créera au Point 4)
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Erreur getProfile:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du profil",
      error: error.message,
    });
  }
};