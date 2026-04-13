import { useEffect, useState } from "react";
import StarRating from "../starrating";
function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState(null);
  const [isloading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const isWatched = watched.some((movie) => movie.imdbID === selectedId);
  const WatchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId,
  )?.userRating;
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie || {};
  function handleAddWatched() {
    const newWatchedMovie = {
      imdbID: selectedId,
      Title: title,
      Year: year,
      Poster: poster,
      runtime: Number(runtime.split(" ").at(0)),
      imdbRating: Number(imdbRating),
      userRating,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }
  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=406674e8&i=${selectedId}`,
        );

        const data = await res.json();

        setMovie(data);

        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    }

    fetchMovieDetails();
  }, [selectedId]);
  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;
    return function cleanup() {
      document.title = "usePopcorn";
    };
  }, [title]);
  // Escape key to close movie details
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onCloseMovie();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCloseMovie]);

  return (
    <div className="details">
      {isloading ? (
        <p className="loader">Loading...</p>
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`${title} poster`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <h3>Genres</h3>
              <p>{genre}</p>
              <p> ⭐️{imdbRating} IMDB Rating</p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating maxRating={10} onSetRating={setUserRating} />
                  <button className="btn-add" onClick={handleAddWatched}>
                    Add to list
                  </button>
                </>
              ) : (
                <p>
                  You rated this movie {WatchedUserRating} <span>⭐️</span>
                </p>
              )}
            </div>
            <h3>Plot</h3>
            <p>{plot}</p>
            <p>staring: {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

export default MovieDetails;
