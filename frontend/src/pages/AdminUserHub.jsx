import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminStore } from '../store/useAdminStore';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  UserPlus, 
  MoreVertical, 
  ShieldAlert, 
  Eye, 
  Edit3, 
  History, 
  ChevronRight, 
  X,
  FileText,
  Target,
  Clock,
  ExternalLink,
  Crown,
  CheckCircle2,
  AlertCircle,
  Star
} from 'lucide-react';

const AdminUserHub = () => {
  const { users, stats, isLoading, fetchUsers, fetchStats, updateUserStatus, deleteUser, provisionUser } = useAdminStore();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisionForm, setProvisionForm] = useState({ name: '', email: '', password: '', role: 'Candidate' });
  const [provisionLoading, setProvisionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeStatus === 'All' || user.status === activeStatus;
    return matchesSearch && matchesStatus;
  });

  const toggleUserSelection = (id) => {
    setSelectedUsers(prev => prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]);
  };

  const handleExport = () => {
    setIsExporting(true);
    try {
        const headers = ["ID,Name,Email,Role,Status,Interviews,AvgScore,Joined"];
        const rows = users.map(u => 
            `${u.id},"${u.name}",${u.email},"${u.role}",${u.status},${u.interviews},${u.avgScore}%,${new Date(u.createdAt).toLocaleDateString()}`
        );
        const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `platform_users_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("User registry exported successfully");
    } catch (error) {
        toast.error("Export failed");
    } finally {
        setTimeout(() => setIsExporting(false), 1000);
    }
  };

  const openDrawer = (user) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user? This action is irreversible.")) {
        await deleteUser(id);
        if (selectedUser?.id === id) setIsDrawerOpen(false);
    }
  };

  const handleStatusToggle = async (user) => {
    const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    await updateUserStatus(user.id, newStatus);
  };

  const handleProvision = async (e) => {
    e.preventDefault();
    setProvisionLoading(true);
    const success = await provisionUser(provisionForm);
    if (success) {
        setIsProvisioning(false);
        setProvisionForm({ name: '', email: '', password: '', role: 'Candidate' });
    }
    setProvisionLoading(false);
  };

  return (
    <div className="space-y-10 pb-32">
      {/* Quick Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Platform Users", val: stats.totalUsers, icon: Users, color: "text-primary", bg: "bg-primary/10" },
          { label: "Active Contributors", val: stats.activeUsers, icon: CheckCircle2, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Interviews Performed", val: stats.totalInterviews, icon: Target, color: "text-purple-500", bg: "bg-purple-500/10" },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-[2.5rem] border border-[var(--card-border)] space-y-4 relative overflow-hidden"
          >
            <div className={`p-3 w-fit rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-3xl font-semibold text-[var(--text-main)]">
                {isLoading && stats.totalUsers === 0 ? (
                  <span className="inline-block w-12 h-8 bg-black/5 dark:bg-white/5 animate-pulse rounded-lg" />
                ) : (
                  stat.val
                )}
              </h4>
              <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest leading-none">{stat.label}</p>
            </div>
            {isLoading && stats.totalUsers === 0 && (
               <motion.div 
                 className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent"
                 animate={{ x: ['-100%', '100%'] }}
                 transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
               />
            )}
          </motion.div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative group w-full max-w-lg">
                  <div className="absolute -inset-0.5 bg-primary/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                  <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-primary transition-colors" />
                      <input 
                          type="text" 
                          placeholder="Search users by name, email or role..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-2xl py-4 pl-12 pr-4 text-xs font-semibold text-[var(--text-main)] outline-none focus:ring-1 ring-primary/30 transition-all"
                      />
                  </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                   <button 
                      onClick={handleExport}
                      className={`flex-1 md:flex-none px-6 py-4 rounded-2xl font-semibold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isExporting ? 'bg-green-500 text-black' : 'bg-[var(--card-bg)] text-[var(--text-main)] border border-[var(--card-border)] hover:bg-white/10'}`}
                   >
                        {isExporting ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                        {isExporting ? 'Exporting...' : 'Export CSV'}
                   </button>
                   <button 
                    onClick={() => setIsProvisioning(true)}
                    className="flex-1 md:flex-none px-6 py-4 rounded-2xl bg-primary text-black font-semibold text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(0,210,255,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-2">
                        <UserPlus className="w-4 h-4" />
                        Provision User
                   </button>
              </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-widest mr-2">Quick Filters:</span>
              <div className="w-[1px] h-6 bg-black/5 dark:bg-white/5 mx-2" />
              {['All', 'Active', 'Suspended'].map(status => (
                  <button 
                    key={status}
                    onClick={() => setActiveStatus(status)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-semibold uppercase tracking-widest transition-all border ${activeStatus === status ? 'bg-secondary/20 text-secondary border-secondary/30' : 'bg-black/5 dark:bg-white/5 text-gray-400 border-[var(--card-border)]'}`}
                  >
                    {status}
                  </button>
              ))}
          </div>
      </div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
          {selectedUsers.length > 0 && (
              <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-4"
              >
                  <div className="flex items-center gap-3 flex-1 overflow-hidden">
                      <div className="p-2 rounded-lg bg-amber-500/20">
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                      </div>
                      <p className="text-xs font-semibold text-amber-500 truncate">{selectedUsers.length} Users Selected for Bulk Operation</p>
                  </div>
                  <div className="flex gap-2">
                       <button className="px-4 py-2 rounded-xl bg-amber-500 text-black font-semibold text-[10px] uppercase tracking-widest transition-all hover:bg-amber-400">
                          Suspend Group
                       </button>
                       <button className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-[var(--text-main)] font-semibold text-[10px] uppercase tracking-widest hover:bg-black/10 dark:hover:bg-white/10 transition-all flex items-center gap-2">
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                       </button>
                       <button onClick={() => setSelectedUsers([])} className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10">
                          <X className="w-4 h-4 text-gray-500" />
                       </button>
                  </div>
              </motion.div>
          )}
      </AnimatePresence>

      {/* Global User Table */}
      <div className="glass bg-black/[0.02] dark:bg-white/[0.02] rounded-[3rem] border border-[var(--card-border)] overflow-hidden">
          <div className="overflow-x-auto">
            {isLoading && users.length === 0 ? (
                <div className="flex items-center justify-center py-32 flex-col gap-6">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-primary/20 animate-spin border-t-primary" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Users className="w-6 h-6 text-primary animate-pulse" />
                        </div>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-[0.3em] animate-pulse">Syncing User Universe...</p>
                </div>
            ) : (
                <table className="w-full">
                    <thead className="bg-black/5 dark:bg-white/[0.01]">
                        <tr>
                            <th className="px-8 py-5 text-left w-12">
                                <input 
                                    type="checkbox" 
                                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                    onChange={() => setSelectedUsers(selectedUsers.length === filteredUsers.length ? [] : filteredUsers.map(u => u.id))}
                                    className="w-4 h-4 rounded border-[var(--card-border)] bg-black/5 dark:bg-white/5 accent-primary outline-none" 
                                />
                            </th>
                            <th className="px-8 py-5 text-left text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-[0.2em]">Profile Architecture</th>
                            <th className="px-8 py-5 text-left text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-[0.2em]">Role Focus</th>
                            <th className="px-8 py-5 text-left text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-[0.2em]">Analytics</th>
                            <th className="px-8 py-5 text-left text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-[0.2em]">State</th>
                            <th className="px-8 py-5 text-right text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-[0.2em]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--card-border)]">
                        {filteredUsers.map(user => (
                            <tr 
                                key={user.id} 
                                onClick={(e) => {
                                    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
                                        openDrawer(user);
                                    }
                                }}
                                className="group hover:bg-primary/[0.02] cursor-pointer transition-all"
                            >
                                <td className="px-8 py-6">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => toggleUserSelection(user.id)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-4 h-4 rounded border-[var(--card-border)] bg-black/5 dark:bg-white/5 accent-primary outline-none" 
                                    />
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl overflow-hidden border border-[var(--card-border)] group-hover:border-primary/30 transition-colors shrink-0">
                                            <img src={user.avatar} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-semibold text-[var(--text-main)] truncate">{user.name}</p>
                                            <p className="text-[10px] text-[var(--text-muted)] font-semibold truncate tracking-tight">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">{user.role}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-6">
                                        <div className="space-y-1">
                                             <p className="text-[9px] text-gray-600 font-semibold uppercase tracking-widest">Interviews</p>
                                             <p className="text-xs font-semibold text-[var(--text-main)]">{user.interviews}</p>
                                        </div>
                                        <div className="space-y-1">
                                             <p className="text-[9px] text-gray-600 font-semibold uppercase tracking-widest">Avg. Score</p>
                                             <p className={`text-xs font-semibold ${user.avgScore >= 80 ? 'text-green-500' : 'text-primary'}`}>{user.avgScore}%</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
                                        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">{user.status}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleStatusToggle(user); }}
                                            className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-gray-400 hover:text-amber-500 hover:bg-amber-500/10 transition-all"
                                            title={user.status === 'Active' ? 'Suspend User' : 'Activate User'}
                                        >
                                            <ShieldAlert className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDelete(user.id); }}
                                            className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                            title="Delete User"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
          </div>
          
          <div className="p-8 border-t border-[var(--card-border)] flex items-center justify-between text-gray-500">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Platform Scale: {users.length} Unique Entities</span>
              <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-xs font-semibold disabled:opacity-30" disabled>Previous</button>
                  <button className="px-4 py-2 rounded-xl bg-primary text-black border border-primary/10 text-xs font-semibold">1</button>
                  <button className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-xs font-semibold disabled:opacity-30" disabled>Next</button>
              </div>
          </div>
      </div>

      {/* User Detail Drawer */}
      <AnimatePresence>
          {isDrawerOpen && selectedUser && (
              <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsDrawerOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
                  />
                   <motion.div 
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed right-0 top-0 h-screen w-full max-w-xl bg-[var(--sidebar-bg)] border-l border-[var(--card-border)] z-[101] overflow-y-auto no-scrollbar shadow-[-20px_0_50px_rgba(0,0,0,0.1)]"
                  >
                        {/* Drawer Header */}
                        <div className="p-10 border-b border-[var(--card-border)] flex items-center justify-between sticky top-0 bg-[var(--sidebar-bg)] z-10 backdrop-blur-xl">
                            <div className="flex items-center gap-6">
                                <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                                    <Users className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-semibold text-[var(--text-main)] tracking-tighter italic">Entity <span className="text-primary italic">Intelligence</span></h4>
                                    <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest mt-1">Registry Code: {selectedUser.id}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsDrawerOpen(false)}
                                className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] text-gray-500 hover:text-[var(--text-main)] transition-all shadow-xl"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-10 space-y-12">
                            {/* Profile Section */}
                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className="w-40 h-40 rounded-[3rem] overflow-hidden border-2 border-primary/30 p-1 relative shadow-[0_0_50px_rgba(0,210,255,0.1)]">
                                     <img src={selectedUser.avatar} className="w-full h-full object-cover rounded-[calc(3rem-4px)]" alt="" />
                                     <div className={`absolute bottom-4 right-4 w-6 h-6 rounded-full border-4 border-[#080808] ${selectedUser.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-semibold text-[var(--text-main)] tracking-tighter">{selectedUser.name}</h3>
                                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest">{selectedUser.email}</p>
                                </div>
                                <div className="flex gap-3">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-primary/10 text-primary border border-primary/30`}>{selectedUser.role}</span>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-widest ${selectedUser.status === 'Active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>{selectedUser.status}</span>
                                </div>
                            </div>

                            {/* Performance Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: "Interviews", val: selectedUser.interviews, icon: Target, color: "text-purple-500" },
                                    { label: "Avg Platform Score", val: selectedUser.avgScore + "%", icon: Star, color: "text-amber-500" },
                                    { label: "Resumes Uploaded", val: selectedUser.resumes, icon: FileText, color: "text-emerald-500" },
                                    { label: "Joined Platform", val: new Date(selectedUser.createdAt).toLocaleDateString(), icon: Clock, color: "text-blue-500" },
                                ].map((stat, i) => (
                                    <div key={i} className="p-6 rounded-[2rem] bg-white/[0.02] border border-[var(--card-border)] space-y-2 group hover:border-[var(--card-border)] transition-all">
                                        <stat.icon className={`w-4 h-4 ${stat.color} mb-2 opacity-50`} />
                                        <p className="text-[9px] text-gray-600 font-semibold uppercase tracking-widest">{stat.label}</p>
                                        <p className="text-xl font-semibold text-[var(--text-main)]">{stat.val}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Recent Activity Mini-Feed */}
                            <div className="space-y-6">
                                <h5 className="text-[11px] font-semibold text-[var(--text-main)] uppercase tracking-[0.2em] flex items-center gap-3">
                                    <History className="w-4 h-4 text-primary" />
                                    Session Integrity Log
                                </h5>
                                <div className="space-y-4">
                                    {selectedUser.activity && selectedUser.activity.length > 0 ? (
                                        selectedUser.activity.map((act, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-[var(--card-border)] hover:bg-white/[0.04] transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-2 h-2 rounded-full ${act.type === 'Interview' ? 'bg-primary shadow-[0_0_8px_rgba(0,210,255,0.5)]' : 'bg-pink-500 shadow-[0_0_8px_rgba(244,114,182,0.5)]'}`} />
                                                    <div>
                                                        <p className="text-[11px] font-semibold text-[var(--text-main)]">{act.label}</p>
                                                        <p className="text-[9px] text-gray-600 font-medium">{new Date(act.time).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[10px] font-bold text-primary">{act.score}%</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-[10px] text-gray-600 font-semibold uppercase tracking-widest py-10 border border-dashed border-[var(--card-border)] rounded-2xl">
                                            No sessions recorded in current sync
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Critical Actions */}
                            <div className="pt-8 border-t border-[var(--card-border)] space-y-6">
                                 <h5 className="text-[11px] font-semibold text-red-500 uppercase tracking-[0.2em] flex items-center gap-3">
                                    <ShieldAlert className="w-4 h-4" />
                                    Restricted Protocols
                                 </h5>
                                 <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => handleStatusToggle(selectedUser)}
                                        className={`py-4 rounded-2xl font-semibold text-[10px] uppercase tracking-widest transition-all ${selectedUser.status === 'Active' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500/20' : 'bg-green-500/10 border border-green-500/20 text-green-500 hover:bg-green-500/20'}`}
                                    >
                                        {selectedUser.status === 'Active' ? 'Restrict Access' : 'Restore Access'}
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(selectedUser.id)}
                                        className="py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-semibold text-[10px] uppercase tracking-widest hover:bg-red-500/20 transition-all"
                                    >
                                        Purge Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                   </motion.div>
              </>
          )}
      </AnimatePresence>

      {/* Provision User Modal */}
      <AnimatePresence>
           {isProvisioning && (
               <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
                   <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsProvisioning(false)}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                   />
                   <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md bg-[var(--sidebar-bg)] border border-[var(--card-border)] rounded-[2.5rem] p-10 overflow-hidden shadow-2xl"
                   >
                        <div className="absolute top-0 right-0 p-8">
                             <button onClick={() => setIsProvisioning(false)} className="p-2 rounded-xl hover:bg-black/5 dark:bg-white/5 text-gray-500">
                                <X className="w-5 h-5" />
                             </button>
                        </div>
                        
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <div className="p-3 w-fit rounded-xl bg-primary/10 text-primary mb-4">
                                    <UserPlus className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-semibold tracking-tighter italic">Provision <span className="text-primary italic">Entity</span></h3>
                                <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest">Manual system injection protocol</p>
                            </div>

                            <form onSubmit={handleProvision} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-1 text-left block">Full Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="Enter entity name..."
                                        className="w-full bg-black/20 border border-[var(--card-border)] rounded-xl py-3 px-4 text-xs font-semibold text-[var(--text-main)] outline-none focus:ring-1 ring-primary/30"
                                        value={provisionForm.name}
                                        onChange={(e) => setProvisionForm({...provisionForm, name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-1 text-left block">Universal Email</label>
                                    <input 
                                        type="email" 
                                        required
                                        placeholder="entity@system.com"
                                        className="w-full bg-black/20 border border-[var(--card-border)] rounded-xl py-3 px-4 text-xs font-semibold text-[var(--text-main)] outline-none focus:ring-1 ring-primary/30"
                                        value={provisionForm.email}
                                        onChange={(e) => setProvisionForm({...provisionForm, email: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-1 text-left block">Access Cipher</label>
                                    <input 
                                        type="password" 
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-black/20 border border-[var(--card-border)] rounded-xl py-3 px-4 text-xs font-semibold text-[var(--text-main)] outline-none focus:ring-1 ring-primary/30"
                                        value={provisionForm.password}
                                        onChange={(e) => setProvisionForm({...provisionForm, password: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1.5 pb-2">
                                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-1 text-left block">Functional Role</label>
                                    <select 
                                        className="w-full bg-black/20 border border-[var(--card-border)] rounded-xl py-3 px-4 text-xs font-semibold text-[var(--text-main)] outline-none focus:ring-1 ring-primary/30 appearance-none cursor-pointer"
                                        value={provisionForm.role}
                                        onChange={(e) => setProvisionForm({...provisionForm, role: e.target.value})}
                                    >
                                        <option value="Candidate" className="bg-[#0a0a0a]">Candidate</option>
                                        <option value="Mentor" className="bg-[#0a0a0a]">Mentor</option>
                                        <option value="Recruiter" className="bg-[#0a0a0a]">Recruiter</option>
                                    </select>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={provisionLoading}
                                    className="w-full py-4 rounded-xl bg-primary text-black font-semibold text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(0,210,255,0.2)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {provisionLoading ? 'Injecting User...' : 'Inject User Entity'}
                                </button>
                            </form>
                        </div>
                   </motion.div>
               </div>
           )}
       </AnimatePresence>
    </div>
  );
};

export default AdminUserHub;
