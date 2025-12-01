import mongoose from "mongoose";

// Définir le schéma User
const userSchema = new mongoose.Schema(
  {
    // Nom d'utilisateur
    username: {
      type: String,
      required: [true, "Le nom d'utilisateur est requis"],
      unique: true,
      trim: true, // Enlève les espaces avant/après
      minlength: [3, "Le nom d'utilisateur doit contenir au moins 3 caractères"],
      maxlength: [30, "Le nom d'utilisateur ne peut pas dépasser 30 caractères"],
    },

    // Email
    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true,
      lowercase: true, // Convertit en minuscules
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Veuillez entrer un email valide",
      ],
    },

    // Mot de passe (sera hashé plus tard en Phase 2)
    password: {
      type: String,
      required: [true, "Le mot de passe est requis"],
      minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
    },

    // Avatar (optionnel)
    avatar: {
      type: String,
      default: function() {
        return `https://ui-avatars.com/api/?name=${this.username}&size=150&background=0D8ABC&color=fff`;
      }
    },

    // Rôle (pour gérer les admins plus tard)
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Films favoris (tableau d'IDs de films TMDB)
    favoriteMovies: [
      {
        movieId: {
          type: Number,
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Films déjà vus
    watchedMovies: [
      {
        movieId: {
          type: Number,
          required: true,
        },
        watchedAt: {
          type: Date,
          default: Date.now,
        },
        rating: {
          type: Number,
          min: 0,
          max: 5,
        },
      },
    ],
  },
  {
    // Ajoute automatiquement createdAt et updatedAt
    timestamps: true,
  }
);

// Créer le modèle à partir du schéma
const User = mongoose.model("User", userSchema);

export default User;