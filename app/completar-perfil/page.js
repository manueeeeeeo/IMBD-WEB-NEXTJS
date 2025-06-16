'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/config';
import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

export default function CompletarPerfil() {
  const [fullName, setFullName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) router.push('/auth');
  }, [router]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setPhoto(reader.result);
      setPreview(reader.result);
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
      favorites: [],
    });

    router.push('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black to-gray-900 text-white">
      <motion.div
        className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg relative"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Completa tu perfil</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <input
            type="text"
            placeholder="Nombre completo"
            className="p-3 bg-gray-700 rounded"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="date"
            className="p-3 bg-gray-700 rounded"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Nombre de usuario"
            className="p-3 bg-gray-700 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <textarea
            placeholder="Descripción"
            className="p-3 bg-gray-700 rounded resize-none h-24"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label className="text-sm text-gray-300 mt-2">Foto de perfil:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="text-sm bg-gray-700 rounded p-2"
          />
          {preview && (
            <img
              src={preview}
              alt="Vista previa"
              className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-white mt-2"
            />
          )}

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 py-2 rounded font-semibold mt-4"
          >
            Guardar perfil
          </button>
        </form>
      </motion.div>
    </div>
  );
}