import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Target, 
  Download, 
  BrainCircuit, 
  Lightbulb, 
  Search, 
  AlertCircle,
  MoreHorizontal,
  ArrowRight,
  Code2,
  Cpu,
  Bookmark,
  FileText,
  X
} from 'lucide-react';
import axios from '../lib/axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ResumeAnalysisPage = () => {
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDetailedModalOpen, setIsDetailedModalOpen] = useState(false);
  const [isRoadmapModalOpen, setIsRoadmapModalOpen] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/user/analysis');
        if (response.data.success) {
          setAnalysis(response.data.analysis);
        }
      } catch (err) {
        console.error('Error fetching analysis:', err);
        setError('Failed to load analysis. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  const downloadPDFReport = () => {
    if (!analysis) return;

    const doc = new jsPDF();
    const bgColor = [10, 10, 12];
    const accentColor = [168, 85, 247]; // Primary

    // Header
    doc.setFillColor(...bgColor);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('PREP AI - RESUME ANALYSIS REPORT', 15, 25);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 32);

    // Score
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text(`Overall ATS Score: ${analysis.score}%`, 15, 55);

    // Strengths
    doc.setFontSize(12);
    doc.text('Key Strengths:', 15, 70);
    doc.setFontSize(10);
    doc.text(analysis.strengths.slice(0, 8).join(', '), 15, 78, { maxWidth: 180 });

    // Optimization Table
    autoTable(doc, {
      startY: 90,
      head: [['Keyword', 'Current', 'Benchmark', 'Potential Improvement']],
      body: analysis.keywordOptimization.map(row => [row.k, row.f, row.s, row.i]),
      headStyles: { fillColor: accentColor },
    });

    // Detailed Section Analysis
    const sections = Object.entries(analysis.detailedAnalysis).map(([key, val]) => [
      key.toUpperCase(),
      `${val.score}%`,
      val.feedback
    ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [['Section', 'Score', 'Feedback']],
      body: sections,
      headStyles: { fillColor: [50, 50, 50] },
    });

    // Roadmap
    doc.setFontSize(14);
    doc.text('Recommended Action Roadmap:', 15, doc.lastAutoTable.finalY + 20);
    doc.setFontSize(10);
    analysis.featuredImprovement.roadmap.forEach((step, i) => {
      doc.text(`${i + 1}. ${step}`, 15, doc.lastAutoTable.finalY + 30 + (i * 10), { maxWidth: 180 });
    });

    doc.save('PrepAI_Resume_Analysis.pdf');
  };

  const handleToggleChecklist = async (index) => {
    try {
      // Optimistic Update
      const updatedChecklist = [...analysis.checklist];
      updatedChecklist[index].completed = !updatedChecklist[index].completed;
      setAnalysis({ ...analysis, checklist: updatedChecklist });

      const response = await axios.patch(`/user/analysis/checklist/${index}`);
      if (!response.data.success) {
        throw new Error('Failed to update checklist');
      }
    } catch (err) {
      console.error('Error toggling checklist:', err);
      toast.error('Failed to update progress');
      // Revert on error
      const response = await axios.get('/user/analysis');
      if (response.data.success) setAnalysis(response.data.analysis);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="p-4 rounded-full border-4 border-primary border-t-transparent"
        />
        <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-[10px]">Analyzing your profile...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <div className="p-8 rounded-[3rem] bg-white/5 border border-white/10">
          <FileText className="w-16 h-16 text-[var(--text-muted)] opacity-20 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[var(--text-main)] mb-2">No Resume Found</h2>
          <p className="text-[var(--text-muted)] max-w-sm mx-auto">Upload your resume on the Profile page to see a detailed ATS analysis and keyword optimization report.</p>
        </div>
        <button 
          onClick={() => window.location.href = '/dashboard/profile'}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-secondary text-black font-bold shadow-xl hover:scale-105 transition-transform"
        >
          Go to Profile
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header / Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-[3rem] p-10 border border-[var(--card-border)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10" />
        
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* ATS Score Circle */}
          <div className="relative w-48 h-48 shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-[var(--card-border)]"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                stroke="url(#atsGradient)"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={552.92}
                initial={{ strokeDashoffset: 552.92 }}
                animate={{ strokeDashoffset: 552.92 - (552.92 * analysis.score) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="atsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00d2ff" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-[var(--text-main)] italic">{analysis.score}</span>
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">ATS Score</span>
            </div>
          </div>

          <div className="flex-1 text-center lg:text-left space-y-4">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <h1 className="text-4xl font-semibold text-[var(--text-main)] tracking-tight">Your Resume is <span className="text-primary italic">AI-Ready</span></h1>
              <span className={`px-4 py-1.5 rounded-full ${analysis.score > 80 ? 'bg-green-500/10 border border-green-500/20 text-green-500' : 'bg-amber-500/10 border border-amber-500/20 text-amber-500'} text-[10px] font-bold uppercase tracking-widest`}>
                {analysis.score > 80 ? 'Mastery Phase' : 'Growth Phase'}
              </span>
            </div>
            <p className="text-[var(--text-muted)] font-medium max-w-2xl">We've analyzed your profile against 5,000+ top-tier job descriptions. Your current match rate is high, but a few keyword optimizations can push you to the top 1%.</p>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <button 
                onClick={downloadPDFReport}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-secondary text-black font-bold shadow-xl flex items-center gap-2 hover:scale-105 transition-transform active:scale-95"
              >
                <Download className="w-5 h-5" />
                Download PDF Report
              </button>
              <button 
                onClick={() => setIsDetailedModalOpen(true)}
                className="px-8 py-3.5 rounded-2xl bg-[var(--card-bg)] text-[var(--text-main)] font-bold border border-[var(--card-border)] hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <MoreHorizontal className="w-5 h-5" />
                Detailed View
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Detected vs Missing Skills */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatsCard title="Detected Strengths" icon={CheckCircle2} color="text-green-500">
              <div className="flex flex-wrap gap-2">
                {analysis.strengths.map(s => (
                  <span key={s} className="px-3 py-1.5 rounded-full bg-green-500/5 border border-green-500/10 text-green-500 text-xs font-bold">{s}</span>
                ))}
              </div>
            </StatsCard>
            <StatsCard title="Missing Keywords" icon={XCircle} color="text-red-500">
              <div className="flex flex-wrap gap-2">
                {analysis.missingKeywords.map(s => (
                  <span key={s} className="px-3 py-1.5 rounded-full bg-red-500/5 border border-red-500/10 text-red-500 text-xs font-bold">{s}</span>
                ))}
              </div>
            </StatsCard>
          </div>

          {/* Keyword Optimization Table */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.98 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="glass rounded-[2.5rem] p-8 border border-[var(--card-border)] overflow-hidden"
          >
            <h2 className="text-xl font-bold text-[var(--text-main)] mb-6 flex items-center gap-3">
                <Search className="w-5 h-5 text-primary" />
                Keyword Optimization
            </h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold border-b border-[var(--card-border)]">
                            <th className="pb-4">Keyword</th>
                            <th className="pb-4">Frequency</th>
                            <th className="pb-4">Market Standard</th>
                            <th className="pb-4">Improvement</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-medium">
                        {analysis.keywordOptimization.map((row, i) => (
                            <tr key={i} className="border-b border-white/[0.03] group hover:bg-white/[0.01] transition-colors">
                                <td className="py-5 text-[var(--text-main)]">{row.k}</td>
                                <td className="py-5 text-[var(--text-muted)]">{row.f}</td>
                                <td className="py-5 text-[var(--text-muted)]">{row.s}</td>
                                <td className="py-5">
                                    <span className="text-primary bg-primary/10 px-2 py-1 rounded-lg text-[10px] font-bold">{row.i}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar: Featured Project & Checklist */}
        <div className="space-y-8">
           {/* Featured Project */}
           <motion.div 
            whileHover={{ y: -5 }}
            className="glass rounded-[3rem] p-8 border border-white/5 bg-gradient-to-br from-primary/[0.03] to-secondary/[0.03] relative overflow-hidden group"
          >
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Code2 className="w-20 h-20 text-white" />
             </div>
             <h3 className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-2 mb-4">
               <Lightbulb className="w-4 h-4" />
               Featured Improvement
             </h3>
             <div className="space-y-4">
                <h2 className="text-xl font-bold text-[var(--text-main)]">{analysis.featuredImprovement.title}</h2>
                <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">{analysis.featuredImprovement.description}</p>
                <div className="h-1 w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${analysis.featuredImprovement.progress}%` }}
                      className="h-full bg-secondary" 
                    />
                </div>
                <button 
                  onClick={() => setIsRoadmapModalOpen(true)}
                  className="w-full py-3 rounded-xl bg-[var(--card-bg)] text-[var(--text-main)] border border-[var(--card-border)] font-bold text-xs hover:bg-black/5 transition-all flex items-center justify-center gap-2"
                >
                    View Project Roadmap
                    <ArrowRight className="w-4 h-4" />
                </button>
             </div>
           </motion.div>

           {/* Checklist */}
           <div className="glass rounded-[3rem] p-8 border border-[var(--card-border)] space-y-6">
              <h3 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Preparation Checklist
              </h3>
              <div className="space-y-4">
                 {analysis.checklist.map((item, i) => (
                    <div 
                      key={i} 
                      onClick={() => handleToggleChecklist(i)}
                      className="flex items-start gap-4 group cursor-pointer"
                    >
                        <div className={`mt-0.5 p-0.5 rounded-md border transition-colors ${item.completed ? 'bg-primary/20 border-primary text-primary' : 'bg-transparent border-[var(--card-border)] text-transparent'}`}>
                           <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <span className={`text-xs font-semibold transition-all ${item.completed ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-main)] group-hover:text-primary'}`}>{item.text}</span>
                    </div>
                 ))}
              </div>
              <div className="pt-4">
                 <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">Next Milestone</p>
                        <p className="text-sm text-[var(--text-main)] font-bold italic">Score 95+</p>
                    </div>
                    <Target className="w-5 h-5 text-primary opacity-30" />
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isDetailedModalOpen && (
          <Modal title="Detailed Analysis" onClose={() => setIsDetailedModalOpen(false)}>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(analysis.detailedAnalysis).map(([key, data]) => (
                  <div key={key} className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                       <h4 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-widest">{key}</h4>
                       <span className={`text-xs font-bold ${data.score > 70 ? 'text-green-500' : 'text-amber-500'}`}>{data.score}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${data.score}%` }}
                        className={`h-full ${data.score > 70 ? 'bg-green-500' : 'bg-amber-500'}`} 
                       />
                    </div>
                    <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">{data.feedback}</p>
                  </div>
                ))}
             </div>
          </Modal>
        )}

        {isRoadmapModalOpen && (
          <Modal title="AI Success Roadmap" onClose={() => setIsRoadmapModalOpen(false)}>
             <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-primary/10 border border-primary/20">
                   <h3 className="text-primary font-bold mb-2">Primary Goal: {analysis.featuredImprovement.title}</h3>
                   <p className="text-xs text-[var(--text-muted)] leading-relaxed">{analysis.featuredImprovement.description}</p>
                </div>
                <div className="space-y-4">
                   {analysis.featuredImprovement.roadmap.map((step, i) => (
                      <div key={i} className="flex gap-4 group">
                         <div className="w-8 h-8 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center shrink-0 text-xs font-bold text-primary group-hover:scale-110 transition-transform">
                            {i + 1}
                         </div>
                         <div className="py-1">
                            <p className="text-sm text-[var(--text-main)] font-semibold leading-relaxed">{step}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

const Modal = ({ title, onClose, children }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-black/40"
  >
    <motion.div 
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      className="w-full max-w-2xl glass rounded-[3rem] border border-white/10 shadow-3xl overflow-hidden"
    >
      <div className="p-8 border-b border-white/5 flex items-center justify-between">
         <h2 className="text-xl font-bold text-[var(--text-main)]">{title}</h2>
         <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-[var(--text-muted)] hover:text-white transition-all">
            <X className="w-5 h-5" />
         </button>
      </div>
      <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
         {children}
      </div>
    </motion.div>
  </motion.div>
);

const StatsCard = ({ title, icon: Icon, children, color }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="glass rounded-[2.5rem] p-8 border border-[var(--card-border)] space-y-6 bg-white/[0.01]"
  >
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-widest flex items-center gap-2">
        <Icon className={`w-4 h-4 ${color}`} />
        {title}
      </h3>
      <div className={`w-2 h-2 rounded-full ${color.replace('text', 'bg')} animate-pulse`} />
    </div>
    {children}
  </motion.div>
);

export default ResumeAnalysisPage;
