import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-yellow-400 mb-2">Forgot Password</h2>
        <p className="text-gray-400 mb-6">Enter your email to receive a reset link</p>

        {message && <div className="bg-green-900 text-green-300 p-3 rounded-lg mb-4">{message}</div>}
        {error && <div className="bg-red-900 text-red-300 p-3 rounded-lg mb-4">{error}</div>}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-yellow-400 text-black font-bold py-3 rounded-lg hover:bg-yellow-300 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </div>

        <p className="text-gray-400 text-center mt-6">
          Remember password?{' '}
          <Link to="/login" className="text-yellow-400 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}