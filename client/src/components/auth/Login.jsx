import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard/:id');
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  return (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4">
    <form 
      onSubmit={handleSubmit} 
      className="bg-white p-10 rounded-2xl shadow-lg border border-gray-200 w-full max-w-md"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Welcome Back</h2>
      
      {error && (
        <div className="mb-4 text-red-600 bg-red-100 p-3 rounded text-sm border border-red-200">
          {error}
        </div>
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold shadow"
      >
        Login
      </button>

      <p className="text-center text-sm text-gray-500 mt-4">
        Don't have an account? <Link to="/signup" className=" text-blue-500 px-4 py-2 rounded hover:border-l-sky-700">Sign Up</Link>
      </p>
    </form>
  </div>
);

};

export default Login;