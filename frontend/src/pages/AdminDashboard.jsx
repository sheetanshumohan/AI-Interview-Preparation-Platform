import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminStore } from '../store/useAdminStore';
import { 
  Users, 
  FileText, 
  Video, 
  Star, 
  TrendingUp, 
  Activity, 
  Search, 
  MoreVertical, 
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Zap,
  Clock,
  Briefcase,
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { 
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie 
} from 'recharts';

const AnimatedCounter = ({ value, duration = 0.5 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = typeof value === 'string' ? parseInt(value.replace(/,/g, '')) : value;
    if (start === end || isNaN(end)) {
        setCount(end || 0);
        return;
    }

    let totalMiliseconds = duration * 1000;
    let incrementTime = Math.max((totalMiliseconds / end) * 5, 10);

    let timer = setInterval(() => {
      start += Math.ceil(end / 100);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { stats, fetchStats, isLoading } = useAdminStore();
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        fetchStats();
        // Refresh stats periodically
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, [fetchStats]);

    const handleDownload = () => {
        setIsDownloading(true);
        
        try {
            const reportData = [
                ["Platform Executive Report", new Date().toLocaleString()],
                ["======================"],
                ["KPI Metrics"],
                ["Total Users", stats.totalUsers],
                ["Total Interviews", stats.totalInterviews],
                ["Active Users", stats.activeUsers],
                ["Platform Success Rate", stats.successRate],
                [""],
                ["Sector-Wise Volume"],
                ...stats.sectorData.map(s => [s.sector, s.volume]),
                [""],
                ["Recent Activities"],
                ...stats.recentActivities.map(a => [new Date(a.time).toLocaleString(), a.user, a.detail])
            ];

            const csvContent = reportData.map(e => e.join(",")).join("\n");
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `executive_report_${new Date().getTime()}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setTimeout(() => setIsDownloading(false), 2000);
        } catch (error) {
            console.error('Export failed:', error);
            setIsDownloading(false);
        }
    };

    return (
        <div className="space-y-12 pb-32">
            {/* Welcome & Stats Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-2">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <span className="px-5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                             <Activity className={`w-3 h-3 ${isLoading ? 'animate-pulse' : ''}`} />
                             {(!stats.totalUsers && isLoading) ? 'Calibrating Neural Core...' : isLoading ? 'Refreshing Dynamic Pulse...' : 'Telemetrics Active'}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            Uptime: 99.98%
                        </span>
                    </motion.div>
                    <h1 className="text-5xl font-semibold text-[var(--text-main)] tracking-tighter italic leading-none">Command <span className="text-primary italic">Overview</span></h1>
                </div>

                 <div className="flex items-center gap-4">
                      <button 
                         onClick={handleDownload}
                         className={`px-8 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-3 shadow-2xl ${isDownloading ? 'bg-primary text-black' : 'bg-[var(--text-main)] text-[var(--background)] hover:scale-[1.02] active:scale-95'}`}
                      >
                         {isDownloading ? <CheckCircle2 className="w-4 h-4 animate-bounce" /> : <Download className="w-4 h-4" />}
                         {isDownloading ? 'Report Exported' : 'Export Executive Data'}
                      </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {[
                    { label: "Total Users", val: stats.totalUsers, icon: Users, color: "text-primary" },
                    { label: "Interviews", val: stats.totalInterviews, icon: Video, color: "text-purple-500" },
                    { label: "Active Nodes", val: stats.activeUsers, icon: Zap, color: "text-amber-500", animated: true },
                    { label: "Success Rate", val: stats.successRate, icon: Star, color: "text-fuchsia-500" },
                 ].map((kpi, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass bg-black/10 p-6 rounded-[2.5rem] border border-[var(--card-border)] space-y-3 group hover:border-primary/20 transition-all relative overflow-hidden"
                    >
                         <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <kpi.icon className="w-12 h-12 text-[var(--text-main)]" />
                         </div>
                         <div className={`p-3 w-fit rounded-xl bg-primary/5 ${kpi.color}`}>
                            <kpi.icon className="w-4 h-4" />
                         </div>
                         <div>
                            <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest">{kpi.label}</p>
                            <h4 className="text-2xl font-semibold text-[var(--text-main)] tracking-widest">
                                {(!stats.totalUsers && isLoading) ? <span className="inline-block w-16 h-8 bg-white/5 animate-pulse rounded-lg" /> : (typeof kpi.val === 'string' && kpi.val.includes('%')) ? kpi.val : <AnimatedCounter value={kpi.val} />}
                            </h4>
                         </div>
                    </motion.div>
                 ))}
            </div>

            {/* Main Analytics Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 {/* Monthly Growth Chart */}
                 <div className="lg:col-span-2 glass bg-black/10 rounded-[3rem] p-10 border border-[var(--card-border)] space-y-8 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10 group-hover:bg-primary/10 transition-all" />
                    <div className="flex items-center justify-between">
                         <div className="space-y-1">
                            <h2 className="text-xl font-semibold text-[var(--text-main)] tracking-tight flex items-center gap-3">
                                <Activity className="w-5 h-5 text-primary" />
                                Platform Expansion Velocity
                            </h2>
                            <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest">Monthly aggregation of active data nodes</p>
                         </div>
                         <div className="flex gap-2">
                             <span className="px-3 py-1 rounded-lg bg-green-500/10 text-green-500 text-[10px] font-semibold">+14.2%</span>
                         </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.growthData}>
                                <defs>
                                    <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00d2ff" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#00d2ff" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                <XAxis dataKey="name" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis hide />
                                 <Tooltip 
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #222', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }}
                                    itemStyle={{ color: '#00d2ff', fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="interactions" stroke="#00d2ff" strokeWidth={4} fillOpacity={1} fill="url(#growthGrad)" isAnimationActive={false} />
                                <Area type="monotone" dataKey="users" stroke="#7c3aed" strokeWidth={3} fill="transparent" isAnimationActive={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                 </div>

                 {/* Real-Time Activity Feed */}
                 <div className="glass bg-black/10 rounded-[3rem] p-10 border border-[var(--card-border)] space-y-8 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                         <h2 className="text-xl font-semibold text-white flex items-center gap-3 leading-none">
                            <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
                            Global Pulse
                         </h2>
                         <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                         </div>
                    </div>
                    
                    <div className="space-y-6 max-h-[400px] overflow-hidden">
                        <AnimatePresence mode="popLayout">
                            {stats.recentActivities.map((act) => (
                                <motion.div 
                                    key={act.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20, scale: 0.9 }}
                                    className="flex gap-4 p-4 rounded-[1.5rem] bg-black/[0.02] border border-[var(--card-border)] group hover:bg-black/[0.04] transition-all"
                                >
                                    <div className={`p-3 rounded-xl shrink-0 ${act.type === 'signup' ? 'bg-primary/10 text-primary' : 'bg-purple-500/10 text-purple-500'}`}>
                                        {act.type === 'signup' ? <Users className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs font-semibold text-[var(--text-main)] transition-colors">{act.user}</p>
                                            <span className="text-[9px] text-[var(--text-muted)] font-semibold uppercase tracking-tighter">
                                                {new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-[var(--text-muted)] font-medium leading-relaxed">{act.detail}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                    <button 
                        onClick={() => navigate('/admin/logs')}
                        className="w-full py-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/[0.05] transition-all"
                    >
                        View Complete Audit Log
                    </button>
                 </div>
            </div>

            {/* Topic & Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Popular Topics Simulation */}
                <div className="glass bg-black/10 rounded-[3rem] p-10 border border-[var(--card-border)] flex flex-col items-center">
                    <h2 className="text-xl font-semibold text-[var(--text-main)] self-start flex items-center gap-3">
                        <Star className="w-5 h-5 text-secondary" />
                        Engagement Categories
                    </h2>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.topicData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={10}
                                    dataKey="value"
                                    stroke="none"
                                    isAnimationActive={false}
                                >
                                    {stats.topicData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '12px' }}
                                    itemStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap gap-6 justify-center mt-4">
                        {stats.topicData.map(t => (
                            <div key={t.name} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                                <span className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest">{t.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Interview Activity Simulation */}
                <div className="glass bg-black/10 rounded-[3rem] p-10 border border-[var(--card-border)] space-y-8">
                     <h2 className="text-xl font-semibold text-[var(--text-main)] flex items-center gap-3">
                         <Briefcase className="w-5 h-5 text-blue-500" />
                         Sector-Wise Interview Volume
                     </h2>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.sectorData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                <XAxis dataKey="sector" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff', fontSize: '10px', textTransform: 'uppercase' }}
                                />
                                <Bar dataKey="volume" radius={[10, 10, 0, 0]} isAnimationActive={false}>
                                    {stats.sectorData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom System Health */}
            <div className="glass bg-black/10 rounded-[2rem] p-6 border border-[var(--card-border)] flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/20">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest">Global Encryption Node: <span className="text-[var(--text-main)]">Active (v2.4.1)</span></p>
                </div>
                <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        <span className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest">Core Status</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        <span className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest">Database Sync</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
