import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Users, Clock, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/useThemeStore';

const data = [
  { name: 'Jan', score: 40 },
  { name: 'Feb', score: 55 },
  { name: 'Mar', score: 48 },
  { name: 'Apr', score: 70 },
  { name: 'May', score: 85 },
  { name: 'Jun', score: 92 },
];
const DashboardPreview = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <section className="py-20 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative glass rounded-[2rem] p-4 md:p-8 shadow-2xl overflow-hidden ring-1 ring-[var(--card-border)]"
        >
          {/* Dashboard Header */}
          <div className="flex items-center justify-between mb-8 border-b border-[var(--card-border)] pb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center border border-[var(--card-border)]">
                <LayoutDashboard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-[var(--text-main)] font-semibold">Interview Analytics</h3>
                <p className="text-xs text-[var(--text-muted)] font-semibold">Real-time performance tracking</p>
              </div>
            </div>
            <div className="flex gap-2 font-semibold">
              <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] text-primary font-semibold">LIVE</div>
              <div className="w-8 h-8 rounded-full bg-black/5 border border-[var(--card-border)]"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Mockup */}
            <div className="hidden lg:flex flex-col gap-4 col-span-1">
              {[
                { icon: TrendingUp, label: "Performance", active: true },
                { icon: Users, label: "Peer Comparison", active: false },
                { icon: Clock, label: "History", active: false },
                { icon: Star, label: "Achievements", active: false },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${item.active ? 'bg-primary/10 border border-primary/20 text-[var(--text-main)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-semibold">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Main Content Mockup */}
            <div className="col-span-1 lg:col-span-3 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-semibold">
                {[
                  { label: "Confidence", value: "92%", color: "#00d2ff" },
                  { label: "Clarity", value: "#a855f7", color: "#a855f7" },
                  { label: "Technical", value: "78%", color: "#3b82f6" },
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-black/5 border border-[var(--card-border)]">
                    <p className="text-xs text-[var(--text-muted)] mb-1 font-semibold">{stat.label}</p>
                    <p className="text-xl font-semibold text-[var(--text-main)]">{stat.value === "#a855f7" ? "85%" : stat.value}</p>

                    <div className="w-full h-1 bg-black/5 rounded-full mt-3 overflow-hidden">
                      <motion.div
                         initial={{ width: 0 }}
                         whileInView={{ width: stat.value === "#a855f7" ? "85%" : stat.value }}
                         transition={{ duration: 1.5, delay: 0.5 }}
                         className="h-full rounded-full"
                         style={{ backgroundColor: stat.color }}
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart Mockup */}
              <div className="h-[250px] w-full bg-black/5 border border-[var(--card-border)] rounded-2xl p-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00d2ff" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00d2ff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                    <XAxis dataKey="name" stroke={isDarkMode ? "#4b5563" : "#94a3b8"} fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDarkMode ? '#111' : '#fff',
                        border: `1px solid ${isDarkMode ? '#333' : '#e2e8f0'}`,
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                      itemStyle={{ color: '#00d2ff' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#00d2ff" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Link
            to="/register"
            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-[0_0_30px_rgba(0,210,255,0.4)] hover:shadow-[0_0_50px_rgba(0,210,255,0.6)] transition-all inline-flex items-center gap-3"
          >
            Start Your Free Trial
            <TrendingUp className="w-5 h-5" />
          </Link>
          <p className="mt-4 text-[var(--text-muted)] text-sm font-semibold">Join over 10,000+ candidates already preparing with PrepAI.</p>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardPreview;
