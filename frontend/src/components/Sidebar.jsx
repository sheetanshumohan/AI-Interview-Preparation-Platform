import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';

import { 
  LayoutDashboard, 
  User, 
  Upload, 
  FileSearch, 
  BrainCircuit, 
  Video, 
  Users, 
  Lightbulb, 
  Bookmark, 
  History,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  Cpu,
  Terminal,
  ShieldAlert,
  Sun,
  Moon
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: User, label: 'Profile', path: '/dashboard/profile' },
  { icon: FileSearch, label: 'Resume Analysis', path: '/dashboard/analysis' },
  { icon: BrainCircuit, label: 'AI Questions', path: '/dashboard/ai-questions' },
  { icon: Video, label: 'Mock Interview', path: '/dashboard/mock-interview' },
  { icon: Users, label: 'HR Practice', path: '/dashboard/hr-practice' },
  { icon: Bookmark, label: 'Saved Questions', path: '/dashboard/saved' },
  { icon: History, label: 'Interview History', path: '/dashboard/history' },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <motion.div
      initial={false}
      animate={{ 
        width: isCollapsed ? '80px' : '280px',
        transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
      }}
      className="h-screen bg-[var(--sidebar-bg)] backdrop-blur-2xl border-r border-[var(--card-border)] flex flex-col relative z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between mb-2">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-[0_0_15px_rgba(0,210,255,0.3)] shrink-0">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-semibold tracking-tighter text-[var(--text-main)] whitespace-nowrap"
            >
              Prep<span className="text-primary italic">AI</span>
            </motion.span>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-7 -right-3 w-6 h-6 bg-[var(--sidebar-bg)] border border-[var(--card-border)] rounded-full flex items-center justify-center text-[var(--text-main)] hover:scale-110 transition-all shadow-xl z-50 hover:bg-primary hover:text-black"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Menu Items */}
      <div className="flex-1 px-4 py-2 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all group
              ${isActive 
                ? 'bg-primary/10 text-[var(--text-main)] shadow-[inset_0_0_20px_rgba(0,210,255,0.05)] border border-primary/20' 
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-primary' : 'group-hover:text-primary'}`} />
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-semibold whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
                {isActive && (
                  <motion.div 
                    layoutId="active-glow"
                    className="absolute inset-0 bg-primary/5 rounded-xl blur-md -z-10"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Bottom Section: Theme Switch & Sign Out */}
      <div className="p-4 border-t border-[var(--card-border)] space-y-4">
        {!isCollapsed ? (
          <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-4">
            <div className="flex items-center justify-between gap-3 px-2">
                 <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">Theme Switch</p>
                 <button 
                    onClick={toggleTheme}
                    className="p-2 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] text-primary hover:scale-110 transition-all"
                 >
                    {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-secondary" />}
                 </button>
            </div>

            <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--card-bg)] text-[var(--text-muted)] text-xs font-semibold hover:bg-red-500/10 hover:text-red-500 transition-all border border-[var(--card-border)] hover:border-red-500/20"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        ) : (
          <div className="space-y-4 flex flex-col items-center">
             <button 
                onClick={toggleTheme}
                className="w-full flex items-center justify-center p-3 rounded-xl hover:bg-black/5 text-primary transition-colors"
                title="Toggle Theme"
             >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-secondary" />}
             </button>
             <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center p-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors"
                title="Sign Out"
             >
                <LogOut className="w-5 h-5" />
             </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;
