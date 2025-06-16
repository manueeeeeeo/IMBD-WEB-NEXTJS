'use client';

import { useState } from 'react';
import { auth } from '../../firebase/config';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setConfirm('');
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email.includes('@') || password.length < 6) {
      return setError('Correo inválido o contraseña muy corta.');
    }

    if (!isLogin && password !== confirm) {
      return setError('Las contraseñas no coinciden.');
    }

    try {
      if (isLogin) {
        const user = await signInWithEmailAndPassword(auth, email, password);
        if (!user.user.emailVerified) {
          return setError('Debes verificar tu correo antes de ingresar.');
        }
        router.push('/');
      } else {
        const user = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(user.user);
        setMessage('Registro exitoso. Revisa tu correo para verificar.');
      }
    } catch (err) {
      setError('Error de autenticación. Intenta de nuevo.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-black to-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 relative overflow-hidden">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Iniciar sesión' : 'Registrarse'}
        </h2>

        <AnimatePresence mode="wait">
          <motion.form
            key={isLogin ? 'login' : 'register'}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4 }}
          >
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            {message && <p className="text-green-500 text-sm mb-2">{message}</p>}

            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full p-2 mb-4 bg-gray-700 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full p-2 mb-4 bg-gray-700 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {!isLogin && (
              <input
                type="password"
                placeholder="Confirmar contraseña"
                className="w-full p-2 mb-4 bg-gray-700 rounded"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold"
            >
              {isLogin ? 'Entrar' : 'Registrarse'}
            </button>
          </motion.form>
        </AnimatePresence>

        <div className="mt-6 text-center">
          <p className="text-sm">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <button className="text-blue-400 hover:underline" onClick={toggleForm}>
              {isLogin ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}