import { useEffect, useState } from "react";
import StarRating from "./starrating";
import NavBar from "./components/NavBar";
import Logo from "./components/Logo";
import Search from "./components/Search";
import NumResults from "./components/NumResults";
import Main from "./components/Main";
import Box from "./components/Box";
import MovieList from "./components/MovieList";
import MovieDetails from "./components/MovieDetails";
import WatchedSummary from "./components/WatchedSummary";
import WatchedList from "./components/WatchedList";

export default function App() {
  const [query, setQuery] = useState("interstellar");
  const [movies, setMovies] = useState([]);
  // const [watched, setWatched] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useState(() => {
    try {
      const stored = localStorage.getItem("watched");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }
  // local storage
  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);

          const res = await fetch(
            `https://www.omdbapi.com/?apikey=406674e8&s=${query}`,
            { signal: controller.signal },
          );

          const data = await res.json();

          if (data.Response === "False") {
            setMovies([]);
            return;
          }

          setMovies(data.Search);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) return;

      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query],
  );

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isloading ? (
            <p className="loader">Loading...</p>
          ) : (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
