import User from "../models/user.model.js";
import axios from "axios";

const TMDB_API_URL = "https://api.themoviedb.org/3";

// @desc    Ajouter un film aux favoris
// @route   POST /api/user-movies/favorites
// @access  Private
export const addToFavorites = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.user.id;

    // Validation
    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: "ID du film requis",
      });
    }

    // Trouver l'utilisateur
    const user = await User.findById(userId);

    // Vérifier si le film est déjà dans les favoris
    const alreadyFavorite = user.favoriteMovies.some(
      (fav) => fav.movieId === movieId
    );

    if (alreadyFavorite) {
      return res.status(400).json({
        success: false,
        message: "Film déjà dans les favoris",
      });
    }

    // Ajouter le film aux favoris
    user.favoriteMovies.push({ movieId });
    await user.save();

    res.status(201).json({
      success: true,
      message: "Film ajouté aux favoris",
      favoriteMovies: user.favoriteMovies,
    });
  } catch (error) {
    console.error("Erreur addToFavorites:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

// @desc    Retirer un film des favoris
// @route   POST /api/user-movies/favorites
// @access  Private
export const removeFromFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { movieId } = req.body;

    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: "ID du film requis",
      });
    }

    const user = await User.findById(userId);

    const isFavorite = user.favoriteMovies.some(
      (fav) => fav.movieId === movieId
    );

    if (!isFavorite) {
      return res.status(400).json({
        success: false,
        message: "Le film n'est déjà plus dans les favoris",
      });
    }

    user.favoriteMovies = user.favoriteMovies.filter(
      (fav) => fav.movieId !== movieId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: "Film retiré des favoris",
      favoriteMovies: user.favoriteMovies,
    });
  } catch (error) {
    console.error("Erreur removeFromFavorites:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

// @desc    Récupérer les films favoris
// @route   GET /api/user-movies/favorites
// @access  Private
export const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Pas d'user trouvé",
      });
    }

    res.status(200).json({
      success: true,
      count: user.favoriteMovies.length,
      favoriteMovies: user.favoriteMovies,
    });
  } catch (error) {
    console.error("Erreur getFavorites:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

// @desc    Récupérer les favoris avec détails complets
// @route   GET /api/user-movies/favorites/details
// @access  Private
export const getFavoritesWithDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Si pas de favoris, retourner un tableau vide
    if (user.favoriteMovies.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        movies: [],
      });
    }

    // Récupérer les détails de chaque film en parallèle
    const moviePromises = user.favoriteMovies.map(async (fav) => {
      try {
        const response = await axios.get(
          `${TMDB_API_URL}/movie/${fav.movieId}`,
          {
            params: {
              api_key: process.env.TMDB_API_KEY,
              language: "fr-FR",
            },
          }
        );
        return {
          ...response.data,
          addedAt: fav.addedAt, // Ajouter la date d'ajout aux favoris
        };
      } catch (error) {
        // Si un film n'est pas trouvé, retourner null
        console.error(`Film ${fav.movieId} non trouvé`);
        return null;
      }
    });

    const movies = await Promise.all(moviePromises);

    // Filtrer les films null (non trouvés)
    const validMovies = movies.filter((movie) => movie !== null);

    res.status(200).json({
      success: true,
      count: validMovies.length,
      movies: validMovies,
    });
  } catch (error) {
    console.error("Erreur getFavoritesWithDetails:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

// @desc    Ajouter un film aux "déjà vus"
// @route   POST /api/user-movies/watched
// @access  Private
export const addToWatched = async (req, res) => {
  try {
    const { movieId, rating } = req.body;
    const userId = req.user.id;

    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: "ID du film requis",
      });
    }

    const user = await User.findById(userId);

    // Vérifier si le film est déjà dans les "déjà vus"
    const alreadyWatched = user.watchedMovies.some(
      (watched) => watched.movieId === movieId
    );

    if (alreadyWatched) {
      return res.status(400).json({
        success: false,
        message: "Film déjà marqué comme vu",
      });
    }

    // Ajouter le film aux "déjà vus" (avec rating optionnel)
    const watchedMovie = { movieId };
    if (rating !== undefined && rating >= 0 && rating <= 5) {
      watchedMovie.rating = rating;
    }

    user.watchedMovies.push(watchedMovie);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Film marqué comme vu",
      watchedMovies: user.watchedMovies,
    });
  } catch (error) {
    console.error("Erreur addToWatched:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

// @desc    Retirer un film des "déjà vus"
// @route   DELETE /api/user-movies/watched
// @access  Private
export const removeFromWatched = async (req, res) => {
  try {
    const userId = req.user.id;
    const { movieId } = req.body;

    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: "ID du film requis",
      });
    }

    const user = await User.findById(userId);

    const isWatched = user.watchedMovies.some(
      (watched) => watched.movieId === movieId
    );

    if (!isWatched) {
      return res.status(400).json({
        success: false,
        message: "Le film n'est pas dans les déjà vus",
      });
    }

    user.watchedMovies = user.watchedMovies.filter(
      (watched) => watched.movieId !== movieId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: "Film retiré des déjà vus",
      watchedMovies: user.watchedMovies,
    });
  } catch (error) {
    console.error("Erreur removeFromWatched:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

// @desc    Récupérer les films "déjà vus"
// @route   GET /api/user-movies/watched
// @access  Private
export const getWatched = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      count: user.watchedMovies.length,
      watchedMovies: user.watchedMovies,
    });
  } catch (error) {
    console.error("Erreur getWatched:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

// @desc    Récupérer les "déjà vus" avec détails complets
// @route   GET /api/user-movies/watched/details
// @access  Private
export const getWatchedWithDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    if (user.watchedMovies.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        movies: [],
      });
    }

    const moviePromises = user.watchedMovies.map(async (watched) => {
      try {
        const response = await axios.get(
          `${TMDB_API_URL}/movie/${watched.movieId}`,
          {
            params: {
              api_key: process.env.TMDB_API_KEY,
              language: "fr-FR",
            },
          }
        );
        return {
          ...response.data,
          watchedAt: watched.watchedAt,
          userRating: watched.rating,
        };
      } catch (error) {
        console.error(`Film ${watched.movieId} non trouvé`);
        return null;
      }
    });

    const movies = await Promise.all(moviePromises);
    const validMovies = movies.filter((movie) => movie !== null);

    res.status(200).json({
      success: true,
      count: validMovies.length,
      movies: validMovies,
    });
  } catch (error) {
    console.error("Erreur getWatchedWithDetails:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};
