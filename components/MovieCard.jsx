export default function MovieCard({ movie }) {
  return (
    <a href={`/movie/${movie.id}`} className="block bg-gray-800 rounded-lg p-4 hover:shadow-lg">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="rounded mb-2"
      />
      <h2 className="text-white text-lg font-bold">{movie.title}</h2>
      <p className="text-gray-400 text-sm">{movie.release_date}</p>
    </a>
  );
}