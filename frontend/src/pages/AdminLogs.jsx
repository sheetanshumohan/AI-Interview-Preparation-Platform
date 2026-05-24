import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  ShieldAlert, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  History, 
  Eye, 
  Settings, 
  Cpu, 
  Activity,
  User,
  ExternalLink,
  X,
  FileText,
  Lock,
  Globe
} from 'lucide-react';

import { useLogStore } from '../store/useLogStore';

const AdminLogs = () => {
  const { logs, stats, isLoading, fetchLogs, fetchLogStats } = useLogStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [expandedLog, setExpandedLog] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    fetchLogs({ severity: severityFilter, type: typeFilter, search: searchQuery });
    fetchLogStats();

    let interval;
    if (isLive) {
        interval = setInterval(() => {
            fetchLogs({ severity: severityFilter, type: typeFilter, search: searchQuery });
            fetchLogStats();
        }, 5000);
    }
    return () => clearInterval(interval);
  }, [isLive, severityFilter, typeFilter, searchQuery]);

  const handleExportSingleLog = (log) => {
    const content = `SYSTEM AUDIT LOG REPORT\n` +
                    `========================\n` +
                    `ID: ${log.id}\n` +
                    `Timestamp: ${log.timestamp}\n` +
                    `User: ${log.user}\n` +
                    `Action: ${log.action}\n` +
                    `Type: ${log.type}\n` +
                    `Severity: ${log.severity}\n` +
                    `Detail: ${log.detail}\n` +
                    `------------------------\n` +
                    `Technical Manifest: \n` +
                    JSON.stringify(log, null, 2);
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit_report_${log.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleArchive = () => {
    const headers = ["ID,Timestamp,User,Action,Type,Severity,Status"];
    const rows = logs.map(l => `${l.id},${l.timestamp},${l.user},"${l.action}",${l.type},${l.severity},${l.status}`);
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `system_logs_archive_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
      case 'Warning': return 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
      default: return 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_10px_rgba(0,210,255,0.2)]';
    }
  };

  return (
    <div className="space-y-12 pb-32">
       {/* Header & Pulse */}
       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)]"
                    >
                        <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,1)]' : 'bg-[var(--text-muted)]'}`} />
                        <span className="text-[10px] font-semibold text-[var(--placeholder-text,var(--text-muted))] uppercase tracking-widest">{isLive ? 'Live Surveillance' : 'Archive Mode'}</span>
                    </motion.div>
                    <span className="text-[var(--text-muted)] font-semibold text-xs uppercase tracking-widest flex items-center gap-2">
                        <Terminal className="w-4 h-4" />
                        SysLog Daemon v4.1
                    </span>
                </div>
                <h1 className="text-5xl font-semibold text-[var(--text-main)] tracking-tighter italic leading-none">System <span className="text-red-500 italic">Terminal</span></h1>
            </div>

            <div className="flex flex-wrap items-center gap-4">
                 <button 
                    onClick={() => setIsLive(!isLive)}
                    className={`px-6 py-4 rounded-2xl border font-semibold text-xs uppercase tracking-widest transition-all ${isLive ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-[var(--card-bg)] border-[var(--card-border)] text-gray-500 hover:text-[var(--text-main)]'}`}
                 >
                    {isLive ? 'Pause Stream' : 'Resume Stream'}
                 </button>
                 <button 
                    onClick={handleArchive}
                    className="px-8 py-4 rounded-2xl bg-[var(--text-main)] text-[var(--background)] font-semibold text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all flex items-center gap-3 shadow-xl"
                 >
                    <Download className="w-5 h-5" />
                    Archive Logs
                 </button>
            </div>
       </div>

       {/* Security Incident Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="glass p-8 rounded-[2.5rem] border border-[var(--card-border)] bg-red-500/[0.02] border-red-500/10 space-y-4">
                <ShieldAlert className="w-6 h-6 text-red-500 mb-2" />
                <div className="space-y-1">
                    <h4 className="text-3xl font-semibold text-[var(--text-main)]">{stats.critical}</h4>
                    <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest leading-none">Critical Security Alerts</p>
                </div>
                <div className="w-full h-1 bg-red-500/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(stats.critical * 10, 100)}%` }} className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                </div>
            </div>
            <div className="glass p-8 rounded-[2.5rem] border border-[var(--card-border)] bg-amber-500/[0.02] border-amber-500/10 space-y-4">
                <AlertTriangle className="w-6 h-6 text-amber-500 mb-2" />
                <div className="space-y-1">
                    <h4 className="text-3xl font-semibold text-[var(--text-main)]">{stats.warnings}</h4>
                    <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest leading-none">Active System Warnings</p>
                </div>
                <div className="w-full h-1 bg-amber-500/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(stats.warnings * 5, 100)}%` }} className="h-full bg-amber-500 shadow-[0_0_100px_rgba(245,158,11,0.5)]" />
                </div>
            </div>
            <div className="glass p-8 rounded-[2.5rem] border border-[var(--card-border)] bg-primary/[0.02] border-primary/10 space-y-4">
                <Activity className="w-6 h-6 text-primary mb-2" />
                <div className="space-y-1">
                    <h4 className="text-3xl font-semibold text-[var(--text-main)]">{stats.stability}</h4>
                    <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest leading-none">Core System Stability</p>
                </div>
                <div className="w-full h-1 bg-primary/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '99.98%' }} className="h-full bg-primary shadow-[0_0_10px_rgba(0,210,255,0.5)]" />
                </div>
            </div>
       </div>

       {/* Control & Search Bar */}
       <div className="flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="relative group w-full lg:max-w-xl">
                    <div className="absolute -inset-0.5 bg-primary/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Filter by Log ID, operation or entity name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-2xl py-4 pl-12 pr-4 text-xs font-semibold text-[var(--text-main)] outline-none focus:ring-1 ring-primary/30 transition-all font-mono"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                     <span className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest mr-2">Severity Logic:</span>
                     {['All', 'Info', 'Warning', 'Critical'].map(sev => (
                         <button 
                            key={sev}
                            onClick={() => setSeverityFilter(sev)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-semibold uppercase tracking-widest transition-all border ${severityFilter === sev ? 'bg-primary/20 text-primary border-primary/30' : 'bg-white/5 text-gray-500 border-white/5'}`}
                         >
                            {sev}
                         </button>
                     ))}
                </div>
            </div>
       </div>

       {/* System Log Terminal Table */}
       <div className="glass rounded-[3rem] border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-[var(--text-main)]/[0.01]">
                        <tr>
                            <th className="px-8 py-5 text-left text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-[0.2em] font-mono">Timestamp</th>
                            <th className="px-8 py-5 text-left text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-[0.2em] font-mono">Entity</th>
                            <th className="px-8 py-5 text-left text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-[0.2em] font-mono">Operation</th>
                            <th className="px-8 py-5 text-left text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-[0.2em] font-mono">Logic Class</th>
                            <th className="px-8 py-5 text-left text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-[0.2em] font-mono">Impact</th>
                            <th className="px-8 py-5 text-right text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-[0.2em] font-mono">Protocol</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--card-border)]">
                        {logs.length > 0 ? logs.map(log => (
                            <React.Fragment key={log.id}>
                                <tr 
                                    onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                                    className="group hover:bg-[var(--text-main)]/[0.02] cursor-pointer transition-all"
                                >
                                    <td className="px-8 py-6">
                                        <p className="text-[11px] font-semibold text-gray-500 font-mono tracking-tighter">{log.timestamp}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[var(--card-bg)] flex items-center justify-center border border-[var(--card-border)] group-hover:border-primary/20">
                                                <User className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" />
                                            </div>
                                            <p className="text-[11px] font-semibold text-[var(--text-main)] tracking-widest uppercase">{log.user}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-xs font-semibold text-[var(--text-main)] tracking-tight">{log.action}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            {log.type === 'SECURITY' ? <Lock className="w-3.5 h-3.5 text-red-500" /> : log.type === 'AI_AGENT' ? <Cpu className="w-3.5 h-3.5 text-primary" /> : <Globe className="w-3.5 h-3.5 text-gray-500" />}
                                            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest">{log.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1.5 rounded-xl text-[9px] font-semibold uppercase tracking-[0.15em] border ${getSeverityStyles(log.severity)}`}>
                                            {log.severity}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedLog(log);
                                            }}
                                            className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-500 hover:text-white hover:border-primary/30 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                                <AnimatePresence>
                                    {expandedLog === log.id && (
                                        <tr>
                                            <td colSpan={6} className="px-10 py-0 overflow-hidden bg-black/40">
                                                <motion.div 
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="py-10 space-y-6"
                                                >
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                        <div className="space-y-4">
                                                            <h5 className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                                <FileText className="w-3.5 h-3.5 text-primary" />
                                                                Technical Manifest
                                                            </h5>
                                                            <div className="p-6 rounded-2xl bg-[#080808] border border-white/5 font-mono text-[11px] leading-relaxed text-gray-400 space-y-2">
                                                                <p><span className="text-primary">UID:</span> {log.id}</p>
                                                                <p><span className="text-primary">PROTOCOL:</span> {log.status}</p>
                                                                <p><span className="text-primary">PAYLOAD:</span> {log.detail}</p>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <h5 className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                                <Activity className="w-3.5 h-3.5 text-primary" />
                                                                System Response
                                                            </h5>
                                                            <div className="p-6 rounded-2xl bg-[#080808] border border-white/5 space-y-4">
                                                                 <div className="flex justify-between items-center">
                                                                    <p className="text-xs font-semibold text-white">Threat Mitigation</p>
                                                                    <span className="text-[10px] font-semibold text-green-500 uppercase">Automated</span>
                                                                 </div>
                                                                 <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                                     <div className="w-[80%] h-full bg-primary" />
                                                                 </div>
                                                                 <p className="text-[10px] text-gray-600 font-semibold italic">Core security layers updated following event validation.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </React.Fragment>
                        )) : (
                            <tr>
                                <td colSpan={6} className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center gap-4 opacity-40">
                                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-dashed border-white/10">
                                            <ShieldAlert className="w-8 h-8 text-white/50" />
                                        </div>
                                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">No Audit Fragments Found</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
       </div>

       {/* Log Detail Modal */}
       <AnimatePresence>
            {selectedLog && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedLog(null)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 m-auto w-full max-w-2xl h-fit max-h-[80vh] bg-[var(--sidebar-bg)] border border-[var(--card-border)] rounded-[3rem] z-[101] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.1)]"
                    >
                        <div className="p-10 border-b border-[var(--card-border)] flex items-center justify-between bg-[var(--sidebar-bg)] sticky top-0">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-2xl border ${getSeverityStyles(selectedLog.severity)}`}>
                                    <ShieldAlert className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-semibold text-[var(--text-main)] italic">Event <span className="text-primary italic">Intelligence</span></h3>
                                    <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest mt-1">Hash Code: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedLog(null)} className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-10 space-y-8 overflow-y-auto max-h-[calc(80vh-8rem)] no-scrollbar">
                             <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">Global Timestamp</p>
                                    <p className="text-sm font-semibold text-[var(--text-main)] font-mono">{selectedLog.timestamp} UTC</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">Origin Intelligence</p>
                                    <p className="text-sm font-semibold text-[var(--text-main)] font-mono">{selectedLog.user}</p>
                                </div>
                             </div>

                             <div className="space-y-4">
                                <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest">Event Payload (RAW JSON)</p>
                                <div className="p-8 rounded-[2rem] bg-[var(--background)] border border-[var(--card-border)] text-[11px] font-mono leading-relaxed text-primary/80 overflow-x-auto">
                                    <pre>
{`{
  "id": "${selectedLog.id}",
  "timestamp": "${selectedLog.timestamp}",
  "severity_index": "${selectedLog.severity}",
  "operation": "${selectedLog.action}",
  "entity": {
    "identifier": "${selectedLog.user}",
    "access_level": "CORE_ROOT"
  },
  "metadata": {
    "trace_id": "8x-921-v42",
    "cluster_node": "AWS-AP-SOUTH-1",
    "payload_hash": "sha256:0xf23a..."
  },
  "technical_detail": "${selectedLog.detail}"
}`}
                                    </pre>
                                </div>
                             </div>

                             <div className="flex gap-4">
                                <button 
                                    onClick={() => handleExportSingleLog(selectedLog)}
                                    className="flex-1 py-5 rounded-[2rem] bg-[var(--text-main)] text-[var(--background)] font-bold text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    Export Audit Trail
                                </button>
                                <button onClick={() => setSelectedLog(null)} className="flex-1 py-5 rounded-[2rem] bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-main)] font-bold text-xs uppercase tracking-widest hover:bg-black/[0.05] transition-all">
                                    Close Terminal
                                </button>
                             </div>
                        </div>
                    </motion.div>
                </>
            )}
       </AnimatePresence>
    </div>
  );
};

export default AdminLogs;
