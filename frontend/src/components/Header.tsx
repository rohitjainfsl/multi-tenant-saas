import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path
      ? 'text-brand-400 font-semibold'
      : 'text-slate-400 hover:text-white';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-white tracking-tight"
            id="header-logo"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white text-sm font-bold">
              S
            </span>
            <span>
              Saas<span className="text-brand-400">Kit</span>
            </span>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-6" aria-label="Main navigation">
            <Link to="/" className={`text-sm transition-colors duration-200 ${isActive('/')}`} id="nav-home">
              Home
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`text-sm transition-colors duration-200 ${isActive('/dashboard')}`}
                  id="nav-dashboard"
                >
                  Dashboard
                </Link>
                <button
                  id="header-logout-btn"
                  onClick={() => void logout()}
                  className="btn-ghost text-sm py-2 px-4"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-2 px-4" id="header-login-link">
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
