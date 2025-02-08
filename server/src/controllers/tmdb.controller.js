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
