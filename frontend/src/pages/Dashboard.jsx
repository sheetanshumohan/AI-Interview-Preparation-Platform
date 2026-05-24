import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Clock, Star, BrainCircuit, Target, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';

const iconMap = {
  TrendingUp: TrendingUp,
  BrainCircuit: BrainCircuit,
  CheckCircle2: CheckCircle2,
  Star: Star,
  Clock: Clock
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/user/dashboard');
        if (response.data.success) {
          setData(response.data.dashboard);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="p-4 rounded-full border-4 border-primary border-t-transparent"
        />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-semibold text-[var(--text-main)] tracking-tight"
          >
            Welcome back, <span className="text-primary italic">{data.user.name}!</span>
          </motion.h1>
          <p className="text-[var(--text-muted)] font-semibold text-sm mt-1">Here's your interview preparation progress for this week.</p>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xl"
        >
          <div className="p-2 bg-primary/10 rounded-xl">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-semibold">Current Goal</p>
            <p className="text-sm text-[var(--text-main)] font-semibold italic">Crack {data.user.role || 'Senior MERN'} Role</p>
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.stats.map((stat, i) => {
          const Icon = iconMap[stat.icon] || TrendingUp;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative glass p-6 rounded-3xl border border-[var(--card-border)] hover:border-primary/20 transition-all hover:translate-y-[-4px]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <Sparkles className="w-4 h-4 text-white/10 group-hover:text-primary transition-colors" />
              </div>
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-1">{stat.label}</p>
              <h3 className="text-3xl font-semibold text-[var(--text-main)]">{stat.value}</h3>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 glass rounded-[2.5rem] p-8 border border-[var(--card-border)] shadow-2xl"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-[var(--text-main)] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Performance Insight
            </h2>
            <select className="bg-[var(--card-bg)] border border-[var(--card-border)] text-xs text-[var(--text-muted)] font-semibold rounded-xl px-4 py-2 outline-none focus:ring-1 ring-primary/50">
              <option>Last 6 Months</option>
              <option>Last Month</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.performanceData}>
                <defs>
                  <linearGradient id="colorScoreDashboard" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d2ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00d2ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--card-border)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--sidebar-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: 'var(--primary)' }}
                />
                <Area type="monotone" dataKey="score" stroke="#00d2ff" strokeWidth={4} fillOpacity={1} fill="url(#colorScoreDashboard)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-[2.5rem] p-8 border border-[var(--card-border)] shadow-2xl"
        >
          <h2 className="text-xl font-semibold text-[var(--text-main)] flex items-center gap-2 mb-8">
            <Clock className="w-5 h-5 text-secondary" />
            Recent Activity
          </h2>
          <div className="space-y-6">
            {data.recentActivity.length > 0 ? (
              data.recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:bg-black/5 transition-all group">
                  <div className={`w-2 h-2 rounded-full mt-1.5 transition-shadow group-hover:shadow-[0_0_10px_rgba(0,210,255,1)] ${activity.type === 'Interview' ? 'bg-primary' : activity.type === 'Resume' ? 'bg-secondary' : 'bg-accent'}`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-xs font-semibold text-[var(--text-main)] group-hover:text-primary transition-colors">{activity.label}</p>
                      {activity.score && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-semibold">{activity.score}</span>}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-[var(--text-muted)] font-semibold">{activity.time}</p>
                      <p className="text-[10px] text-[var(--text-muted)] font-semibold italic opacity-60">{activity.status}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-[var(--text-muted)]">No recent activity yet.</p>
              </div>
            )}
          </div>
          <button 
            onClick={() => navigate('/dashboard/history')}
            className="w-full mt-8 py-3 rounded-xl border border-[var(--card-border)] text-[var(--text-muted)] text-xs font-semibold hover:bg-black/5 hover:text-[var(--text-main)] transition-all"
          >
            View All History
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
