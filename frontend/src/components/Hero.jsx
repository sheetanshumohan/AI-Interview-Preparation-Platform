import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const Hero = () => {
  const { user, isAuthenticated } = useAuthStore();
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px] animate-pulse delay-700"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-primary uppercase glass rounded-full ring-1 ring-primary/20 leading-5">
            The Future of Interviewing is Here
          </span>
          <h1 className="text-6xl md:text-8xl font-semibold mb-8 leading-[1.1] tracking-tighter text-[var(--text-main)]">
            Master Every Interview <br />
            <span className="text-gradient">with AI Precision.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-[var(--text-muted)] mb-12 leading-relaxed font-semibold">
            Personalized, real-time AI mock interviews designed to boost your confidence, 
            polish your communication, and land your dream job at top-tier companies.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to={isAuthenticated ? (user?.isAdmin ? "/admin" : "/dashboard") : "/register"}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold flex items-center gap-2 shadow-[0_0_30px_rgba(0,210,255,0.4)] hover:shadow-[0_0_50px_rgba(0,210,255,0.6)] transition-all"
              >
                {isAuthenticated ? (user?.isAdmin ? "Enter Admin Panel" : "Go to Dashboard") : "Get Started for Free"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>

            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-2xl glass text-[var(--text-main)] font-semibold flex items-center gap-2 hover:bg-black/5 transition-colors"
              >
                <div className="p-1 rounded-full bg-primary/10">
                  <Play className="w-4 h-4 fill-primary pr-0.5 text-primary" />
                </div>
                Explore Demo Mockup
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>

  );
};

export default Hero;
