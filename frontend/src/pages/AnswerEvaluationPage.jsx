import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Target, 
  BrainCircuit, 
  RotateCcw, 
  LayoutDashboard, 
  Sparkles, 
  Zap, 
  ArrowRight,
  MinusCircle,
  Lightbulb,
  Lock,
  Search
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const comparisonData = [
  { name: '1st', score: 45 },
  { name: '2nd', score: 62 },
  { name: '3rd', score: 84 },
];

const AnswerEvaluationPage = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setScore(84), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8 pb-32">
      {/* Hero: Score Meter */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-[3rem] p-10 border border-white/5 relative overflow-hidden flex flex-col items-center text-center gap-6"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[120px] -z-10" />
        
        <div className="relative w-56 h-56">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="112"
              cy="112"
              r="104"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-white/5"
            />
            <motion.circle
              cx="112"
              cy="112"
              r="104"
              stroke="url(#evalGradient)"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={653.45}
              initial={{ strokeDashoffset: 653.45 }}
              animate={{ strokeDashoffset: 653.45 - (653.45 * score) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="evalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00d2ff" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-6xl font-black text-white italic tracking-tighter"
            >
              {score}<span className="text-2xl not-italic text-gray-500 font-bold">%</span>
            </motion.span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">AI Evaluation</span>
          </div>
        </div>

        <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">Excellent <span className="text-primary italic">Technical Depth</span></h1>
            <p className="text-gray-500 font-medium max-w-md">Your answer demonstrated a strong understanding of core concepts, but missed key architectural nuances.</p>
        </div>

        <div className="flex gap-4">
            <button 
                onClick={() => navigate('/dashboard/mock-interview')}
                className="px-8 py-3.5 rounded-2xl bg-white text-black font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform active:scale-95 shadow-xl"
            >
                <RotateCcw className="w-5 h-5" />
                Retry Attempt
            </button>
            <button 
                 onClick={() => navigate('/dashboard')}
                className="px-8 py-3.5 rounded-2xl bg-white/5 text-white font-bold text-sm border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
            >
                <LayoutDashboard className="w-5 h-5 opacity-50" />
                Return to Hub
            </button>
        </div>
      </motion.div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Technical Accuracy", val: "92%", icon: Target, color: "text-primary", bg: "bg-primary/10" },
          { label: "Confidence", val: "78%", icon: TrendingUp, color: "text-secondary", bg: "bg-secondary/10" },
          { label: "Keyword Match", val: "65%", icon: Sparkles, color: "text-accent", bg: "bg-accent/10" }
        ].map((metric, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-[2.5rem] border border-white/5 space-y-4"
          >
            <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${metric.bg}`}>
                    <metric.icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <span className={`text-xl font-bold ${metric.color}`}>{metric.val}</span>
            </div>
            <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{metric.label}</p>
                <div className="h-1 w-full bg-white/5 rounded-full mt-2 overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: metric.val }}
                        className={`h-full ${metric.bg.replace('/10', '')}`}
                    />
                </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Insights: Strengths vs Missing */}
        <div className="space-y-6">
            <div className="glass rounded-[2.5rem] p-8 border border-white/5 space-y-6 relative overflow-hidden group">
                 <h2 className="text-lg font-bold text-white flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Key Strengths
                 </h2>
                 <div className="space-y-3">
                    {["Correct explanation of React reconciliation", "Clear concise delivery", "Strong architectural reasoning"].map(s => (
                        <div key={s} className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.04] transition-all">
                            <CheckCircle2 className="w-4 h-4 text-green-500/50" />
                            <span className="text-xs font-semibold text-gray-300">{s}</span>
                        </div>
                    ))}
                 </div>
            </div>

            <div className="glass rounded-[2.5rem] p-8 border border-white/5 space-y-6">
                 <h2 className="text-lg font-bold text-white flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    Missing Concepts
                 </h2>
                 <div className="flex flex-wrap gap-2">
                    {["Virtual DOM vs Shadow DOM", "Fiber Architecture", "Key Props", "Hydration Errors"].map(m => (
                        <span key={m} className="px-4 py-2 rounded-full bg-red-500/5 border border-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-widest">{m}</span>
                    ))}
                 </div>
                 <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 flex items-start gap-3">
                    <Lightbulb className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-red-500/80 font-bold leading-relaxed uppercase tracking-widest">Integrating these keywords could improve your accuracy by 15%.</p>
                 </div>
            </div>
        </div>

        {/* AI Suggested Answer */}
        <div className="glass rounded-[2.5rem] p-10 border border-primary/10 space-y-8 relative group overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <BrainCircuit className="w-24 h-24 text-primary" />
             </div>
             <div>
                <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2">AI Master Response</h3>
                <h2 className="text-2xl font-bold text-white tracking-tight leading-snug">"Lifting state involves moving shared state to the closest common parent..."</h2>
             </div>
             <p className="text-sm text-gray-500 font-medium leading-relaxed italic">"The key aspect you missed was mentioning how this prevents state synchronization issues across deeply nested child components. By lifting state, you ensure a single source of truth..."</p>
             
             <div className="space-y-4 pt-4">
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Why this answer wins</p>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left">
                        <Zap className="w-4 h-4 text-primary mb-2" />
                        <p className="text-[10px] text-white font-bold">Conciseness</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left">
                        <Target className="w-4 h-4 text-secondary mb-2" />
                        <p className="text-[10px] text-white font-bold">Precision</p>
                    </div>
                 </div>
             </div>
             
             <button className="w-full py-4 rounded-2xl bg-white text-black font-bold text-sm shadow-xl flex items-center justify-center gap-2 group/btn">
                Analyze Comparative Depth
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </button>
        </div>
      </div>

      {/* Comparison Chart */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="glass rounded-[3rem] p-10 border border-white/5"
      >
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-secondary" />
                Performance Strategy
            </h2>
            <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-widest border border-secondary/20">Improving</span>
            </div>
        </div>

        <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={comparisonData}>
                <defs>
                  <linearGradient id="colorScoreEval" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '16px' }}
                />
                <Area type="monotone" dataKey="score" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorScoreEval)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-4">Growth Trend over 3 attempts</p>
      </motion.div>
    </div>
  );
};

export default AnswerEvaluationPage;
