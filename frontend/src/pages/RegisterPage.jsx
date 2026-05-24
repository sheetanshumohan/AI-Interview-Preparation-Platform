import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/useThemeStore';
import RegisterForm from '../components/RegisterForm';
import { Cpu, ArrowLeft, Search, CheckCircle, BarChart3, Sparkles, Sun, Moon } from 'lucide-react';

const RegisterPage = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <div className="min-h-screen bg-mesh flex items-stretch overflow-hidden relative font-semibold">
      {/* Background Particles/Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%',
              scale: Math.random() + 0.5
            }}
            animate={{ 
              x: [null, Math.random() * 100 + '%'],
              y: [null, Math.random() * 100 + '%'],
            }}
            transition={{ 
              duration: Math.random() * 20 + 20, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className={`absolute w-20 h-20 ${isDarkMode ? 'bg-secondary/5' : 'bg-primary/5'} rounded-full blur-3xl shadow-[0_0_100px_rgba(168,85,247,0.1)]`}
          />
        ))}
      </div>

      {/* Left Side: Branding & Features */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-16 relative z-10 border-r border-[var(--card-border)] bg-black/5 backdrop-blur-3xl overflow-hidden">
        <div className="space-y-12 h-full flex flex-col pt-8">
          <Link to="/" className="flex items-center gap-4 group shrink-0">
            <div className="p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl group-hover:rotate-12 transition-transform shadow-[0_0_30px_rgba(0,210,255,0.3)]">
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
                  Start Your <br />
                  <span className="text-gradient">AI Interview</span> Journey Today.
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-[var(--text-muted)] text-lg leading-relaxed font-semibold"
                >
                  Personalized interview preparation, real-time feedback, and tracked progress.
                </motion.p>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 gap-4 relative">
                <FeatureBadge 
                    icon={Search} 
                    label="AI Resume Analysis" 
                    desc="Instant ATS optimization scores." 
                    delay={0.4}
                    color="text-primary"
                    isDarkMode={isDarkMode}
                />
                <FeatureBadge 
                    icon={CheckCircle} 
                    label="Personalized Mock Interviews" 
                    desc="Tailored to your target roles." 
                    delay={0.6}
                    color="text-secondary"
                    isDarkMode={isDarkMode}
                />
                <FeatureBadge 
                    icon={BarChart3} 
                    label="Progress Tracking Dashboard" 
                    desc="Monitor your clarity and technical growth." 
                    delay={0.8}
                    color="text-accent"
                    isDarkMode={isDarkMode}
                />
              </div>
            </div>
          </div>

          <div className="text-[var(--text-muted)] text-sm font-semibold shrink-0">
            © 2026 PrepAI Technologies. All rights reserved.
          </div>
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
              className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors text-sm font-semibold z-30 group"
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
            <RegisterForm />
        </div>
      </div>
    </div>
  );
};

const FeatureBadge = ({ icon: Icon, label, desc, delay, color, isDarkMode }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.6 }}
        className="glass p-5 rounded-2xl flex items-center gap-5 border border-[var(--card-border)] shadow-2xl relative overflow-hidden group"
    >
        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className={`p-3.5 bg-black/5 border border-[var(--card-border)] rounded-2xl ${color}`}>
            <Icon className="w-7 h-7" />
        </div>
        <div>
            <p className="text-sm font-semibold text-[var(--text-main)] mb-0.5">{label}</p>
            <p className="text-[11px] font-semibold text-[var(--text-muted)]">{desc}</p>
        </div>
        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
            <Sparkles className={`w-4 h-4 ${isDarkMode ? 'text-white/40' : 'text-primary/40'}`} />
        </div>
    </motion.div>
);

export default RegisterPage;
