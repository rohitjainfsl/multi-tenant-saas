import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-500 text-white text-xs font-bold">
              S
            </span>
            <span className="text-white font-semibold text-sm">
              Saas<span className="text-brand-400">Kit</span>
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6" aria-label="Footer navigation">
            <Link
              to="/"
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
              id="footer-home-link"
            >
              Home
            </Link>
            <Link
              to="/login"
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
              id="footer-login-link"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
              id="footer-register-link"
            >
              Register
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-slate-600 text-xs">
            &copy; {year} SaasKit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
