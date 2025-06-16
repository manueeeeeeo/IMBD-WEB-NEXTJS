'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth'; // 👈 AÑADIDO signOut
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useRouter } from 'next/navigation';
import { fetchPopularMovies } from '../lib/tmdb';
import MovieCard from '../components/MovieCard';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user || !user.emailVerified) {
        router.push('/auth');
        return;
      }

      // Verificar si el documento de usuario ya existe en Firestore
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          router.push('/completar-perfil');
          return;
        }

        // Si existe el perfil, cargar películas
        const data = await fetchPopularMovies();
        setMovies(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al verificar usuario o cargar películas:', error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <main className="flex items-center justify-center h-screen bg-black text-white">
        <p className="text-xl">Cargando películas...</p>
      </main>
    );
  }

  return (
    <main className="p-8 bg-black min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Películas Populares</h1>
        <button
          onClick={() => {
            signOut(auth)
              .then(() => router.push('/auth'))
              .catch((error) => console.error('Error al cerrar sesión:', error));
          }}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        ) : (
          <p>No hay películas para mostrar.</p>
        )}
      </div>
    </main>
  );
}
