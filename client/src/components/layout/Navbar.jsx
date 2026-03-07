import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user }  = useAuth();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#2a2f3d] bg-[#0d0f14]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-amber-500 rounded flex items-center justify-center">
            <span className="text-black text-xs font-bold" style={{ fontFamily: 'Syne' }}>T</span>
          </div>
          <span className="font-bold text-sm text-white tracking-wide" style={{ fontFamily: 'Syne, sans-serif' }}>
            TASKBOARD
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-xs text-[#6b7280] font-mono">
            {user?.email}
          </span>
          <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40
                          flex items-center justify-center text-amber-400 text-xs font-bold"
               style={{ fontFamily: 'Syne' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-[#6b7280] hover:text-red-400 transition-colors font-mono"
          >
            logout →
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;