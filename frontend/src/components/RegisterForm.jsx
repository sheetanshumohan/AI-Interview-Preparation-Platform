import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Loader2, Briefcase, GraduationCap, ChevronDown, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FloatingInput from './FloatingInput';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const roles = ["MERN Developer", "Frontend Developer", "Backend Developer", "ML Engineer", "Data Analyst"];
const expLevels = ["Fresher", "Intermediate", "Experienced"];

const RegisterForm = () => {
  const navigate = useNavigate();
  const { signup, isLoading, error } = useAuthStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    experience: '',
    agreedToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    let strength = 0;
    if (formData.password.length > 5) strength++;
    if (formData.password.match(/[A-Z]/)) strength++;
    if (formData.password.match(/[0-9]/)) strength++;
    if (formData.password.match(/[^a-zA-Z0-9]/)) strength++;
    setPasswordStrength(strength);
  }, [formData.password]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Full name is required';
    if (!formData.email.includes('@')) newErrors.email = 'Please enter a valid email';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.agreedToTerms) newErrors.terms = 'You must agree to the terms';
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
        await signup(
            formData.name,
            formData.email,
            formData.password,
            formData.role,
            formData.experience
        );
        setIsSuccess(true);
        toast.success("Account created successfully!");
        setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
        toast.error(err.response?.data?.message || err.message || "Registration failed");
    }
  };

  const getStrengthLabel = () => {
    if (passwordStrength === 0) return { label: 'Too Weak', color: 'bg-red-500' };
    if (passwordStrength === 1) return { label: 'Weak', color: 'bg-orange-500' };
    if (passwordStrength === 2) return { label: 'Fair', color: 'bg-yellow-500' };
    if (passwordStrength === 3) return { label: 'Good', color: 'bg-blue-500' };
    return { label: 'Strong', color: 'bg-primary' };
  };

  if (isSuccess) {
    return (
      <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-[3rem] p-12 text-center space-y-6 border border-primary/20 bg-primary/[0.02]"
      >
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-2">
              <h2 className="text-3xl font-semibold text-[var(--text-main)]">Success!</h2>
              <p className="text-[var(--text-muted)] font-semibold">Your account has been created.</p>
          </div>
          <p className="text-sm text-primary font-semibold animate-pulse italic text-gradient">Redirecting to Login...</p>
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
          <h2 className="text-3xl font-semibold text-[var(--text-main)] mb-2">Create Account</h2>
          <p className="text-[var(--text-muted)] text-sm font-semibold">Join thousands of students preparing smarter.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FloatingInput
            label="Full Name"
            id="name"
            icon={User}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
          />
          
          <FloatingInput
            label="Email Address"
            id="email"
            type="email"
            icon={Mail}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />

          <div className="space-y-4">
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

            <div className="px-1 -mt-2">
                <div className="flex justify-between items-center mb-1.5 text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-semibold">
                    <span>Security Strength</span>
                    <span className={`px-2 py-0.5 rounded-full ${getStrengthLabel().color} text-white font-semibold shadow-sm`}>
                        {getStrengthLabel().label}
                    </span>
                </div>
                <div className="h-1 w-full bg-black/5 rounded-full flex gap-1">
                    {[1, 2, 3, 4].map((step) => (
                        <div 
                            key={step} 
                            className={`h-full flex-1 rounded-full transition-all duration-500 ${passwordStrength >= step ? getStrengthLabel().color : 'bg-transparent'}`}
                        />
                    ))}
                </div>
            </div>

            <FloatingInput
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              icon={ShieldCheck}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              showPasswordToggle={true}
              error={errors.confirmPassword}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
              <CustomSelect 
                  label="Preferred Role"
                  options={roles}
                  icon={Briefcase}
                  value={formData.role}
                  onChange={(val) => setFormData({...formData, role: val})}
              />
              <CustomSelect 
                  label="Experience"
                  options={expLevels}
                  icon={GraduationCap}
                  value={formData.experience}
                  onChange={(val) => setFormData({...formData, experience: val})}
              />
          </div>

          <div className="px-2 pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                      <input 
                          type="checkbox" 
                          checked={formData.agreedToTerms}
                          onChange={(e) => setFormData({...formData, agreedToTerms: e.target.checked})}
                          className="peer sr-only" 
                      />
                      <div className={`w-5 h-5 rounded-lg border border-[var(--card-border)] bg-black/5 transition-all ${formData.agreedToTerms ? 'bg-primary border-primary' : 'peer-focus:ring-1 ring-primary/50'}`} />
                      <CheckCircle2 className={`absolute inset-0 w-3 h-3 m-auto text-white transition-opacity ${formData.agreedToTerms ? 'opacity-100' : 'opacity-0'}`} />
                  </div>
                  <span className="text-xs text-[var(--text-muted)] font-semibold select-none">
                      I agree to the <a href="#" className="text-primary hover:underline underline-offset-4">Terms & Conditions</a>
                  </span>
              </label>
              {errors.terms && <p className="text-[10px] text-red-500 mt-1 pl-1 font-semibold">{errors.terms}</p>}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-[0_0_25px_rgba(0,210,255,0.3)] hover:shadow-[0_0_35px_rgba(0,210,255,0.5)] transition-all flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
          </motion.button>
        </form>



        <div className="mt-10 text-center text-sm font-semibold">
          <span className="text-[var(--text-muted)]">Already have an account?</span>
          <button
            onClick={() => navigate('/login')}
            className="ml-2 font-semibold text-[var(--text-main)] hover:text-primary transition-colors hover:underline underline-offset-4"
          >
            Log in here
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const CustomSelect = ({ label, options, icon: Icon, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative">
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="group relative flex items-center gap-2 px-4 py-3 rounded-2xl bg-black/5 ring-1 ring-[var(--card-border)] hover:bg-black/10 transition-all cursor-pointer"
            >
                <Icon className="w-4 h-4 text-[var(--text-muted)] group-hover:text-primary transition-colors" />
                <span className={`text-[10px] font-semibold truncate uppercase tracking-widest ${value ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}>
                    {value || label}
                </span>
                <ChevronDown className={`w-3 h-3 text-[var(--text-muted)] ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 4, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute z-50 w-full mt-1 bg-[var(--background)] backdrop-blur-2xl rounded-2xl overflow-hidden border border-[var(--card-border)] shadow-[0_20px_50px_rgba(0,0,0,0.2)] max-h-48 overflow-y-auto"
                    >
                        {options.map((opt, i) => (
                            <div 
                                key={i}
                                onClick={() => {
                                    onChange(opt);
                                    setIsOpen(false);
                                }}
                                className="px-4 py-3 text-[10px] text-[var(--text-muted)] hover:bg-primary/20 hover:text-[var(--text-main)] transition-colors cursor-pointer font-semibold border-b border-[var(--card-border)] last:border-0 uppercase tracking-widest"
                            >
                                {opt}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default RegisterForm;
