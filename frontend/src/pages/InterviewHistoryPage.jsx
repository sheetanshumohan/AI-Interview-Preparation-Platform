import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Target, 
  ChevronDown, 
  RotateCcw, 
  ExternalLink, 
  Cpu, 
  MessageSquare, 
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Flag,
  History
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import toast from 'react-hot-toast';

const InterviewHistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ totalMocks: 0, totalPractice: 0, avgScore: 0, prepDays: 0 });
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
        const response = await axios.get('/ai/history');
        if (response.data.success) {
            setHistory(response.data.history);
            setStats(response.data.stats);
        }
    } catch (error) {
        toast.error("Failed to load interview history");
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  const truncateDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500 border-green-500/20 bg-green-500/10";
    if (score >= 60) return "text-primary border-primary/20 bg-primary/10";
    return "text-red-500 border-red-500/20 bg-red-500/10";
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-semibold text-[var(--text-main)] tracking-tight"
        >
          Interview <span className="text-primary italic">Chronicle</span>
        </motion.h1>
        <p className="text-[var(--text-muted)] font-semibold text-sm">Review your past performances, analyze AI feedback, and track your growth timeline.</p>
      </div>

      {/* Timeline Container */}
      <div className="relative mt-12 pl-8 md:pl-12">
        {/* Vertical Timeline Line */}
        <div className="absolute left-[15px] top-4 bottom-0 w-[2px] bg-gradient-to-b from-primary via-secondary/50 to-transparent" />

        <div className="space-y-12 min-h-[400px]">
          {loading ? (
             <div className="space-y-8">
                 {[1,2,3].map(i => (
                     <div key={i} className="h-32 w-full rounded-[2.5rem] bg-[var(--card-bg)] border border-[var(--card-border)] animate-pulse" />
                 ))}
             </div>
          ) : history.length > 0 ? (
            history.map((session, index) => (
            <motion.div 
              key={session.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative"
            >
              {/* Timeline Node */}
              <div className="absolute -left-[32px] md:-left-[42px] top-6 w-8 h-8 rounded-full bg-[var(--background)] border-4 border-primary shadow-[0_0_15px_rgba(0,210,255,0.4)] z-10 flex items-center justify-center">
                 <div className="w-2 h-2 rounded-full bg-[var(--text-main)] animate-pulse" />
              </div>

              {/* Session Card */}
              <div className={`glass rounded-[2.5rem] border transition-all duration-500 ${expandedId === session.id ? 'border-primary/30 bg-primary/[0.02]' : 'border-[var(--card-border)] bg-[var(--card-bg)] hover:border-primary/20 shadow-xl'}`}>
                <div className="p-8 space-y-6">
                  {/* Top Info */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest flex items-center gap-1.5">
                                <Calendar className="w-3 h-3" />
                                {truncateDate(session.date)}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-[var(--card-border)]" />
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${session.type === 'HR Practice' ? 'text-secondary' : 'text-primary'}`}>{session.type}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">{session.topic}</h3>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right">
                             <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-1">Impact Score</p>
                             <div className={`px-4 py-1.5 rounded-full border text-lg font-black tracking-tighter ${getScoreColor(session.score)}`}>
                                {session.score}%
                             </div>
                        </div>
                        <div className="hidden md:block text-right">
                             <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-1">Duration</p>
                             <div className="flex items-center gap-2 text-[var(--text-main)] font-bold">
                                <Clock className="w-4 h-4 text-[var(--text-muted)]" />
                                {session.duration}
                             </div>
                        </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex gap-4">
                        <button 
                            onClick={() => setExpandedId(expandedId === session.id ? null : session.id)}
                            className="flex items-center gap-2 text-xs font-bold text-primary hover:underline underline-offset-4 transition-all"
                        >
                            <Cpu className="w-4 h-4" />
                            {expandedId === session.id ? 'Hide Deep Analysis' : 'Analyze Responses'}
                            <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${expandedId === session.id ? 'rotate-180' : ''}`} />
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <button 
                             onClick={() => navigate('/dashboard/recommendations')}
                            className="p-3 rounded-2xl bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--card-border)] hover:border-primary/20 transition-all"
                        >
                             <History className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => navigate(session.type === 'HR Practice' ? '/dashboard/hr-practice' : '/dashboard/mock-interview')}
                            className="px-6 py-3 rounded-2xl bg-[var(--text-main)] text-[var(--background)] font-bold text-xs flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Retry
                        </button>
                      </div>
                  </div>

                  {/* Expandable Content */}
                  <AnimatePresence>
                    {expandedId === session.id && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-8 space-y-8">
                                {session.questions.map((q, qIndex) => (
                                    <div key={qIndex} className="space-y-4">
                                        {/* Question Bubble */}
                                        <div className="flex justify-start">
                                            <div className="glass p-5 rounded-[1.5rem] rounded-tl-none border-[var(--card-border)] max-w-[85%] relative bg-[var(--card-bg)] shadow-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <MessageSquare className="w-3 h-3 text-primary opacity-50" />
                                                    <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">Question {qIndex + 1}</span>
                                                </div>
                                                <p className="text-sm font-semibold text-[var(--text-main)] italic">"{q.q}"</p>
                                            </div>
                                        </div>

                                        {/* User Answer & AI Feedback */}
                                        <div className="pl-6 space-y-4 border-l-2 border-[var(--card-border)] ml-4">
                                            <div className="space-y-2">
                                                <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest opacity-60">Your Response</p>
                                                <p className="text-sm text-[var(--text-muted)] font-medium leading-relaxed italic">{q.a}</p>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                                                <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                <div className="space-y-1">
                                                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest italic">AI Feedback Intelligence</p>
                                                    <p className="text-xs text-[var(--text-main)] font-medium leading-relaxed opacity-80">{q.feedback}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                <History className="w-12 h-12 text-[var(--text-muted)] opacity-30" />
                <h3 className="text-xl font-bold text-[var(--text-main)]">No History Yet</h3>
                <p className="text-sm text-[var(--text-muted)]">Complete a mock interview to see your growth timeline.</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Milestone Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-12">
          {[
              { label: "Total Mocks", val: stats.totalMocks, icon: Target, color: "text-primary" },
              { label: "Total Practice", val: stats.totalPractice, icon: MessageSquare, color: "text-secondary" },
              { label: "Avg. Score", val: `${stats.avgScore}%`, icon: CheckCircle2, color: "text-green-500" },
              { label: "Prep Days", val: stats.prepDays, icon: Flag, color: "text-red-500" }
          ].map((stat, i) => (
              <div key={i} className="glass p-6 rounded-[2rem] border border-[var(--card-border)] flex flex-col items-center text-center gap-2 shadow-lg">
                  <div className={`p-3 rounded-xl bg-[var(--card-bg)] ${stat.color}`}>
                        <stat.icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-2xl font-black text-[var(--text-main)]">{loading ? '...' : stat.val}</h4>
                  <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">{stat.label}</p>
              </div>
          ))}
      </div>
    </div>
  );
};

export default InterviewHistoryPage;
