import axios from "axios";

const TMDB_API_URL = "https://api.themoviedb.org/3";

export const getPopularMovies = async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_API_URL}/movie/popular`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        languages: "fr-FR",
      },
    });

    res.json({
      success: true,
      results: response.data.results.slice(0, 10),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur de récupération des films",
    });
  }
};

// get movie details by ID
export const getMovieById = async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID du film manquant",
    });
  }

  try {
    // Fetch basic movie data
    const movieResponse = await axios.get(`${TMDB_API_URL}/movie/${id}`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        language: "fr-FR",
        append_to_response: "videos,credits,similar,recommendations",
      },
    });

    res.json({
      success: true,
      movie: movieResponse.data,
    });
  } catch (error) {
    console.error(`Error fetching movie with ID ${id}:`, error);
    
    // Handle 404 specifically
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        success: false,
        message: "Film non trouvé",
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Erreur de récupération des détails du film",
    });
  }
};

export const getMoviesByName = async (req, res) => {
  const { name } = req.params;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Nom du film manquant",
    });
  }

  try {
    const moviesResponse = await axios.get(`${TMDB_API_URL}/search/movie`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        language: "fr-FR",
        query: name,
      },
    });

    res.json({
      success: true,
      results: moviesResponse.data.results,
      total_results: moviesResponse.data.total_results,
    });
  } catch (error) {
    console.error(`Error fetching movies with name ${name}:`, error);

    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        success: false,
        message: "Aucun film trouvé",
      });
    }

    res.status(500).json({
      success: false,
      message: "Erreur de récupération des films",
    });
  }
};