import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Brain, 
  Target, 
  TrendingUp, 
  Calendar, 
  Download, 
  ChevronDown, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  Star,
  Users,
  Clock,
  ExternalLink,
  Layers,
  BarChart3,
  PieChart as PieIcon,
  LineChart as LineIcon
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, LineChart, Line, Legend 
} from 'recharts';
import toast from 'react-hot-toast';

import { useAnalyticsStore } from '../store/useAnalyticsStore';

const AdminAnalytics = () => {
  const { analytics, isLoading, lastSync, fetchAnalytics } = useAnalyticsStore();
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchAnalytics(dateRange);
  }, [fetchAnalytics, dateRange]);

  const getTimeAgo = (date) => {
    if (!date) return 'Never';
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
  };
  
  const handleRangeChange = (range) => {
    setDateRange(range);
    setIsRangeOpen(false);
  };

  const handleExport = () => {
    setIsExporting(true);
    try {
        const report = [
            ["PLATFORM INTELLIGENCE REPORT"],
            [`Generated: ${new Date().toLocaleString()}`],
            [`Window: ${dateRange}`],
            [],
            ["KEY PERFORMANCE INDICATORS"],
            ["Metric", "Value"],
            ["Total Questions", analytics.kpis.totalQuestions],
            ["Total Evaluations", analytics.kpis.totalEvaluations],
            ["Accuracy Benchmark", analytics.kpis.avgAccuracy + "%"],
            [],
            ["DOMAIN PERFORMANCE"],
            ["Domain", "Engagement Score"],
            ...(analytics.domainDistribution.map(d => [d.name, d.value])),
            [],
            ["AI ORCHESTRATION TELEMETRY"],
            ["Avg Latency", analytics.aiOrchestration.latency + "ms"],
            ["Eval Accuracy", analytics.aiOrchestration.accuracy + "%"],
            ["Efficiency", analytics.aiOrchestration.efficiency + "%"]
        ];

        const csvContent = "data:text/csv;charset=utf-8," + report.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `intelligence_report_${dateRange.toLowerCase().replace(/ /g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Intelligence report exported successfully');
    } catch (error) {
        toast.error('Export fail: Data sequence incomplete');
    } finally {
        setTimeout(() => setIsExporting(false), 1000);
    }
  };

  return (
    <div className="space-y-12 pb-32">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
            >
                <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-semibold text-primary uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-3 h-3" />
                    {(!analytics && isLoading) ? 'Initializing Neural Core...' : isLoading ? 'Refreshing Telemetry...' : 'Telemetrics Active'}
                </span>
                <span className="text-gray-600 font-semibold text-xs uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Last Sync: {getTimeAgo(lastSync)}
                </span>
            </motion.div>
            <h1 className="text-5xl font-semibold text-[var(--text-main)] tracking-tighter italic leading-none">Intelligence <span className="text-primary italic">Hub</span></h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
             <div className="relative group">
                <button 
                    onClick={() => setIsRangeOpen(!isRangeOpen)}
                    className="px-6 py-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-main)] font-semibold text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-white/10 transition-all min-w-[200px] justify-between"
                >
                    <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-primary" />
                        {dateRange}
                    </div>
                    <ChevronDown className={`w-4 h-4 opacity-50 transition-transform ${isRangeOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {isRangeOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-0 right-0 mt-3 p-2 bg-[var(--sidebar-bg)] border border-[var(--card-border)] rounded-2xl shadow-2xl z-50 backdrop-blur-xl"
                        >
                            {['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'All Time'].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => handleRangeChange(range)}
                                    className={`w-full text-left p-3 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all hover:bg-primary/10 hover:text-primary ${dateRange === range ? 'text-primary bg-primary/5' : 'text-gray-400'}`}
                                >
                                    {range}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
             </div>
             <button 
                onClick={handleExport}
                disabled={!analytics || isLoading}
                className={`px-8 py-4 rounded-2xl font-semibold text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-xl ${isExporting ? 'bg-green-500 text-black' : 'bg-[var(--text-main)] text-[var(--background)] hover:scale-105 disabled:opacity-50'}`}
             >
                {isExporting ? <ShieldCheck className="w-5 h-5 shadow-lg" /> : <Download className="w-5 h-5 shadow-lg" />}
                {isExporting ? 'Report Compiled' : 'Export Intelligence'}
             </button>
        </div>
      </div>

      {/* Intelligence KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "AI Questions Generated", val: analytics?.kpis?.totalQuestions || 0, icon: Brain, color: "text-primary", bg: "bg-primary/10", trend: "+24%" },
          { label: "Answer Evaluations", val: analytics?.kpis?.totalEvaluations || 0, icon: Target, color: "text-purple-500", bg: "bg-purple-500/10", trend: "+18%" },
          { label: "Quantum Credits Used", val: (analytics?.kpis?.totalQuestions * 12) || 0, icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10", trend: "+12%" },
          { label: "Avg Platform Accuracy", val: (analytics?.kpis?.avgAccuracy || 0) + "%", icon: Star, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "+2.1%" },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-[2.5rem] border border-[var(--card-border)] space-y-4 group hover:border-primary/20 transition-all"
          >
            <div className="flex justify-between items-start">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                </div>
                {!isLoading && <span className="text-green-500 text-[10px] font-semibold bg-green-500/10 px-2 py-1 rounded-lg">{stat.trend}</span>}
            </div>
            <div className="space-y-1">
              <h4 className="text-3xl font-semibold text-[var(--text-main)]">
                {(!analytics && isLoading) ? <span className="inline-block w-20 h-8 bg-white/5 animate-pulse rounded-lg" /> : stat.val}
              </h4>
              <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest leading-none">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Weekly AI Pulse */}
        <div className="lg:col-span-2 glass rounded-[3rem] p-10 border border-white/5 space-y-8 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10 group-hover:bg-primary/10 transition-all" />
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-[var(--text-main)] tracking-tight flex items-center gap-3">
                        <LineIcon className="w-5 h-5 text-primary" />
                        Weekly Intelligence Pulse
                    </h2>
                    <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-widest">Questions generated vs Evaluations performed</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">Generations</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">Evaluations</span>
                    </div>
                </div>
            </div>
            <div className="h-[350px] w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics?.usageData || []}>
                        <defs>
                            <linearGradient id="questionGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00d2ff" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#00d2ff" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="evalGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                        <XAxis dataKey="name" stroke="#4b5563" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis hide />
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                            itemStyle={{ fontSize: '12px', fontWeight: 'semibold', textTransform: 'uppercase' }}
                        />
                        <Area type="monotone" dataKey="questions" stroke="#00d2ff" strokeWidth={4} fillOpacity={1} fill="url(#questionGrad)" />
                        <Area type="monotone" dataKey="evaluations" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#evalGrad)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Category Engagement */}
        <div className="glass rounded-[3rem] p-10 border border-white/5 flex flex-col items-center relative overflow-hidden">
             <div className="w-full space-y-1">
                <h2 className="text-xl font-semibold text-[var(--text-main)] flex items-center gap-3">
                    <PieIcon className="w-5 h-5 text-secondary" />
                    Domain Distribution
                </h2>
                <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-widest">Most engaged technical categories</p>
            </div>
            <div className="h-[300px] w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={analytics?.domainDistribution || []}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                        >
                            {(analytics?.domainDistribution || []).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={['#00d2ff', '#7c3aed', '#ec4899', '#f59e0b'][index % 4]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '12px' }}
                            itemStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'semibold' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full mt-4">
                {(analytics?.domainDistribution || []).map((t, index) => (
                    <div key={t.name} className="flex items-center gap-2 p-3 rounded-2xl bg-black/5 border border-[var(--card-border)]">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#00d2ff', '#7c3aed', '#ec4899', '#f59e0b'][index % 4] }} />
                        <span className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest truncate">{t.name}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Secondary Data Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Difficulty Distribution */}
        <div className="glass rounded-[3rem] p-10 border border-[var(--card-border)] space-y-8">
            <div className="space-y-1">
                <h2 className="text-xl font-semibold text-[var(--text-main)] flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Complexity Equilibrium
                </h2>
                <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest">User preference by difficulty level</p>
            </div>
            <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics?.difficultyData || []}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                        <XAxis dataKey="level" stroke="#4b5563" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis hide />
                        <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ backgroundColor: 'var(--background)', border: 'none' }} />
                        <Bar 
                            dataKey="value" 
                            radius={[12, 12, 0, 0]}
                            fill="url(#diffGrad)"
                        >
                            {(analytics?.difficultyData || []).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={['#10b981', '#00d2ff', '#f43f5e', '#7c3aed'][index % 4]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="p-6 rounded-2xl bg-black/5 border border-[var(--card-border)] flex items-center justify-between">
                <div className="flex gap-3 items-center">
                    <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                        <TrendingUp className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest">Primary Constraint: <span className="text-[var(--text-main)]">'Expert' growth +12.4%</span></p>
                </div>
            </div>
        </div>

        {/* Retention Area Chart */}
        <div className="glass rounded-[3rem] p-10 border border-[var(--card-border)] space-y-8 relative overflow-hidden group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-secondary/5 rounded-full blur-[100px] -z-10 group-hover:bg-secondary/10 transition-all opacity-50" />
            <div className="space-y-1">
                <h2 className="text-xl font-semibold text-[var(--text-main)] flex items-center gap-3">
                    <Users className="w-5 h-5 text-secondary" />
                    Session Retention Index
                </h2>
                <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest">User persistence over 6 month trajectory</p>
            </div>
            <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics?.retentionData || []}>
                        <defs>
                            <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                        <XAxis dataKey="month" stroke="#4b5563" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#4b5563" fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #222', borderRadius: '12px' }} />
                        <Area type="stepAfter" dataKey="rate" stroke="#7c3aed" strokeWidth={4} fill="url(#retentionGrad)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
             <p className="text-center text-[10px] text-gray-600 font-semibold uppercase tracking-widest italic">
                {analytics?.retentionData?.[5]?.rate >= 90 ? 'High historical retention peak detected' : 'Analyzing user persistence trajectory'}
             </p>
        </div>
      </div>

      {/* Advanced Detailed Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="glass rounded-[3rem] p-10 border border-[var(--card-border)] space-y-8">
                <h2 className="text-xl font-semibold text-[var(--text-main)] flex items-center gap-3">
                    <Brain className="w-5 h-5 text-primary" />
                    Cognitive Weak-Point Analysis
                </h2>
                <div className="space-y-4">
                    {(analytics?.weakPoints || []).map((item, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-black/5 border border-[var(--card-border)] flex items-center justify-between group hover:bg-black/10 transition-all">
                             <div className="flex gap-5 items-center">
                                 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs border border-primary/20">
                                     0{i+1}
                                 </div>
                                 <div className="space-y-1">
                                     <p className="text-xs font-semibold text-[var(--text-main)] truncate max-w-[200px]">{item.topic}</p>
                                     <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest">{item.count} attempts analyzed</p>
                                 </div>
                             </div>
                             <div className="text-right">
                                 <p className="text-xs font-semibold text-red-500">{item.score}</p>
                                 <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-widest">Avg. Score</p>
                             </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass rounded-[3rem] p-10 border border-[var(--card-border)] space-y-8">
                <h2 className="text-xl font-semibold text-[var(--text-main)] flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-secondary" />
                    AI Orchestration Intelligence
                </h2>
                <div className="grid grid-cols-2 gap-6">
                    <div className="p-8 rounded-[2rem] bg-secondary/5 border border-secondary/10 space-y-4">
                        <div className="flex items-center gap-3">
                            <Layers className="w-5 h-5 text-secondary" />
                            <p className="text-[10px] text-secondary font-semibold uppercase tracking-widest">Model Latency</p>
                        </div>
                        <h3 className="text-4xl font-semibold text-[var(--text-main)] tracking-tighter italic">
                            {analytics?.aiOrchestration?.latency || 0}<span className="text-xs text-[var(--text-muted)] not-italic ml-2 font-semibold">ms</span>
                        </h3>
                        <div className="w-full h-1.5 bg-secondary/10 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(analytics?.aiOrchestration?.latency / 500) * 100}%` }}
                                className="h-full bg-secondary shadow-[0_0_10px_rgba(124,58,237,0.5)]" 
                            />
                        </div>
                        <p className="text-[9px] text-[var(--text-muted)] font-semibold uppercase tracking-widest">Optimization: {analytics?.aiOrchestration?.efficiency || 0}% Efficiency</p>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-primary/5 border border-primary/10 space-y-4">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            <p className="text-[10px] text-primary font-semibold uppercase tracking-widest">Eval Accuracy</p>
                        </div>
                        <h3 className="text-4xl font-semibold text-[var(--text-main)] tracking-tighter italic">
                            {analytics?.aiOrchestration?.accuracy || 0}<span className="text-xs text-[var(--text-muted)] not-italic ml-2 font-semibold">%</span>
                        </h3>
                        <div className="w-full h-1.5 bg-primary/10 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${analytics?.aiOrchestration?.accuracy}%` }}
                                className="h-full bg-primary shadow-[0_0_10px_rgba(0,210,255,0.5)]" 
                            />
                        </div>
                        <p className="text-[9px] text-[var(--text-muted)] font-semibold uppercase tracking-widest">Benchmark: Superior Level</p>
                    </div>
                </div>
                <div className="p-8 rounded-[2rem] bg-black/5 border border-[var(--card-border)] flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest">Single-Model Orchestration</p>
                        <p className="text-xs font-semibold text-[var(--text-main)]">
                            {analytics?.aiOrchestration?.tokenDistribution?.primary || "GPT-4o Mini"} ({analytics?.aiOrchestration?.tokenDistribution?.percentage || 100}%)
                        </p>
                    </div>
                    <button className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-gray-500 hover:text-[var(--text-main)] transition-all">
                        <Cpu className="w-5 h-5 text-primary" />
                    </button>
                </div>
            </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
