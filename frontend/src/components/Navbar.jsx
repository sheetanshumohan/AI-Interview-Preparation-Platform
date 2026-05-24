import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';
import { Cpu, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { user, isAuthenticated } = useAuthStore();

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-full px-8 py-3 translate-y-2">
        <Link to="/" className="flex items-center gap-2 cursor-pointer group">
          <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg group-hover:scale-110 transition-transform">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <span className="font-semibold text-xl tracking-tight text-[var(--text-main)]">
            Prep<span className="text-primary italic">AI</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[var(--text-muted)]">
          <a href="#features" className="hover:text-[var(--text-main)] transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-[var(--text-main)] transition-colors">How it Works</a>
          <a href="#faq" className="hover:text-[var(--text-main)] transition-colors">FAQ</a>
        </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-black/5 text-primary transition-all"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-secondary" />}
            </button>
            
            {isAuthenticated ? (
              <Link 
                to={user?.isAdmin ? "/admin" : "/dashboard"} 
                className="px-6 py-2.5 rounded-xl bg-primary text-black text-sm font-semibold hover:opacity-90 transition-all shadow-[0_0_20px_rgba(0,210,255,0.2)]"
              >
                {user?.isAdmin ? "Admin Panel" : "Dashboard"}
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors text-sm font-semibold"
                >
                  Log in
                </Link>
                <Link 
                  to="/register" 
                  className="px-6 py-2.5 rounded-xl bg-primary text-black text-sm font-semibold hover:opacity-90 transition-all shadow-[0_0_20px_rgba(0,210,255,0.2)]"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

      </div>
    </motion.nav>
  );
};

export default Navbar;
