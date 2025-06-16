import { fetchPopularMovies } from '../lib/tmdb';
import MovieCard from '../components/MovieCard';

export default async function Home() {
  const movies = await fetchPopularMovies();

  return (
    <main className="p-8 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Películas Populares</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </main>
  );
}
