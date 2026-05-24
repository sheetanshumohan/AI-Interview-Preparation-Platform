import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/useThemeStore';
import LoginForm from '../components/LoginForm';
import { Cpu, ArrowLeft, TrendingUp, FileText, Sparkles, Brain, Sun, Moon } from 'lucide-react';

const LoginPage = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <div className="min-h-screen bg-mesh flex items-stretch overflow-hidden relative font-semibold">
      {/* Background Particles/Stars */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%',
              opacity: Math.random() 
            }}
            animate={{ 
              y: [null, '-100vh'],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 15 + 10, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className={`absolute w-0.5 h-0.5 ${isDarkMode ? 'bg-white' : 'bg-primary'} rounded-full`}
          />
        ))}
      </div>

      {/* Left Side: Branding & Illustration */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-16 relative z-10 border-r border-[var(--card-border)] bg-black/5 backdrop-blur-3xl overflow-hidden">
        <div className="space-y-12 h-full flex flex-col pt-8">
          <Link to="/" className="flex items-center gap-4 group shrink-0">
            <div className="p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl group-hover:rotate-12 transition-transform shadow-[0_0_30px_rgba(0,210,255,0.3)] border border-[var(--card-border)]">
              <Cpu className="w-10 h-10 text-white" />
            </div>
            <span className="font-semibold text-3xl tracking-tighter text-[var(--text-main)]">
              Prep<span className="text-primary italic font-semibold">AI</span>
            </span>
          </Link>

          <div className="flex-1 flex flex-col justify-center max-w-xl">
            <div className="space-y-12">
              <div className="space-y-6">
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-5xl xl:text-6xl font-semibold leading-[1.1] text-[var(--text-main)] tracking-tight"
                >
                  Crack Your Dream Job with <br />
                  <span className="text-gradient">AI-Powered</span> Preparation.
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-[var(--text-muted)] text-lg leading-relaxed font-semibold"
                >
                  Personalized mock interviews, real-time resume analysis, and expert AI feedback tailored to help you land offers at top-tier companies.
                </motion.p>
              </div>

              {/* Floating Stat Cards */}
              <div className="grid grid-cols-2 gap-4 relative">
                <FloatingBadge 
                    icon={FileText} 
                    label="Resume Score" 
                    value="94/100" 
                    delay={0.4}
                    color="text-primary"
                    isDarkMode={isDarkMode}
                />
                <FloatingBadge 
                    icon={TrendingUp} 
                    label="Success Rate" 
                    value="+82%" 
                    delay={0.6}
                    color="text-secondary"
                    isDarkMode={isDarkMode}
                />
                <div className="col-span-2">
                    <FloatingBadge 
                        icon={Brain} 
                        label="AI Question Generator" 
                        value="Active" 
                        delay={0.8}
                        color="text-accent"
                        isDarkMode={isDarkMode}
                    />
                </div>
              </div>
            </div>
          </div>

          <div className="text-[var(--text-muted)] text-sm font-semibold shrink-0">
            © 2026 PrepAI Technologies. All rights reserved.
          </div>
        </div>

        {/* Interior Blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none -z-10">
            <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[30%] right-[20%] w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[80px] animate-pulse delay-700"></div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex flex-col relative z-20 overflow-y-auto bg-black/5 backdrop-blur-sm lg:bg-transparent">
        <div className="absolute top-10 right-10 flex items-center gap-6 z-30">
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-black/5 text-primary transition-all border border-[var(--card-border)] glass"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-secondary" />}
          </button>
          <Link 
              to="/" 
              className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors text-sm font-semibold group"
          >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
          </Link>
        </div>

        {/* Mobile Header Only */}
        <div className="lg:hidden p-8 flex items-center gap-3">
            <Cpu className="w-8 h-8 text-primary" />
            <span className="font-semibold text-xl text-[var(--text-main)]">PrepAI</span>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20">
            <LoginForm />
        </div>
      </div>
    </div>
  );
};

const FloatingBadge = ({ icon: Icon, label, value, delay, color, isDarkMode }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.6 }}
        className="glass p-5 rounded-2xl flex items-center gap-4 border border-[var(--card-border)] shadow-2xl relative overflow-hidden group"
    >
        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className={`p-3 bg-black/5 rounded-xl border border-[var(--card-border)] ${color}`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-0.5 font-semibold">{label}</p>
            <p className="text-lg font-semibold text-[var(--text-main)]">{value}</p>
        </div>
        <div className="ml-auto">
            <Sparkles className={`w-3 h-3 ${isDarkMode ? 'text-white/20' : 'text-primary/20'}`} />
        </div>
    </motion.div>
);

export default LoginPage;
