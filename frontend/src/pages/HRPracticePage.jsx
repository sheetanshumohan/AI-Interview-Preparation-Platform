import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageCircle, 
  Mic, 
  Sparkles, 
  ChevronDown, 
  Lightbulb, 
  Quote,
  Target,
  Send,
  Heart,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import axios from '../lib/axios';
import toast from 'react-hot-toast';

import { useHRStore } from '../store/useHRStore';

const HRPracticePage = () => {
  const { 
    questions, setQuestions, 
    answers, setAnswers, 
    evaluations, setEvaluations, 
    expandedId, setExpandedId 
  } = useHRStore();

  const [loading, setLoading] = useState(false);
  
  // Practice states
  const [practiceMode, setPracticeMode] = useState({}); // { qId: boolean }
  const [isEvaluating, setIsEvaluating] = useState({}); // { qId: boolean }
  const [showSamples, setShowSamples] = useState({}); // { qId: boolean }
  const [stats, setStats] = useState({ averageScore: 0, totalAttempts: 0, insights: "" });
  const [isUpdatingInsights, setIsUpdatingInsights] = useState(false);

  // Voice recording refs
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const [isRecording, setIsRecording] = useState(null); // stores qId of currently recording question
  const [isTranscribing, setIsTranscribing] = useState(false);

  useEffect(() => {
    if (questions.length === 0) {
        fetchQuestions();
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
        const response = await axios.get('/ai/hr/stats');
        if (response.data.success) {
            setStats(response.data.stats);
        }
    } catch (error) {
        console.error("Failed to fetch HR stats", error);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
        const response = await axios.get('/ai/hr/questions');
        if (response.data.success) {
            setQuestions(response.data.questions);
            if (response.data.questions.length > 0) setExpandedId(response.data.questions[0].id);
            toast.success("New behavioral batch generated!");
        }
    } catch (error) {
        toast.error("Failed to load behavioral questions");
    } finally {
        setLoading(false);
    }
  };

  const handleEvaluate = async (qId, qText) => {
    const answer = answers[qId];
    if (!answer || answer.length < 20) {
        toast.error("Please provide a more detailed answer for analysis (min 20 chars)");
        return;
    }

    setIsEvaluating(prev => ({ ...prev, [qId]: true }));
    try {
        const response = await axios.post('/ai/hr/evaluate', { question: qText, answer });
        if (response.data.success) {
            setEvaluations(prev => ({ ...prev, [qId]: response.data.evaluation }));
            toast.success("Analysis complete!");
            fetchStats(); // Refresh stats after evaluation
        }
    } catch (error) {
        toast.error("Evaluation failed. Please try again.");
    } finally {
        setIsEvaluating(prev => ({ ...prev, [qId]: false }));
    }
  };

  const startRecording = async (qId) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(stream);
        audioChunks.current = [];

        mediaRecorder.current.ondataavailable = (event) => {
            if (event.data.size > 0) audioChunks.current.push(event.data);
        };

        mediaRecorder.current.onstop = async () => {
            const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
            await sendAudioToBackend(qId, audioBlob);
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.current.start();
        setIsRecording(qId);
        toast.success("Recording started...");
    } catch (error) {
        toast.error("Microphone access denied or error occurred");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
        mediaRecorder.current.stop();
        setIsRecording(null);
    }
  };

  const sendAudioToBackend = async (qId, blob) => {
    setIsTranscribing(true);
    try {
        const formData = new FormData();
        formData.append('audio', blob, 'recording.webm');

        const response = await axios.post('/ai/transcribe', formData);
        
        if (response.data.success) {
            setAnswers(prev => ({
                ...prev,
                [qId]: (prev[qId] || "") + " " + response.data.text
            }));
            toast.success("Transcription complete!");
        }
    } catch (error) {
        toast.error("Transcription failed");
    } finally {
        setIsTranscribing(false);
    }
  };

  const handleUpdateInsights = async () => {
    setIsUpdatingInsights(true);
    try {
        const response = await axios.post('/ai/hr/update-insights');
        if (response.data.success) {
            setStats(prev => ({ ...prev, insights: response.data.insights }));
            toast.success("Profile insights updated!");
        }
    } catch (error) {
        toast.error("Failed to update insights");
    } finally {
        setIsUpdatingInsights(false);
    }
  };

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
            <Loader2 className="w-12 h-12 text-[#f472b6] animate-spin" />
            <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-[0.2em] animate-pulse">Designing behavioral scenarios...</p>
        </div>
    );
  }

  return (
    <div className="space-y-8 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-semibold text-[var(--text-main)] tracking-tight"
          >
            Behavioral <span className="text-[#f472b6] italic">Intelligence</span>
          </motion.h1>
          <p className="text-[var(--text-muted)] font-semibold text-sm">Master the human side of the interview with AI-powered behavioral practice and empathetic feedback.</p>
        </div>

        <button 
           onClick={fetchQuestions}
           disabled={loading}
           className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#f472b6]/10 border border-[#f472b6]/20 text-[#f472b6] text-xs font-bold uppercase tracking-widest hover:bg-[#f472b6] hover:text-black transition-all shadow-lg active:scale-95 disabled:opacity-50"
        >
           {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
           {loading ? 'Generating...' : 'Regenerate Scenarios'}
        </button>
      </div>

      {/* Main Accordion Section */}
      <div className="space-y-4 max-w-5xl">
        {questions.map((q, index) => (
          <motion.div 
            key={q.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass rounded-[2.5rem] border transition-all duration-500 ${expandedId === q.id ? 'border-[#f472b6]/30 bg-[#f472b6]/[0.02]' : 'border-white/5 bg-white/[0.01] hover:border-white/10'}`}
          >
            <button 
              onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
              className="w-full p-8 flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-6">
                <div className={`p-4 rounded-2xl transition-all ${expandedId === q.id ? 'bg-[#f472b6]/20 text-[#f472b6]' : 'bg-[var(--card-bg)] text-[var(--text-muted)] group-hover:text-[var(--text-main)]'}`}>
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                   <span className="text-[10px] text-[#f472b6] font-bold uppercase tracking-widest block mb-1">{q.category}</span>
                   <h3 className="text-xl font-semibold text-[var(--text-main)] tracking-tight">{q.question}</h3>
                </div>
              </div>
              <ChevronDown className={`w-6 h-6 text-[var(--text-muted)] transition-transform duration-500 ${expandedId === q.id ? 'rotate-180 text-[#f472b6]' : ''}`} />
            </button>

            <AnimatePresence>
              {expandedId === q.id && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden border-t border-white/5"
                >
                  <div className="p-8 space-y-10">
                    <div className="space-y-6 max-w-3xl mx-auto">
                        <div className="flex justify-start">
                            <div className="glass p-6 rounded-[2rem] rounded-tl-none border-[var(--card-border)] bg-[var(--card-bg)] max-w-[80%] relative">
                                <div className="flex items-center gap-2 mb-2">
                                     <Quote className="w-3.5 h-3.5 text-[#f472b6] opacity-50" />
                                     <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">Interviewer context</span>
                                </div>
                                <p className="text-sm font-semibold text-[var(--text-main)] leading-relaxed">{q.strategy}</p>
                                <div className="absolute -left-2 top-0 w-4 h-4 bg-[var(--card-bg)] border-l border-t border-[var(--card-border)] transform rotate-45 -translate-x-1" />
                            </div>
                        </div>

                        {/* Interactive Practice Mode */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <span className="text-[10px] text-[#f472b6] font-bold uppercase tracking-[0.2em]">
                                    {isRecording === q.id ? 'Recording Session...' : isTranscribing ? 'AI Transcription...' : 'Drafting Practice'}
                                </span>
                                <button 
                                    onClick={isRecording === q.id ? stopRecording : () => startRecording(q.id)}
                                    className={`p-3 rounded-full transition-all ${isRecording === q.id ? 'bg-red-500/20 text-red-500 animate-pulse' : 'hover:bg-white/5 text-[var(--text-muted)]'}`}
                                >
                                    <Mic className={`w-5 h-5 ${isRecording === q.id ? 'scale-110' : ''}`} />
                                </button>
                            </div>
                            
                            <textarea 
                                value={answers[q.id] || ""}
                                onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
                                placeholder="Type or use the mic to record your response here using the STAR method..."
                                className="w-full h-32 p-6 rounded-3xl bg-[var(--sidebar-bg)] border border-[var(--card-border)] text-sm font-medium text-[var(--text-main)] outline-none focus:ring-1 ring-[#f472b6]/50 placeholder:text-[var(--text-muted)]/50 resize-none transition-all"
                                disabled={isTranscribing}
                            />

                            <div className="flex justify-center">
                                <button 
                                    onClick={() => handleEvaluate(q.id, q.question)}
                                    disabled={isEvaluating[q.id]}
                                    className="px-8 py-3 rounded-2xl bg-[#f472b6] text-black font-bold text-xs flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isEvaluating[q.id] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                    {isEvaluating[q.id] ? 'AI Analysis...' : 'Evaluate with STAR'}
                                </button>
                            </div>
                        </div>

                        {/* Dynamic Evaluation Results */}
                        <AnimatePresence>
                            {evaluations[q.id] && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6 pt-6 border-t border-white/5"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="glass p-6 rounded-[2rem] border-white/5 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">AI Score</span>
                                                <span className="text-2xl font-black text-[#f472b6]">{evaluations[q.id].score}/10</span>
                                            </div>
                                            <p className="text-xs text-[var(--text-muted)] leading-relaxed italic">"{evaluations[q.id].feedback}"</p>
                                        </div>

                                        <div className="glass p-6 rounded-[2rem] border-white/5 space-y-4">
                                            <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">STAR Breakdown</span>
                                            <div className="space-y-2">
                                                {Object.entries(evaluations[q.id].starAnalysis).map(([key, val]) => (
                                                    <div key={key} className="flex gap-2 items-start text-[10px]">
                                                        <span className="w-3 text-[#f472b6] font-bold uppercase">{key[0]}</span>
                                                        <span className="text-[var(--text-muted)] font-medium leading-relaxed">{val}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-[2rem] bg-green-500/5 border border-green-500/10 space-y-3">
                                        <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Proposed Improvements
                                        </span>
                                        <ul className="space-y-2">
                                            {evaluations[q.id].improvements.map((imp, i) => (
                                                <li key={i} className="text-xs font-semibold text-[var(--text-muted)] flex gap-3">
                                                    <span className="text-[#f472b6]">•</span>
                                                    {imp}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Pro Tips Grid (AI Generated) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-4 hover:border-white/10 transition-colors">
                            <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                <Lightbulb className="w-4 h-4 text-[#f472b6]" />
                                Contextual Tips
                            </h4>
                            <ul className="space-y-2">
                                {q.tips.map((tip, i) => (
                                    <li key={i} className="flex items-center gap-3 text-xs font-medium text-[var(--text-muted)]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#f472b6]" />
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-4 hover:border-white/10 transition-colors relative overflow-hidden flex flex-col justify-center items-center text-center">
                            <Quote className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-[0.02]" />
                            
                            {showSamples[q.id] ? (
                                <>
                                    <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-2">
                                        <Send className="w-4 h-4 text-[#f472b6]" />
                                        Perfect Model Answer
                                    </h4>
                                    <p className="text-xs text-gray-400 font-medium leading-relaxed italic line-clamp-6">
                                        "{q.sampleDelivery}"
                                    </p>
                                </>
                            ) : (
                                <button 
                                    onClick={() => setShowSamples({...showSamples, [q.id]: true})}
                                    className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[var(--text-main)] text-xs font-bold flex items-center gap-2 hover:bg-white/10 transition-all"
                                >
                                    <Sparkles className="w-4 h-4 text-[#f472b6]" />
                                    Reveal Sample AI Answer
                                </button>
                            )}
                        </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Sidebar Recommendation / Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass rounded-[2.5rem] p-10 border border-[var(--card-border)] bg-[var(--card-bg)] flex items-center gap-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                <Heart className="w-32 h-32 text-[#f472b6]" />
            </div>
            <div className="w-20 h-20 rounded-3xl bg-[#f472b6]/10 flex items-center justify-center border border-[#f472b6]/20 shrink-0">
                <Users className="w-10 h-10 text-[#f472b6]" />
            </div>
            <div className="space-y-2 relative">
                <h3 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">
                    {stats.totalAttempts > 0 ? 'Emotional Intelligence Mastery' : 'Behavioral Identity'}
                </h3>
                <p className="text-sm text-[var(--text-muted)] font-medium max-w-lg">
                    {stats.insights || "HR rounds focus 80% on empathy and culture fit. Practice behavioral questions to unlock personalized AI insights into your communication style."}
                </p>
            </div>
          </div>
          
          <div className="glass rounded-[2.5rem] p-8 border border-[var(--card-border)] bg-[var(--card-bg)] space-y-6 text-center">
              <div className="space-y-1">
                  <p className="text-3xl font-bold text-[var(--text-main)]">{stats.averageScore}/10</p>
                  <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">Avg Behavioral Score</p>
              </div>
              <div className="h-1.5 w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.averageScore / 10) * 100}%` }}
                    className="h-full bg-[#f472b6]"
                />
              </div>
              <button 
                onClick={handleUpdateInsights}
                disabled={isUpdatingInsights}
                className="w-full py-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-xs font-bold hover:bg-black/5 transition-all flex items-center justify-center gap-2"
              >
                {isUpdatingInsights ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-[#f472b6]" />}
                {isUpdatingInsights ? "Analyzing..." : "Update Profile Insights"}
              </button>
          </div>
      </div>
    </div>
  );
};

export default HRPracticePage;
