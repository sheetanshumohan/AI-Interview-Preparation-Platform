import { Cpu } from 'lucide-react';
import { FaGithub, FaLinkedin,FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="py-16 px-6 border-t border-[var(--card-border)] bg-black/5 backdrop-blur-xl font-semibold">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-2xl text-[var(--text-main)]">PrepAI</span>
          </div>
          <p className="text-[var(--text-muted)] text-sm max-w-xs text-center md:text-left font-semibold">
            Empowering the next generation of professionals with AI-driven interview mastery.
          </p>
          <div className="flex gap-4 mt-2">
            {[FaTwitter, FaGithub, FaLinkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 rounded-full glass flex items-center justify-center text-[var(--text-muted)] hover:text-primary transition-colors hover:border-primary/50">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 font-semibold">
          <div>
            <h4 className="font-semibold text-[var(--text-main)] mb-6 text-sm uppercase tracking-widest">Product</h4>
            <ul className="space-y-4 text-sm text-[var(--text-muted)] font-semibold">
              <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Mock Session</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">ATS Scan</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[var(--text-main)] mb-6 text-sm uppercase tracking-widest">Company</h4>
            <ul className="space-y-4 text-sm text-[var(--text-muted)] font-semibold">
              <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <h4 className="font-semibold text-[var(--text-main)] mb-6 text-sm uppercase tracking-widest">Newsletter</h4>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-black/5 border border-[var(--card-border)] rounded-xl px-4 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:border-primary/50 w-full"
              />
              <button className="px-4 py-2 bg-primary text-black font-semibold rounded-xl text-sm hover:bg-white transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[var(--card-border)] text-center">
        <p className="text-[var(--text-muted)] text-xs">
          © 2026 PrepAI Technologies Inc. All rights reserved. Designed for the futuristic workforce.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
