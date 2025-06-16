'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/config';
import { doc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function CompletarPerfil() {
  const [fullName, setFullName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) router.push('/auth');
  }, [router]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      // Comprimir imagen (limitamos tamaño)
      setPhoto(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const calculateAge = (dateStr) => {
    const birth = new Date(dateStr);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const age = calculateAge(birthdate);
    if (age < 18) {
      return setError('Debes ser mayor de edad para crear una cuenta.');
    }

    // Verificamos si el username ya existe
    const q = query(collection(db, 'users'), where('username', '==', username));
    const existing = await getDocs(q);
    if (!existing.empty) {
      return setError('Ese nombre de usuario ya está en uso.');
    }

    const uid = auth.currentUser.uid;

    await setDoc(doc(db, 'users', uid), {
      uid,
      fullName,
      birthdate,
      username,
      description,
      isAdult: true,
      photo,
      favorites: []
    });

    router.push('/');
  };

  return (
    <main className="p-6 max-w-xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-4">Completa tu perfil</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nombre completo"
          className="p-2 rounded bg-gray-800"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="date"
          className="p-2 rounded bg-gray-800"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nombre de usuario"
          className="p-2 rounded bg-gray-800"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <textarea
          placeholder="Descripción"
          className="p-2 rounded bg-gray-800"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="text-sm"
        />
        {error && <p className="text-red-400">{error}</p>}
        <button
          type="submit"
          className="bg-green-600 p-2 rounded hover:bg-green-700"
        >
          Guardar perfil
        </button>
      </form>
    </main>
  );
}