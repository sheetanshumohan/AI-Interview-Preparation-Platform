import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Palette, 
  Cpu, 
  ShieldCheck, 
  Bell, 
  Database, 
  CreditCard, 
  Layers, 
  Key, 
  Globe, 
  Eye, 
  EyeOff, 
  Save, 
  RefreshCcw, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  Mail,
  Zap,
  Lock,
  Flag,
  Monitor
} from 'lucide-react';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('General');
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const [toggles, setToggles] = useState({
    googleLogin: true,
    resumeUpload: true,
    aiQuestions: true,
    ragPersonalization: false,
    hrInterviewMode: true,
    adminNotifications: true,
  });

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const menuItems = [
    { id: 'General', icon: Monitor, label: 'General & Branding' },
    { id: 'Intelligence', icon: Cpu, label: 'AI Intelligence' },
    { id: 'Governance', icon: ShieldCheck, label: 'Category Engine' },
    { id: 'Access', icon: Lock, label: 'Access & Limits' },
    { id: 'Security', icon: Key, label: 'Quantum Vault' },
    { id: 'Billing', icon: CreditCard, label: 'Monetization' },
  ];    

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
        setIsSaving(false);
        setShowConfirm(false);
    }, 1500);
  };

  const ToggleSwitch = ({ id, label, description, checked, onChange }) => (
    <div className="flex items-center justify-between p-6 rounded-3xl bg-black/5 border border-[var(--card-border)] group hover:bg-black/10 transition-all">
        <div className="space-y-1">
            <p className="text-sm font-semibold text-[var(--text-main)]">{label}</p>
            <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest">{description}</p>
        </div>
        <button 
            onClick={() => onChange(id)}
            className={`w-14 h-8 rounded-full p-1 transition-all duration-300 relative ${checked ? 'bg-primary shadow-[0_0_15px_rgba(0,210,255,0.4)]' : 'bg-black/20'}`}
        >
            <motion.div 
                animate={{ x: checked ? 24 : 0 }}
                className={`w-6 h-6 rounded-full shadow-lg ${checked ? 'bg-white' : 'bg-gray-500'}`} 
            />
        </button>
    </div>
  );

  const SettingsCard = ({ title, children, description }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-10 rounded-[3rem] border border-[var(--card-border)] space-y-8 relative overflow-hidden"
    >
        <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-[var(--text-main)] tracking-tighter italic">{title}</h2>
            {description && <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest leading-none">{description}</p>}
        </div>
        <div className="space-y-6">
            {children}
        </div>
    </motion.div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-10 pb-40">
      {/* Vertical Navigation Terminal */}
      <div className="w-full lg:w-80 shrink-0 space-y-2">
           {menuItems.map((item) => (
               <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-6 py-5 rounded-3xl transition-all group ${activeTab === item.id ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(0,210,255,0.1)]' : 'text-gray-500 hover:text-[var(--text-main)] hover:bg-black/5 border border-transparent'}`}
               >
                   <div className="flex items-center gap-4">
                        <item.icon className={`w-5 h-5 transition-all ${activeTab === item.id ? 'scale-110' : 'group-hover:text-primary'}`} />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">{item.label}</span>
                   </div>
                   {activeTab === item.id && <ChevronRight className="w-4 h-4" />}
               </button>
           ))}
      </div>

      {/* Configuration Viewport */}
      <div className="flex-1 space-y-10">
           <AnimatePresence mode="wait">
                {activeTab === 'General' && (
                    <div className="space-y-10">
                        <SettingsCard title="Platform Branding" description="Configure visual identity and core platform metadata">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-[0.2em] ml-2">Platform Name</label>
                                    <input type="text" defaultValue="AdminOS Quantum" className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-2xl py-4 px-6 text-xs font-semibold text-[var(--text-main)] outline-none focus:ring-1 ring-primary/30 transition-all font-mono" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-[0.2em] ml-2">Support Email</label>
                                    <input type="email" defaultValue="nexus@adminos.io" className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-2xl py-4 px-6 text-xs font-semibold text-[var(--text-main)] outline-none focus:ring-1 ring-primary/30 transition-all font-mono" />
                                </div>
                            </div>
                        </SettingsCard>

                        <SettingsCard title="Global Protocols" description="Orchestrate active platform feature flags">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ToggleSwitch id="googleLogin" label="Google OAuth" description="SSO authentication vector" checked={toggles.googleLogin} onChange={handleToggle} />
                                <ToggleSwitch id="resumeUpload" label="Deep Resume Sync" description="PDF architecture extraction" checked={toggles.resumeUpload} onChange={handleToggle} />
                                <ToggleSwitch id="aiQuestions" label="Generation Matrix" description="AI-driven technical nodes" checked={toggles.aiQuestions} onChange={handleToggle} />
                                <ToggleSwitch id="adminNotifications" label="Core Alerts" description="Admin terminal notifications" checked={toggles.adminNotifications} onChange={handleToggle} />
                             </div>
                        </SettingsCard>
                    </div>
                )}

                {activeTab === 'Intelligence' && (
                    <div className="space-y-10">
                        <SettingsCard title="AI Model Architecture" description="Configure large language model orchestration">
                             <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-[0.2em] ml-2">Primary Model Hub</label>
                                        <div className="relative">
                                            <select className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-2xl py-4 px-6 text-xs font-semibold text-[var(--text-main)] appearance-none outline-none focus:ring-1 ring-primary/30 transition-all font-mono">
                                                <option>GPT-4-TURBO-PREVIEW</option>
                                                <option>CLAUDE-3-OPUS</option>
                                                <option>GEMINI-1.5-PRO</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-[0.2em] ml-2">Neural Temperature</label>
                                        <input type="range" className="w-full accent-primary h-2 mt-4" />
                                        <div className="flex justify-between text-[8px] text-[var(--text-muted)] font-semibold uppercase tracking-widest">
                                            <span>Deterministic (0.0)</span>
                                            <span>Creative (1.0)</span>
                                        </div>
                                    </div>
                                </div>
                                <ToggleSwitch id="ragPersonalization" label="RAG Intelligence" description="Vector-based context retrieval" checked={toggles.ragPersonalization} onChange={handleToggle} />
                             </div>
                        </SettingsCard>
                    </div>
                )}

                {activeTab === 'Security' && (
                    <SettingsCard title="Quantum Vault" description="Cryptographic API keys and secure credentials">
                         <div className="space-y-6">
                            {[
                                { label: 'OpenAI API Protocol', key: 'sk-proj-....................vR21' },
                                { label: 'Cloudinary Storage Path', key: 'cloud_v2_f82x_................' },
                                { label: 'Razorpay Gateway Secret', key: 'rzp_live_....................' },
                            ].map((item, i) => (
                                 <div key={i} className="space-y-3">
                                    <label className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-[0.2em] ml-2">{item.label}</label>
                                    <div className="relative group">
                                        <input 
                                            type={showKey ? "text" : "password"} 
                                            readOnly 
                                            value={item.key}
                                            className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-2xl py-4 px-6 pr-12 text-xs font-semibold text-primary/80 outline-none font-mono" 
                                        />
                                        <button 
                                            onClick={() => setShowKey(!showKey)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[var(--text-main)] transition-colors"
                                        >
                                            {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                         </div>
                    </SettingsCard>
                )}
           </AnimatePresence>

           {/* Global Action Terminal */}
           <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="fixed bottom-10 left-[calc(18rem+10rem)] right-10 flex justify-between items-center p-6 rounded-[2.5rem] bg-[var(--sidebar-bg)] backdrop-blur-3xl border border-[var(--card-border)] shadow-[0_30px_60px_rgba(0,0,0,0.1)] z-50"
           >
                <div className="flex items-center gap-4">
                    <RefreshCcw className="w-5 h-5 text-gray-500 cursor-pointer hover:rotate-180 transition-all duration-500" />
                    <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-[0.2em] italic">Pending unsaved protocols: <span className="text-primary">8 changes detected</span></p>
                </div>
                <div className="flex gap-4">
                    <button className="px-8 py-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] text-gray-500 font-semibold text-[10px] uppercase tracking-widest hover:text-[var(--text-main)] hover:bg-black/10 transition-all">
                        Reset Registry
                    </button>
                    <button 
                        onClick={() => setShowConfirm(true)}
                        className="px-10 py-4 rounded-2xl bg-primary text-black font-semibold text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,210,255,0.4)] relative"
                    >
                        Commit Changes
                    </button>
                </div>
           </motion.div>
      </div>

      {/* Confirmation Overlay */}
      <AnimatePresence>
        {showConfirm && (
            <>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowConfirm(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="fixed inset-0 m-auto w-full max-w-lg h-fit bg-[var(--sidebar-bg)] border border-[var(--card-border)] rounded-[3rem] z-[101] overflow-hidden p-12 text-center space-y-8"
                >
                    <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                        <Zap className="w-8 h-8 text-primary" />
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-3xl font-semibold text-[var(--text-main)] italic">Confirm <span className="text-primary italic">Orchestration?</span></h3>
                        <p className="text-xs text-[var(--text-muted)] font-semibold leading-relaxed">System protocols will be updated across all active edge nodes. This may cause a temporary recalculation in the AI generation matrix.</p>
                    </div>
                    <div className="flex gap-4 pt-4">
                         <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-1 py-5 rounded-[2rem] bg-primary text-black font-semibold text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                         >
                            {isSaving ? 'Synchronizing...' : 'Execute Commit'}
                         </button>
                         <button onClick={() => setShowConfirm(false)} className="flex-1 py-5 rounded-[2rem] bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-main)] font-semibold text-xs uppercase tracking-widest hover:bg-black/10 transition-all">
                            Abort
                         </button>
                    </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminSettings;
