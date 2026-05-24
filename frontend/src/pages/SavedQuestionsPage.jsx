import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Heart, 
  Trash2, 
  Share2, 
  Zap, 
  FolderOpen, 
  Plus,
  Sparkles,
  SearchX,
  ChevronRight,
  FolderPlus,
  X,
  Check,
  ChevronDown,
  LayoutGrid,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import toast from 'react-hot-toast';

const categories = ["All", "Frontend", "Backend", "System Design", "Behavioral", "Security"];

const SavedQuestionsPage = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeFolder, setActiveFolder] = useState("All");
  const [isSearching, setIsSearching] = useState(false);
  
  // Modal states
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newQuestion, setNewQuestion] = useState({ text: "", category: "Frontend", difficulty: "Medium", folder: "General" });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
        const [qRes, fRes] = await Promise.all([
            axios.get('/ai/saved'),
            axios.get('/ai/folders')
        ]);
        if (qRes.data.success) setQuestions(qRes.data.questions);
        if (fRes.data.success) setFolders([...new Set(fRes.data.folders)]);
    } catch (error) {
        toast.error("Failed to load intelligence bank");
    } finally {
        setLoading(false);
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || q.category === activeCategory;
    const matchesFolder = activeFolder === "All" || q.folder === activeFolder;
    return matchesSearch && matchesCategory && matchesFolder;
  });

  const toggleFavorite = async (id) => {
    try {
        const response = await axios.patch(`/ai/favorite/${id}`);
        if (response.data.success) {
            setQuestions(questions.map(q => q._id === id ? { ...q, isFavorite: response.data.isFavorite } : q));
            toast.success(response.data.isFavorite ? "Added to favorites" : "Removed from favorites");
        }
    } catch (error) {
        toast.error("Failed to update favorite status");
    }
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scenario?")) return;
    try {
        const response = await axios.delete(`/ai/saved/${id}`);
        if (response.data.success) {
            setQuestions(questions.filter(q => q._id !== id));
            toast.success("Question deleted");
        }
    } catch (error) {
        toast.error("Failed to delete question");
    }
  };

  const moveFolder = async (qId, folderName) => {
    try {
        const response = await axios.patch(`/ai/saved/${qId}/folder`, { folder: folderName });
        if (response.data.success) {
            setQuestions(questions.map(q => q._id === qId ? { ...q, folder: folderName } : q));
            toast.success(`Moved to ${folderName}`);
        }
    } catch (error) {
        toast.error("Failed to move question");
    }
  };

  const deleteFolder = async (folderName) => {
    if (folderName === "General") return toast.error("Cannot delete the General folder");
    
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-[#050505] shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2rem] pointer-events-auto flex flex-col border border-white/10 p-8 gap-6 z-[9999] backdrop-blur-2xl`}>
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20">
            <Trash2 className="w-6 h-6 text-red-500" />
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-white tracking-tight">Delete Folder?</p>
            <p className="mt-1 text-sm text-[var(--text-muted)] font-medium leading-relaxed">
              Archiving scenarios from <span className="text-secondary font-bold">'{folderName}'</span>. This action moves all items to 'General' and removes the folder.
            </p>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 px-6 py-3 border border-white/5 rounded-2xl text-xs font-bold text-[var(--text-muted)] hover:bg-white/5 hover:text-white transition-all"
          >
            Go Back
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const response = await axios.delete(`/ai/folders/${folderName}`);
                if (response.data.success) {
                    setFolders([...new Set(response.data.folders)]);
                    if (activeFolder === folderName) setActiveFolder("All");
                    fetchInitialData(); 
                    toast.success("Folder purged successfully");
                }
              } catch (error) {
                toast.error("Process failed");
              }
            }}
            className="flex-1 px-6 py-3 bg-red-500 text-white rounded-2xl text-xs font-bold shadow-xl shadow-red-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    ), { duration: 6000, position: 'top-center' });
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
        const response = await axios.post('/ai/folders', { name: newFolderName });
        if (response.data.success) {
            setFolders([...new Set(response.data.folders)]);
            setNewFolderName("");
            setShowFolderModal(false);
            toast.success("Folder created!");
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to create folder");
    }
  };

  const handleAddManual = async () => {
    if (!newQuestion.text.trim()) return toast.error("Question text is required");
    try {
        const response = await axios.post('/ai/saved/manual', newQuestion);
        if (response.data.success) {
            setQuestions([response.data.question, ...questions]);
            setShowAddModal(false);
            setNewQuestion({ text: "", category: "Frontend", difficulty: "Medium", folder: "General" });
            toast.success("Manual scenario archived!");
        }
    } catch (error) {
        toast.error("Failed to save scenario");
    }
  };

  const handleShare = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Header & Search */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
            <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-semibold text-[var(--text-main)] tracking-tight"
            >
                Saved <span className="text-secondary italic">Intelligence</span>
            </motion.h1>
            <p className="text-[var(--text-muted)] font-semibold text-sm">Curate your personal bank of high-value questions and scenario patterns.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1 group w-full">
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition duration-500`} />
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search saved scenarios..."
                        className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold text-[var(--text-main)] outline-none focus:ring-1 ring-primary/50 transition-all"
                    />
                </div>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="flex-1 md:flex-none h-[56px] px-6 rounded-2xl bg-primary text-black font-bold text-xs flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus className="w-5 h-5" />
                    Archive New
                </button>
                <button 
                    onClick={() => setShowFolderModal(true)}
                    className="flex-1 md:flex-none h-[56px] px-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-main)] font-bold text-xs flex items-center justify-center gap-2 hover:bg-primary/10 transition-all"
                >
                    <FolderPlus className="w-5 h-5 text-primary" />
                    Folder
                </button>
            </div>
        </div>

        {/* Global Filter Bar */}
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-[var(--text-muted)]">
                <Filter className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Global Taxonomy</span>
            </div>
            
            <div className="flex flex-col gap-4">
                {/* Category Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide no-scrollbar">
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${activeCategory === cat ? 'bg-secondary text-black border-secondary shadow-lg shadow-secondary/20' : 'bg-[var(--card-bg)] text-[var(--text-muted)] border-[var(--card-border)] hover:border-primary/20'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Taxonomy Scrollers with Indicators */}
                <div className="relative group">
                    <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar scroll-smooth no-scrollbar">
                        <button 
                            onClick={() => setActiveFolder("All")}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border flex items-center gap-2 ${activeFolder === "All" ? 'bg-primary text-black border-primary shadow-xl' : 'bg-[var(--sidebar-bg)] text-[var(--text-muted)] border-[var(--card-border)] hover:border-primary/20'}`}
                        >
                            <LayoutGrid className="w-3.5 h-3.5" />
                            All Folders
                        </button>
                    {folders.map(folder => (
                        <div 
                            key={folder} 
                            className={`group/folder relative flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all flex-shrink-0 cursor-pointer ${activeFolder === folder ? 'bg-primary text-black border-primary shadow-lg shadow-primary/20' : 'bg-[var(--sidebar-bg)] text-[var(--text-muted)] border-[var(--card-border)] hover:border-primary/20'}`}
                            onClick={() => setActiveFolder(folder)}
                        >
                            <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                                {folder}
                            </span>
                            {folder !== 'General' && (
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteFolder(folder);
                                    }}
                                    className={`p-1 rounded-md transition-all ${activeFolder === folder ? 'hover:bg-black/10 text-black/60 hover:text-black' : 'hover:bg-white/10 text-[var(--text-muted)] hover:text-primary'}`}
                                    title="Delete Folder"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3].map(i => (
                    <div key={i} className="h-[250px] rounded-[2.5rem] bg-[var(--card-bg)] border border-[var(--card-border)] animate-pulse" />
                ))}
             </div>
        ) : filteredQuestions.length > 0 ? (
          <motion.div 
            layout
            className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
          >
            {filteredQuestions.map(q => (
              <motion.div 
                key={q._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="break-inside-avoid glass p-8 rounded-[2.5rem] border border-[var(--card-border)] bg-[var(--card-bg)] space-y-6 group relative flex flex-col"
              >
                  <div className="flex items-center justify-between relative z-10 px-2 lg:px-0">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest whitespace-nowrap">{q.category}</span>
                        <span className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-widest whitespace-nowrap">{q.folder}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-4">
                          <button 
                            onClick={() => toggleFavorite(q._id)}
                            className={`p-2 rounded-xl transition-all ${q.isFavorite ? 'text-red-500 bg-red-500/10' : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/5'}`}
                          >
                               <Heart className={`w-3.5 h-3.5 ${q.isFavorite ? 'fill-red-500' : ''}`} />
                          </button>
                          <button 
                            onClick={() => handleShare(q.text)}
                            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-primary hover:bg-primary/10 transition-all"
                          >
                               <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => deleteQuestion(q._id)}
                            className="p-2 rounded-xl text-red-500 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-xl"
                          >
                               <Trash2 className="w-3.5 h-3.5" />
                          </button>
                      </div>
                  </div>

                  <h3 className="text-lg font-bold text-[var(--text-main)] tracking-tight leading-relaxed relative z-10">{q.text}</h3>

                  <div className="flex flex-col gap-4 relative z-10 mt-auto">
                       <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${q.difficulty === 'Hard' ? 'text-[var(--error)]' : q.difficulty === 'Medium' ? 'text-primary' : 'text-[var(--success)]'}`}>
                                {q.difficulty}
                            </span>
                            <div className="flex items-center gap-2">
                                <FolderOpen className="w-3 h-3 text-[var(--text-muted)]" />
                                <FolderSelect 
                                    folders={folders} 
                                    currentFolder={q.folder} 
                                    onSelect={(val) => moveFolder(q._id, val)} 
                                />
                            </div>
                       </div>
                       
                       <button 
                           onClick={() => navigate('/dashboard/mock-interview')}
                           className="w-full py-4 rounded-2xl bg-[var(--sidebar-bg)] border border-[var(--card-border)] text-[var(--text-main)] font-extrabold text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 group/btn"
                       >
                           <Zap className="w-4 h-4 text-primary fill-primary" />
                           Quick Practice
                           <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                       </button>
                  </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center space-y-6"
          >
            <SearchX className="w-16 h-16 text-[var(--text-muted)] opacity-50" />
            <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[var(--text-main)] tracking-tight italic">Knowledge Gap Detected</h3>
                <p className="text-[var(--text-muted)] font-medium max-w-sm">No scenarios match your current filter set. Try expanding your parameters.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Stats */}
      <div className="glass rounded-[2.5rem] p-10 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[1.5rem] bg-secondary/10 border border-secondary/20 flex items-center justify-center shrink-0">
                  <FolderOpen className="w-8 h-8 text-secondary" />
              </div>
              <div className="space-y-1">
                  <h4 className="text-xl font-bold text-[var(--text-main)] tracking-tight">Intelligence Bank</h4>
                  <p className="text-sm text-[var(--text-muted)] font-medium">You have {questions.length} saved scenarios across {folders.length} folders.</p>
              </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
              <div className="flex-1 md:w-32 p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] text-center">
                  <p className="text-2xl font-bold text-primary">{questions.filter(q => q.isFavorite).length}</p>
                  <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">Favorites</p>
              </div>
          </div>
      </div>

      {/* NEW FOLDER MODAL */}
      <AnimatePresence>
        {showFolderModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowFolderModal(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[2.5rem] p-10 w-full max-w-md relative z-10 space-y-8"
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-[var(--text-main)]">New Folder</h3>
                    <button onClick={() => setShowFolderModal(false)}><X className="w-6 h-6" /></button>
                </div>
                <div className="space-y-4">
                    <input 
                        className="w-full bg-[var(--sidebar-bg)] border border-[var(--card-border)] rounded-2xl p-4 text-sm font-semibold text-[var(--text-main)] outline-none"
                        placeholder="e.g., Target: Google Systems"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                    />
                    <button 
                        onClick={createFolder}
                        className="w-full py-4 rounded-2xl bg-primary text-black font-bold text-sm"
                    >
                        Create Folder
                    </button>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD QUESTION MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowAddModal(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[2.5rem] p-10 w-full max-w-2xl relative z-10 space-y-8 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-[var(--text-main)]">Archive Manual Scenario</h3>
                    <button onClick={() => setShowAddModal(false)}><X className="w-6 h-6" /></button>
                </div>
                
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Scenario Text</label>
                        <textarea 
                            rows={4}
                            className="w-full bg-[var(--sidebar-bg)] border border-[var(--card-border)] rounded-2xl p-4 text-sm font-semibold text-[var(--text-main)] outline-none resize-none"
                            placeholder="Type your custom interview question or scenario here..."
                            value={newQuestion.text}
                            onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Category</label>
                            <select 
                                className="w-full bg-[var(--sidebar-bg)] border border-[var(--card-border)] rounded-2xl p-4 text-sm font-semibold text-[var(--text-main)] outline-none"
                                value={newQuestion.category}
                                onChange={(e) => setNewQuestion({...newQuestion, category: e.target.value})}
                            >
                                {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Difficulty</label>
                            <select 
                                className="w-full bg-[var(--sidebar-bg)] border border-[var(--card-border)] rounded-2xl p-4 text-sm font-semibold text-[var(--text-main)] outline-none"
                                value={newQuestion.difficulty}
                                onChange={(e) => setNewQuestion({...newQuestion, difficulty: e.target.value})}
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Target Folder</label>
                        <select 
                            className="w-full bg-[var(--sidebar-bg)] border border-[var(--card-border)] rounded-2xl p-4 text-sm font-semibold text-[var(--text-main)] outline-none"
                            value={newQuestion.folder}
                            onChange={(e) => setNewQuestion({...newQuestion, folder: e.target.value})}
                        >
                            {folders.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Sample Answer (Optional)</label>
                        <textarea 
                            rows={3}
                            className="w-full bg-[var(--sidebar-bg)] border border-[var(--card-border)] rounded-2xl p-4 text-sm font-semibold text-[var(--text-main)] outline-none resize-none"
                            placeholder="Add an ideal answer reference..."
                            value={newQuestion.answer}
                            onChange={(e) => setNewQuestion({...newQuestion, answer: e.target.value})}
                        />
                    </div>

                    <button 
                        onClick={handleAddManual}
                        className="w-full py-4 rounded-2xl bg-secondary text-black font-bold text-sm shadow-lg shadow-secondary/20 hover:scale-105 transition-all"
                    >
                        Save to Intelligence Bank
                    </button>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FolderSelect = ({ folders, currentFolder, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 text-[10px] font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            >
                {currentFolder}
                <ChevronDown className="w-3 h-3" />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 5 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 bottom-full mb-2 z-50 w-48 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow-2xl p-1 overflow-hidden"
                        >
                            {folders.map(f => (
                                <button
                                    key={f}
                                    onClick={() => {
                                        onSelect(f);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest ${currentFolder === f ? 'bg-primary/20 text-primary' : 'text-[var(--text-muted)] hover:bg-primary/10 hover:text-[var(--text-main)]'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default SavedQuestionsPage;
