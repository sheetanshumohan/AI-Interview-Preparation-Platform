import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  ShieldCheck,
  Bell,
  Search,
  LogOut,
  Cpu,
  Activity,
  Terminal,
  Grid,
  Plus,
  Sun,
  Moon,
  ChevronDown,
  User as UserIcon,
  Shield,
  LifeBuoy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';
import { useAdminStore } from '../store/useAdminStore';
import { X, UserPlus, Mail, Briefcase, Award } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { stats, provisionUser, fetchStats } = useAdminStore();
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [provisionData, setProvisionData] = useState({ name: '', email: '', role: '', experience: '0-2 years' });
  const [isProvisioning, setIsProvisioning] = useState(false);

  const handleProvision = async (e) => {
    e.preventDefault();
    setIsProvisioning(true);
    const success = await provisionUser(provisionData);
    setIsProvisioning(false);
    if (success) {
        setShowProvisionModal(false);
        setProvisionData({ name: '', email: '', role: '', experience: '0-2 years' });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
    { icon: Users, label: 'User Hub', path: '/admin/users' },
    { icon: BarChart3, label: 'AI Analytics', path: '/admin/analytics' },
    { icon: Terminal, label: 'System Logs', path: '/admin/logs' },
  ];

  // Breadcrumb Logic
  const pathSegments = location.pathname.split('/').filter(p => p);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const label = segment === 'admin' ? 'Admin OS' : segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
    return { label, path };
  });

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--text-main)] selection:bg-primary/30 transition-colors duration-300">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Futuristic Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: isCollapsed ? 88 : 288,
          x: 0
        }}
        className={`
          fixed lg:sticky top-0 h-screen z-50 flex flex-col bg-[var(--sidebar-bg)] backdrop-blur-3xl border-r border-[var(--card-border)] overflow-hidden transition-all duration-300
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Neon decorative gradient */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className={`p-8 flex items-center relative ${isCollapsed ? 'justify-center' : 'gap-4'}`}>
          <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20 shrink-0 shadow-[0_0_30px_rgba(0,210,255,0.1)] group">
            <ShieldCheck className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="text-xl font-semibold tracking-tighter italic text-[var(--text-main)]">Admin<span className="text-primary not-italic tracking-normal">OS</span></span>
              <span className="text-[8px] text-[var(--text-muted)] font-semibold uppercase tracking-[0.3em] mt-0.5">Quantum Core v2.0</span>
            </motion.div>
          )}

          {/* Collapse Toggle - Desktop only */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[var(--sidebar-bg)] border border-[var(--card-border)] rounded-full items-center justify-center text-primary hover:bg-primary hover:text-black transition-all z-10"
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
            >
              <ChevronDown className="w-3 h-3 rotate-90" />
            </motion.div>
          </button>
        </div>

        <div className="px-4 py-8 space-y-2 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) => `
                relative flex items-center px-5 py-4 rounded-2xl transition-all group overflow-hidden
                ${isCollapsed ? 'justify-center mx-2' : 'gap-4 mx-4'}
                ${isActive
                  ? 'text-[var(--text-main)] bg-primary/5 border border-primary/10'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 shrink-0 transition-all ${isActive ? 'text-primary scale-110 drop-shadow-[0_0_8px_rgba(0,210,255,0.5)]' : 'group-hover:text-primary'}`} />
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`text-[10px] font-semibold uppercase tracking-[0.2em] transition-all ${isActive ? 'opacity-100 translate-x-0' : 'opacity-70'}`}
                    >
                      {item.label}
                    </motion.span>
                  )}

                  {isActive && (
                    <motion.div
                      layoutId="nav-active-glow"
                      className="absolute inset-0 bg-primary/5 -z-10"
                    />
                  )}
                  {isActive && (
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_100px_rgba(0,210,255,1)] ${isCollapsed ? 'hidden' : ''}`} />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className={`p-6 border-t border-[var(--card-border)] flex flex-col ${isCollapsed ? 'items-center' : 'space-y-4'}`}>
          <button
            onClick={handleLogout}
            title={isCollapsed ? "Exit Admin" : ""}
            className={`flex items-center rounded-2xl text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-all font-semibold text-[10px] uppercase tracking-widest border border-transparent hover:border-red-500/20 ${isCollapsed ? 'p-4 justify-center' : 'px-5 py-4 gap-4 w-full'}`}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span>Exit Admin</span>}
          </button>
        </div>
      </motion.div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Command Header */}
        <header className="min-h-28 border-b border-[var(--card-border)] flex flex-col bg-[var(--header-bg)] backdrop-blur-2xl sticky top-0 z-50 transition-all">
          {/* Breadcrumbs Row */}
          <div className="flex-none px-10 py-3 flex items-center gap-2 border-b border-black/5">
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={crumb.path}>
                {i > 0 && <span className="text-[var(--text-muted)] text-[10px] font-semibold">/</span>}
                <span className={`text-[9px] font-semibold uppercase tracking-widest ${i === breadcrumbs.length - 1 ? 'text-primary' : 'text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer transition-colors'}`}>
                  {crumb.label}
                </span>
              </React.Fragment>
            ))}
          </div>

          {/* Core Navbar Controls */}
          <div className="flex-1 flex items-center justify-between px-6 lg:px-10">
            <div className="flex items-center gap-6">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden p-3 rounded-xl bg-black/5 border border-[var(--card-border)] text-primary"
              >
                <Grid className="w-5 h-5" />
              </button>

               <div className="relative group w-[320px]">
                 <div className="absolute -inset-1 bg-primary/5 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                 <div className="relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-hover:text-primary transition-colors" />
                   <input
                     type="text"
                     placeholder="Search system universe..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            if (searchQuery.toLowerCase().includes('user')) navigate('/admin/users');
                            else if (searchQuery.toLowerCase().includes('analytics')) navigate('/admin/analytics');
                            else if (searchQuery.toLowerCase().includes('log')) navigate('/admin/logs');
                        }
                     }}
                     className="w-full bg-black/5 border border-[var(--card-border)] rounded-2xl py-3 pl-12 pr-4 text-[11px] font-semibold text-[var(--text-main)] outline-none focus:ring-1 ring-primary/30 transition-all shadow-inner"
                   />
                   <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-[var(--card-border)]">
                     <span className="text-[10px] text-[var(--text-muted)] font-semibold">⌘</span>
                     <span className="text-[10px] text-[var(--text-muted)] font-semibold">K</span>
                   </div>
                 </div>
               </div>
 
               <button 
                onClick={() => setShowProvisionModal(true)}
                className="p-3 rounded-2xl bg-black/5 border border-[var(--card-border)] text-primary hover:bg-primary hover:text-black transition-all shadow-[0_4px_20px_rgba(0,0,0,0.1)] group"
               >
                 <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
               </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-6 pr-6 border-r border-[var(--card-border)] mr-2">
                <button
                  onClick={toggleTheme}
                  className="p-3 rounded-xl bg-black/5 border border-[var(--card-border)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all group overflow-hidden relative"
                >
                  <AnimatePresence mode="wait">
                    {isDarkMode ? (
                      <motion.div key="moon" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}><Moon className="w-5 h-5" /></motion.div>
                    ) : (
                      <motion.div key="sun" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}><Sun className="w-5 h-5" /></motion.div>
                    )}
                  </AnimatePresence>
                </button>

                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`relative p-3 rounded-xl border transition-all group ${showNotifications ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-black/5 border-[var(--card-border)] text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                  >
                    <Bell className="w-5 h-5 group-hover:animate-swing origin-top" />
                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary shadow-[0_0_15px_rgba(0,210,255,1)]" />
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-80 bg-[var(--sidebar-bg)] backdrop-blur-3xl border border-[var(--card-border)] rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.2)] overflow-hidden z-[100] px-2 pb-2"
                      >
                        <div className="p-6 border-b border-[var(--card-border)] flex items-center justify-between">
                            <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest">System Pulse</h3>
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-[8px] font-bold text-primary">LIVE</span>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto no-scrollbar py-2">
                           {stats.recentActivities.length > 0 ? stats.recentActivities.slice(0, 5).map((act, i) => (
                             <div key={i} className="p-4 hover:bg-black/5 rounded-2xl transition-all group">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <Activity className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold text-[var(--text-main)] tracking-tight leading-tight">{act.detail}</p>
                                        <p className="text-[8px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-1">{new Date(act.time).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                             </div>
                           )) : (
                             <p className="p-8 text-center text-[10px] text-[var(--text-muted)] font-semibold italic uppercase tracking-widest">No pulse detected...</p>
                           )}
                        </div>
                        <button 
                            onClick={() => { navigate('/admin/logs'); setShowNotifications(false); }}
                            className="w-full py-4 text-[9px] font-bold text-primary uppercase tracking-[0.2em] border-t border-[var(--card-border)] hover:bg-primary/5 transition-all"
                        >
                            Intercept Full Log
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="relative">
                <div
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center gap-4 pl-4 group cursor-pointer"
                >
                  <div className="text-right hidden xl:block">
                    <p className="text-xs font-semibold text-[var(--text-main)] tracking-tighter">{user?.name || 'SYST_ADMIN_01'}</p>
                    <p className="text-[9px] text-[var(--text-muted)] font-semibold uppercase tracking-[0.2em] mt-0.5">Full Permission</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center border border-[var(--card-border)] shadow-[0_0_20px_rgba(0,210,255,0.2)] p-0.5 transition-all group-hover:shadow-[0_0_30px_rgba(0,210,255,0.4)]">
                    <div className="w-full h-full rounded-[14px] bg-black flex items-center justify-center overflow-hidden">
                      <Cpu className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-300 ${showProfile ? 'rotate-180' : ''}`} />
                </div>

                <AnimatePresence>
                  {showProfile && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowProfile(false)}
                        className="fixed inset-0 z-[-1]"
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-72 bg-[var(--sidebar-bg)] backdrop-blur-3xl border border-[var(--card-border)] rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.2)] overflow-hidden z-[60]"
                      >
                        <div className="p-6 border-b border-[var(--card-border)] bg-black/5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                              <Shield className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-[var(--text-main)]">{user?.name || 'Admin User'}</p>
                              <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest mt-0.5">Master Overseer</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="h-[1px] bg-[var(--card-border)] my-2 mx-5" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-all group"
                          >
                            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-semibold uppercase tracking-widest">Terminate Session</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Scalable Viewport */}
        <main className="flex-1 p-10 overflow-y-auto no-scrollbar relative min-h-[calc(100vh-7rem)]">
          {/* Viewport content glow */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] -z-10" />

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            key={location.pathname}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Provisioning Modal */}
      <AnimatePresence>
        {showProvisionModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProvisionModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 m-auto w-full max-w-lg h-fit bg-[var(--sidebar-bg)] border border-[var(--card-border)] rounded-[3rem] z-[70] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.1)]"
            >
               <div className="p-10 border-b border-[var(--card-border)] flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-[var(--text-main)] italic">Manual <span className="text-primary italic">Injection</span></h2>
                    <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest mt-1">Direct Core Provisioning</p>
                  </div>
                  <button onClick={() => setShowProvisionModal(false)} className="p-4 rounded-2xl bg-black/5 border border-[var(--card-border)] text-gray-500 hover:text-[var(--text-main)] transition-all">
                    <X className="w-5 h-5" />
                  </button>
               </div>

               <form onSubmit={handleProvision} className="p-10 space-y-6">
                  <div className="space-y-4">
                     <div className="relative group">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-primary transition-colors" />
                        <input 
                          required
                          type="text" 
                          placeholder="Candidate Full Name"
                          value={provisionData.name}
                          onChange={(e) => setProvisionData({...provisionData, name: e.target.value})}
                          className="w-full bg-black/5 border border-[var(--card-border)] rounded-2xl py-4 pl-12 pr-4 text-xs font-semibold text-[var(--text-main)] outline-none focus:ring-1 ring-primary/30 transition-all font-mono"
                        />
                     </div>
                     <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-primary transition-colors" />
                        <input 
                          required
                          type="email" 
                          placeholder="Primary Email Identity"
                          value={provisionData.email}
                          onChange={(e) => setProvisionData({...provisionData, email: e.target.value})}
                          className="w-full bg-black/5 border border-[var(--card-border)] rounded-2xl py-4 pl-12 pr-4 text-xs font-semibold text-[var(--text-main)] outline-none focus:ring-1 ring-primary/30 transition-all font-mono"
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="relative group">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-primary transition-colors" />
                            <input 
                              required
                              type="text" 
                              placeholder="Sector/Role"
                              value={provisionData.role}
                              onChange={(e) => setProvisionData({...provisionData, role: e.target.value})}
                              className="w-full bg-black/5 border border-[var(--card-border)] rounded-2xl py-4 pl-12 pr-4 text-xs font-semibold text-[var(--text-main)] outline-none focus:ring-1 ring-primary/30 transition-all font-mono"
                            />
                        </div>
                        <div className="relative group">
                            <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-primary transition-colors" />
                            <select 
                              value={provisionData.experience}
                              onChange={(e) => setProvisionData({...provisionData, experience: e.target.value})}
                              className="w-full bg-black/5 border border-[var(--card-border)] rounded-2xl py-4 pl-12 pr-4 text-xs font-semibold text-[var(--text-main)] outline-none focus:ring-1 ring-primary/30 transition-all font-mono appearance-none"
                            >
                                <option value="0-2 years">Tier: Entry (0-2y)</option>
                                <option value="3-5 years">Tier: Professional (3-5y)</option>
                                <option value="5-8 years">Tier: Senior (5-8y)</option>
                                <option value="8+ years">Tier: Architect (8+y)</option>
                            </select>
                        </div>
                     </div>
                  </div>

                  <button 
                    disabled={isProvisioning}
                    className="w-full py-5 rounded-[2rem] bg-[var(--text-main)] text-[var(--background)] font-bold text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isProvisioning ? (
                        <>
                            <Activity className="w-4 h-4 animate-spin" />
                            Processing Signal...
                        </>
                    ) : (
                        <>
                             <UserPlus className="w-4 h-4" />
                             Initialize Provisioning
                        </>
                    )}
                  </button>
               </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLayout;
