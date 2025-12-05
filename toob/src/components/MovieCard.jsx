import React from "react";
import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder-poster.jpg";

  return (
    <div className="card bg-base-200 hover:bg-base-300 transition-shadow duration-200 shadow-lg overflow-hidden">
      <Link to={`/movies/${movie.id}`} className="block h-full">
        <figure className="relative aspect-[2/3]">
          <img
            src={posterUrl}
            alt={movie.title}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </figure>
      </Link>
    </div>
  );
};

export default MovieCard;
