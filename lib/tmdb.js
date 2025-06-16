const BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchPopularMovies() {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=es-ES`);
  const data = await res.json();
  return data.results;
}

export async function fetchMovieDetails(id) {
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=es-ES`);
  const data = await res.json();
  return data;
}