import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import FloatingInput from './FloatingInput';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, user } = useAuthStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const error = query.get('error');
    if (error === 'needs_registration') {
        toast.error("Please register via the form first to set your role/experience.");
    } else if (error === 'auth_failed') {
        toast.error("Social authentication failed.");
    }
  }, [location]);

  const validate = () => {
    const newErrors = {};
    if (!formData.email.includes('@')) newErrors.email = 'Please enter a valid email';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    
    try {
        await login(formData.email, formData.password);
        setIsSuccess(true);
        toast.success("Welcome back!");
        setTimeout(() => {
            if (useAuthStore.getState().user?.isAdmin) {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        }, 2000);
    } catch (error) {
        toast.error(error.response?.data?.message || "Login failed");
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-[3rem] p-12 text-center space-y-6 border border-primary/20 bg-primary/[0.02]"
      >
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-2">
              <h2 className="text-3xl font-semibold text-[var(--text-main)]">Authenticated!</h2>
              <p className="text-[var(--text-muted)] font-semibold">Welcome back to PrepAI.</p>
          </div>
          <p className="text-sm text-primary font-semibold animate-pulse italic text-gradient">
              Redirecting to {user?.isAdmin ? 'Admin Dashboard' : 'Dashboard'}...
          </p>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-[3rem] p-10 px-8 md:px-12 border border-[var(--card-border)] shadow-3xl bg-black/5"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold text-[var(--text-main)] mb-2">Welcome Back</h2>
          <p className="text-[var(--text-muted)] text-sm font-semibold">Login to continue your interview preparation journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FloatingInput
            label="Email Address"
            id="email"
            type="email"
            icon={Mail}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />

          <FloatingInput
            label="Password"
            id="password"
            type="password"
            icon={Lock}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            showPasswordToggle={true}
            error={errors.password}
          />

          <div className="flex items-center justify-between px-2 mb-2 font-semibold">
            <div className="flex items-center gap-2">
                <input 
                    type="checkbox" 
                    id="remember" 
                    className="w-4 h-4 rounded border-[var(--card-border)] bg-black/5 text-primary focus:ring-primary/50 cursor-pointer" 
                />
                <label htmlFor="remember" className="text-xs text-[var(--text-muted)] font-semibold cursor-pointer select-none">Remember me</label>
            </div>
            <a href="#" className="text-xs font-semibold text-primary hover:text-[var(--text-main)] transition-colors">
                Forgot password?
            </a>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-[0_0_25px_rgba(0,210,255,0.3)] hover:shadow-[0_0_35px_rgba(0,210,255,0.5)] transition-all flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
          </motion.button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--card-border)]"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-semibold">
            <span className="bg-[var(--background)] px-4 text-[var(--text-muted)] font-semibold">Or continue with</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => window.location.href = '/api/auth/google'}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white text-black border border-gray-200 font-semibold text-sm hover:bg-gray-50 transition-all shadow-sm w-full"
          >
            <FcGoogle className="w-5 h-5" />
            Google
          </button>
        </div>

        <div className="mt-10 text-center text-sm font-semibold">
          <span className="text-[var(--text-muted)]">Don't have an account?</span>
          <button
            onClick={() => navigate('/register')}
            className="ml-2 font-semibold text-[var(--text-main)] hover:text-primary transition-colors hover:underline underline-offset-4"
          >
            Sign up free
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;
