import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Search, 
  ChevronDown, 
  RotateCcw, 
  Bookmark, 
  Share2, 
  Download, 
  BrainCircuit, 
  Cpu,
  BookmarkCheck,
  Zap,
  CheckCircle2,
  X
} from 'lucide-react';

import axios from '../lib/axios';
import toast from 'react-hot-toast';

import { useAuthStore } from '../store/useAuthStore';
import { useAIStore } from '../store/useAIStore';

const roles = ["Frontend Developer", "Backend Developer", "Full Stack Engineer", "DevOps Engineer", "Data Scientist", "MERN Developer", "ML Engineer", "Data Analyst", "UI/UX Designer"];
const topics = ["React", "Node.js", "System Design", "AWS", "Docker", "Python", "Data Structures", "Algorithms", "CSS Grid", "TypeScript", "MongoDB", "Express.js", "Kubernetes", "Redis"];
const difficulties = ["Easy", "Medium", "Hard"];

const AIQuestionGeneratorPage = () => {
  const { 
    questions, setQuestions, 
    followUps, setFollowUps, 
    answers, setAnswers, 
    filters, setFilters,
    topicInput, setTopicInput 
  } = useAIStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [savedIds, setSavedIds] = useState([]);
  const [loadingAction, setLoadingAction] = useState({}); // { questionId_action: boolean }
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch saved questions on mount to sync bookmarks
  useEffect(() => {
    const fetchSaved = async () => {
        try {
            const response = await axios.get('/ai/saved');
            if (response.data.success) {
                setSavedIds(response.data.questions.map(q => q.text));
            }
        } catch (error) {
            console.error("Error fetching saved questions:", error);
        }
    };
    fetchSaved();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setQuestions([]);
    setFollowUps({});
    setAnswers({});
    
    try {
      const response = await axios.post('/ai/generate-questions', {
        role: filters.role,
        topic: topicInput || filters.topic,
        difficulty: filters.difficulty,
        count: filters.count
      });

      if (response.data.success) {
        setQuestions(response.data.questions);
        toast.success(`Generated ${response.data.questions.length} questions!`);
      } else {
        toast.error(response.data.message || "Failed to generate questions");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast.error(error.response?.data?.message || "Error connecting to AI engine");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFollowUp = async (qText, qId) => {
    setLoadingAction(prev => ({ ...prev, [`${qId}_followup`]: true }));
    try {
        const response = await axios.post('/ai/follow-up', { question: qText, role: filters.role });
        if (response.data.success) {
            setFollowUps(prev => ({ ...prev, [qId]: response.data.followUp }));
            toast.success("Follow-up generated!");
        }
    } catch (error) {
        toast.error("Failed to generate follow-up");
    } finally {
        setLoadingAction(prev => ({ ...prev, [`${qId}_followup`]: false }));
    }
  };

  const handleGetAnswer = async (qText, qId) => {
    setLoadingAction(prev => ({ ...prev, [`${qId}_answer`]: true }));
    try {
        const response = await axios.post('/ai/sample-answer', { question: qText });
        if (response.data.success) {
            setAnswers(prev => ({ ...prev, [qId]: response.data.answer }));
            toast.success("Sample answer ready!");
        }
    } catch (error) {
        toast.error("Failed to generate answer");
    } finally {
        setLoadingAction(prev => ({ ...prev, [`${qId}_answer`]: false }));
    }
  };

  const toggleSave = async (q) => {
    try {
        const payload = {
            text: q.text.trim(),
            category: q.category,
            difficulty: q.difficulty,
            answer: answers[q.id] || ""
        };
        
        const response = await axios.post('/ai/toggle-save', payload);
        if (response.data.success) {
            const normalizedText = q.text.trim();
            if (response.data.isSaved) {
                setSavedIds(prev => [...prev, normalizedText]);
                toast.success("Scenario archived in bank!");
            } else {
                setSavedIds(prev => prev.filter(t => t !== normalizedText));
                toast.success("Removed from intelligence bank");
            }
        }
    } catch (error) {
        console.error("Save error:", error);
        toast.error(error.response?.data?.message || "Failed to sync with intelligence bank");
    }
  };

  const handleShare = async (text) => {
    try {
        if (navigator.share) {
            await navigator.share({
                title: 'Interview Scenario',
                text: text,
                url: window.location.href
            });
        } else {
            await navigator.clipboard.writeText(text);
            toast.success("Scenario copied to clipboard!");
        }
    } catch (error) {
        if (error.name !== 'AbortError') {
            // Fallback for clipboard
            try {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                toast.success("Scenario copied to clipboard!");
            } catch (err) {
                toast.error("Failed to copy scenario");
            }
        }
    }
  };

  const handleExport = async () => {
    if (questions.length === 0) {
        toast.error("No questions to export!");
        return;
    }

    try {
        const sessionData = questions.map(q => ({
            text: q.text,
            category: q.category,
            difficulty: q.difficulty,
            answer: answers[q.id] || "No sample answer generated",
            followUp: followUps[q.id] || "No follow-up generated"
        }));

        const response = await axios.post('/ai/export', { data: sessionData }, { responseType: 'blob' });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'interview_session.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("CSV Export successful!");
    } catch (error) {
        toast.error("Failed to export data");
    }
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
          AI <span className="text-primary italic">Scenario</span> Engine
        </motion.h1>
        <p className="text-[var(--text-muted)] font-semibold text-sm">Generate hyper-realistic interview questions tailored to your target role and expertise.</p>
      </div>

      {/* Filter Dashboard */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-[2.5rem] p-8 border border-[var(--card-border)] space-y-6 relative"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Cpu className="w-24 h-24 text-primary" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          {/* Role Select */}
          <div className="space-y-2">
            <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest px-2">Target Role</p>
            <CustomSelect 
                options={roles} 
                value={filters.role} 
                onChange={(val) => setFilters({...filters, role: val})} 
            />
          </div>

          {/* Topic Autocomplete */}
          <div className="space-y-2 relative">
            <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest px-2">Focus Topic</p>
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-hover:text-primary transition-colors" />
                <input 
                    type="text" 
                    value={topicInput}
                    onChange={(e) => {
                        setTopicInput(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Search topics..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm font-semibold outline-none focus:ring-2 ring-primary/50 transition-all placeholder:text-[var(--text-muted)] opacity-70"
                />
                
                <AnimatePresence>
                    {showSuggestions && topicInput && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 5 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute z-50 w-full bg-[var(--sidebar-bg)] border border-[var(--card-border)] rounded-2xl overflow-hidden shadow-2xl p-1 backdrop-blur-3xl"
                        >
                            {topics.filter(t => t.toLowerCase().includes(topicInput.toLowerCase())).map(t => (
                                <div 
                                    key={t}
                                    onClick={() => {
                                        setTopicInput(t);
                                        setShowSuggestions(false);
                                    }}
                                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:bg-primary/20 hover:text-[var(--text-main)] cursor-pointer transition-colors"
                                >
                                    {t}
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
          </div>

          {/* Difficulty Segment */}
          <div className="space-y-2">
            <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest px-2">Difficulty</p>
            <div className="flex bg-[var(--card-bg)] border border-[var(--card-border)] p-1.5 rounded-2xl h-[52px]">
                {difficulties.map(d => (
                    <button 
                        key={d}
                        onClick={() => setFilters({...filters, difficulty: d})}
                        className={`flex-1 rounded-xl text-xs font-bold transition-all ${filters.difficulty === d ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                    >
                        {d}
                    </button>
                ))}
            </div>
          </div>

          {/* Neon Generate Button */}
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="relative group h-[52px] w-full rounded-2xl bg-[var(--sidebar-bg)] border border-[var(--card-border)] flex items-center justify-center gap-2 overflow-hidden transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-primary/20 group-hover:blur-xl transition-all" />
            
            <Zap className={`w-5 h-5 transition-colors relative z-10 ${isGenerating ? 'text-gray-500' : 'text-primary group-hover:text-black'}`} />
            <span className={`text-sm font-bold uppercase tracking-tighter relative z-10 ${isGenerating ? 'text-gray-500' : 'text-[var(--text-main)] group-hover:text-black'}`}>
                {isGenerating ? 'Processing...' : 'Engage Engine'}
            </span>
          </button>
        </div>
      </motion.div>

      {/* Output Section */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div 
               key="loading"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="flex flex-col items-center justify-center py-20 gap-8"
            >
                <div className="relative">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="w-24 h-24 rounded-full border-2 border-primary/20 border-t-primary"
                    />
                    <BrainCircuit className="absolute inset-0 m-auto w-10 h-10 text-primary animate-pulse" />
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-[var(--text-main)] tracking-tight italic">Analyzing Context...</h3>
                    <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest animate-pulse">Scanning industry standard rubrics</p>
                </div>
            </motion.div>
          ) : questions.length > 0 ? (
            <motion.div 
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
            >
                <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        Generated Intelligence <span className="text-[var(--text-muted)] font-medium text-sm">({questions.length})</span>
                    </h2>
                    <div className="flex gap-4">
                        <button 
                            onClick={handleExport}
                            className="flex items-center gap-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Export All
                        </button>
                        <button 
                            onClick={handleGenerate}
                            className="flex items-center gap-2 text-xs font-bold text-primary hover:underline hover:underline-offset-4 transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Regenerate Batch
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {questions.map((q, i) => (
                        <motion.div 
                            key={q.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.005 }}
                            className="glass group p-8 rounded-[2.5rem] border border-[var(--card-border)] flex flex-col gap-8 relative overflow-hidden"
                        >
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                                <div className="flex-1 space-y-4 relative">
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">{q.category}</span>
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${q.difficulty === 'Hard' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                                            {q.difficulty}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-[var(--text-main)] tracking-tight leading-relaxed">{q.text}</h3>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-4">
                                        <button 
                                            onClick={() => handleFollowUp(q.text, q.id)}
                                            disabled={loadingAction[`${q.id}_followup`]}
                                            className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors flex items-center gap-2 group/btn disabled:opacity-50"
                                        >
                                            <Sparkles className={`w-4 h-4 text-secondary ${loadingAction[`${q.id}_followup`] ? 'animate-spin' : 'group-hover/btn:rotate-12'} transition-transform`} />
                                            {followUps[q.id] ? 'Regenerate Follow-up' : 'Generate Follow-up'}
                                        </button>
                                        <button 
                                            onClick={() => handleGetAnswer(q.text, q.id)}
                                            disabled={loadingAction[`${q.id}_answer`]}
                                            className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors flex items-center gap-2 group/btn disabled:opacity-50"
                                        >
                                            <Zap className={`w-4 h-4 text-primary ${loadingAction[`${q.id}_answer`] ? 'animate-bounce' : 'group-hover/btn:scale-110'} transition-transform`} />
                                            {answers[q.id] ? 'Refine AI Answer' : 'Sample AI Answer'}
                                        </button>
                                    </div>

                                    {/* Inline Generated Content */}
                                    <AnimatePresence>
                                        {(followUps[q.id] || answers[q.id]) && (
                                            <motion.div 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="space-y-4 pt-4 border-t border-[var(--card-border)] overflow-hidden"
                                            >
                                                {followUps[q.id] && (
                                                    <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                                                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">AI Follow-up Question</p>
                                                        <p className="text-sm text-[var(--text-main)] font-medium italic">"{followUps[q.id]}"</p>
                                                    </div>
                                                )}
                                                {answers[q.id] && (
                                                    <div className="bg-secondary/5 rounded-2xl p-5 border border-secondary/10">
                                                        <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2">Model AI Answer</p>
                                                        <div className="text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-wrap">
                                                            {answers[q.id]}
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                 <div className="flex gap-2 shrink-0 self-start md:self-center relative z-20">
                                    <button 
                                        onClick={() => toggleSave(q)}
                                        className={`p-4 rounded-2xl transition-all ${savedIds.includes(q.text.trim()) ? 'bg-primary text-black' : 'bg-[var(--card-bg)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-primary/10'}`}
                                    >
                                        {savedIds.includes(q.text.trim()) ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                                    </button>
                                    <button 
                                        onClick={() => handleShare(q.text)}
                                        className="p-4 rounded-2xl bg-[var(--card-bg)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-primary/10 transition-all"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="absolute right-0 bottom-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none z-0">
                                <Cpu className="w-24 h-24 text-[var(--text-main)]" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
          ) : (
            <motion.div     
               key="empty"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex flex-col items-center justify-center py-32 text-center space-y-6"
            >
                <div className="w-24 h-24 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center">
                    <Search className="w-10 h-10 text-[var(--text-muted)] opacity-40" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-[var(--text-main)] tracking-tight underline italic decoration-primary/50">Engine Offline</h3>
                    <p className="text-[var(--text-muted)] font-medium max-w-sm mt-2">Adjust your filters and hit 'Engage Engine' to generate scenario intelligence.</p>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const CustomSelect = ({ options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative">
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between px-4 py-3.5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm font-semibold cursor-pointer hover:bg-primary/5 transition-all"
            >
                {value}
                <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 5 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-50 w-full bg-[var(--sidebar-bg)] border border-[var(--card-border)] rounded-2xl overflow-hidden shadow-2xl p-1 backdrop-blur-3xl"
                    >
                        {options.map(opt => (
                            <div 
                                key={opt}
                                onClick={() => {
                                    onChange(opt);
                                    setIsOpen(false);
                                }}
                                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${value === opt ? 'bg-primary/20 text-primary' : 'text-[var(--text-muted)] hover:bg-black/5 hover:text-[var(--text-main)]'}`}
                            >
                                {opt}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AIQuestionGeneratorPage;
