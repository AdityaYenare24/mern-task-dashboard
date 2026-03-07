import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser, clearError } from '../features/auth/authSlice';
import useAuth from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';

const Login = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user, loading, error } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate('/dashboard');
    return () => dispatch(clearError());
  }, [user, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(loginUser(form));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 page-enter">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-500/10
                          border border-amber-500/30 rounded-xl mb-4">
            <span className="text-amber-400 text-xl">⬡</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-sm text-[#6b7280] mt-1 font-mono">Sign in to your workspace</p>
        </div>

        {/* Card */}
        <div className="card border-[#2a2f3d]">
          {error && (
            <div className="mb-4 px-3 py-2.5 bg-red-500/10 border border-red-500/20
                            rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-[#6b7280] mb-1.5 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-[#6b7280] mb-1.5 uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                className="input-field"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
              {loading ? <><Spinner size="sm" /> Signing in...</> : 'Sign In →'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#6b7280] mt-5 font-mono">
          No account?{' '}
          <Link to="/register" className="text-amber-400 hover:text-amber-300 transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;