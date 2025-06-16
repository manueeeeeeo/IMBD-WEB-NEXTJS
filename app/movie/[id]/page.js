import { fetchMovieDetails } from '../../../lib/tmdb';

export default async function MovieDetail({ params }) {
  const movie = await fetchMovieDetails(params.id);

  return (
    <main className="p-8 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="rounded mb-4"
      />
      <p className="text-gray-300 mb-2">{movie.overview}</p>
      <p className="text-sm text-gray-400">Fecha de estreno: {movie.release_date}</p>
    </main>
  );
}