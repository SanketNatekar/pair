import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; 
import { useAuth } from '../../context/AuthContext.jsx';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth(); 
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // First: call your signup endpoint
      await api.post('/auth/register', {
        name,
        email,
        password,
      });

      // Optional: auto-login after signup
      const res = await login(email, password);
      console.log('Signed up and logged in:', res);

      navigate('/dashboard/:id'); // or wherever you want
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed ');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-white to-blue-100 px-4">
      <form 
        onSubmit={handleSignup} 
        className="bg-white p-10 rounded-2xl shadow-lg border border-gray-200 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">Create Account</h2>

        {error && (
          <div className="mb-4 text-red-600 bg-red-100 p-3 rounded text-sm border border-red-200">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-semibold shadow"
        >
          Sign Up
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account? <a href="/login" className="text-purple-600 hover:underline">Log in</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
