import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const FloatingInput = ({ 
    label, 
    type = 'text', 
    id, 
    value, 
    onChange, 
    icon: Icon, 
    required = false,
    showPasswordToggle = false,
    error = ""
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const effectiveType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="relative mb-6">
      <div className={`
        group relative flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-300
        ${error ? 'ring-2 ring-red-500/50 bg-red-500/5' : isFocused ? 'bg-[var(--card-bg)] ring-2 ring-primary/50 shadow-[0_0_20px_rgba(0,210,255,0.1)]' : 'bg-[var(--card-bg)] ring-1 ring-[var(--card-border)] hover:bg-primary/5'}
      `}>
        {Icon && <Icon className={`w-5 h-5 transition-colors duration-300 ${error ? 'text-red-400' : isFocused ? 'text-primary' : 'text-[var(--text-muted)]'}`} />}
        
        <div className="relative flex-1">
          <input
            id={id}
            type={effectiveType}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            required={required}
            placeholder=" "
            className="peer w-full bg-transparent border-none text-[var(--text-main)] focus:ring-0 p-0 text-base font-semibold placeholder-transparent"
          />
          <label
            htmlFor={id}
            className={`
              absolute left-0 -top-6 text-xs font-semibold uppercase tracking-widest transition-all duration-300 pointer-events-none
              peer-placeholder-shown:text-base peer-placeholder-shown:font-semibold peer-placeholder-shown:tracking-normal peer-placeholder-shown:uppercase-none peer-placeholder-shown:top-0 peer-placeholder-shown:text-[var(--text-muted)]
              peer-focus:-top-6 peer-focus:text-xs peer-focus:font-semibold peer-focus:tracking-widest peer-focus:text-primary
              ${value ? '-top-6 text-xs font-semibold tracking-widest text-primary' : ''}
              ${error ? 'peer-focus:text-red-400 text-red-400' : ''}
            `}
          >
            {label}
          </label>
        </div>

        {isPassword && showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && (
        <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-4 -bottom-5 text-[10px] text-red-500 font-semibold"
        >
            {error}
        </motion.p>
      )}
    </div>
  );
};


export default FloatingInput;
