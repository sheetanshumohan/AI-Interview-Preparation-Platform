import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Timer, 
  Lightbulb, 
  Sparkles, 
  ArrowRight, 
  X, 
  BrainCircuit, 
  CheckCircle2, 
  Clock,
  Loader2,
  Trophy,
  Target,
  BarChart3,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const MockInterviewPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  // States: 'setup' | 'loading' | 'interview' | 'grading' | 'completed'
  const [phase, setPhase] = useState('setup');
  const [setupData, setSetupData] = useState({
    role: user?.role || '',
    difficulty: 'Mid-Level'
  });

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]); // Array of { text, userAnswer, idealAnswer }
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(1800);
  const [showHint, setShowHint] = useState(false);
  const [showIdeal, setShowIdeal] = useState(false);
  const [evaluation, setEvaluation] = useState(null);

  // Timer logic
  useEffect(() => {
    if (phase !== 'interview' || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startInterview = async () => {
    if (!setupData.role) {
      toast.error("Please enter a target role");
      return;
    }
    setPhase('loading');
    try {
      const response = await axios.get(`/ai/mock/generate?role=${setupData.role}&difficulty=${setupData.difficulty}`);
      setQuestions(response.data.questions);
      setPhase('interview');
    } catch (error) {
      console.error("Failed to start interview:", error);
      toast.error("Failed to generate questions. Please try again.");
      setPhase('setup');
    }
  };

  const handleNext = () => {
    // Save current answer
    const updatedAnswers = [...userAnswers, {
      text: questions[currentIndex].text,
      userAnswer: currentAnswer,
      idealAnswer: questions[currentIndex].ideal
    }];
    setUserAnswers(updatedAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setCurrentAnswer("");
      setShowHint(false);
      setShowIdeal(false);
    } else {
      finishInterview(updatedAnswers);
    }
  };

  const finishInterview = async (finalAnswers) => {
    setPhase('grading');
    try {
      const response = await axios.post('/ai/mock/submit', {
        role: setupData.role,
        difficulty: setupData.difficulty,
        questions: finalAnswers
      });
      setEvaluation(response.data.evaluation);
      setPhase('completed');
    } catch (error) {
      console.error("Grading failed:", error);
      toast.error("Failed to grade your interview. Don't worry, your progress is being reviewed.");
      setPhase('completed'); // Still show something
    }
  };

  // --- Setup Phase ---
  if (phase === 'setup') {
    return (
      <div className="max-w-2xl mx-auto py-12 space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
            <BrainCircuit className="w-4 h-4" />
            AI Mock Engine v2.0
          </div>
          <h1 className="text-5xl font-bold text-[var(--text-main)] tracking-tighter">
            Ready to <span className="text-primary italic">Simulate?</span>
          </h1>
          <p className="text-[var(--text-muted)] font-medium">Configure your session for a personalized high-stakes interview experience.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 border border-[var(--card-border)] space-y-6"
        >
          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1">Target Role</label>
            <input 
              type="text"
              value={setupData.role}
              onChange={(e) => setSetupData({...setupData, role: e.target.value})}
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 text-[var(--text-main)] focus:ring-2 ring-primary/20 transition-all outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1">Difficulty Level</label>
            <div className="grid grid-cols-3 gap-3">
              {['Entry', 'Mid-Level', 'Senior'].map(level => (
                <button
                  key={level}
                  onClick={() => setSetupData({...setupData, difficulty: level})}
                  className={`py-3 rounded-2xl border transition-all text-sm font-bold ${setupData.difficulty === level ? 'bg-primary text-black border-primary' : 'bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--text-muted)] hover:border-primary/50'}`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={startInterview}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-primary to-secondary text-black font-bold text-lg shadow-[0_0_30px_rgba(0,210,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Initiate Session
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    );
  }

  // --- Loading / Grading Phase ---
  if (phase === 'loading' || phase === 'grading') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[var(--text-main)]">
            {phase === 'loading' ? 'Generating Questions...' : 'AI Grading in Progress...'}
          </h2>
          <p className="text-[var(--text-muted)] font-medium italic">
            {phase === 'loading' ? 'Tailoring scenarios to your profile...' : 'Analyzing your architectural logic...'}
          </p>
        </div>
      </div>
    );
  }

  // --- Completed Phase ---
  if (phase === 'completed') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        {/* Results Header */}
        <div className="flex flex-col items-center text-center space-y-6 pt-12">
           <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 relative"
           >
              <Trophy className="w-12 h-12 text-primary" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
           </motion.div>

           <div className="space-y-2">
              <h1 className="text-4xl font-bold text-[var(--text-main)] italic">Session <span className="text-primary italic">Graded</span></h1>
              <p className="text-[var(--text-muted)] font-medium">Comprehensive evaluation of your technical performance.</p>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-[2rem] border border-[var(--card-border)] space-y-4">
                <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-primary" />
                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Global Score</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-[var(--text-main)]">{evaluation?.score || 0}</span>
                    <span className="text-xl text-[var(--text-muted)]">/100</span>
                </div>
            </div>

            <div className="glass p-6 rounded-[2rem] border border-[var(--card-border)] md:col-span-2 space-y-4">
                <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">AI Feedback Summary</span>
                </div>
                <p className="text-[var(--text-main)] font-medium leading-relaxed italic">
                  "{evaluation?.feedback || 'Great session! You demonstrated strong core competencies.'}"
                </p>
            </div>
        </div>

        {/* Detailed Feedback */}
        <div className="space-y-6">
           <div className="flex items-center gap-4">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-[var(--text-main)] uppercase tracking-tighter">Question Breakdown</h3>
           </div>

           <div className="space-y-4">
              {userAnswers.map((answer, i) => {
                const feedback = evaluation?.questionFeedback?.find(f => f.text === answer.text);
                return (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass p-8 rounded-[2.5rem] border border-[var(--card-border)] space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Question {i + 1}</span>
                    </div>
                    <h4 className="text-lg font-bold text-[var(--text-main)]">{answer.text}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <div className="space-y-2">
                        <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">Your Response</p>
                        <p className="text-sm text-[var(--text-muted)] leading-relaxed italic border-l-2 border-primary/20 pl-4">
                          {answer.userAnswer}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest">AI Analysis</p>
                        <p className="text-sm text-[var(--text-main)] font-medium leading-relaxed">
                          {feedback?.feedback || 'Solid logical flow and technical understanding.'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
           </div>
        </div>

        <div className="flex justify-center pt-8">
          <button 
              onClick={() => navigate('/dashboard')}
              className="px-12 py-4 rounded-2xl bg-white text-black font-bold shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
              Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // --- Interview Phase ---
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32 relative min-h-[90vh] flex flex-col">
      {/* Immersive Header */}
      <div className="flex items-center justify-between sticky top-0 z-50 py-4 bg-[var(--header-bg)] backdrop-blur-md">
        <div className="flex items-center gap-4">
            <div className="p-2 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] opacity-50">
                <BrainCircuit className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{setupData.role}</span>
              <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{setupData.difficulty} Session</span>
            </div>
        </div>
        
        <div className={`flex items-center gap-3 px-6 py-2.5 rounded-2xl glass border transition-all duration-700 ${timeLeft < 300 ? 'border-red-500/50 bg-red-500/5 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-[var(--card-border)] bg-[var(--card-bg)]'}`}>
            <Clock className={`w-5 h-5 ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-primary'}`} />
            <span className={`text-2xl font-mono font-bold tracking-tighter ${timeLeft < 300 ? 'text-red-500' : 'text-[var(--text-main)]'}`}>
                {formatTime(timeLeft)}
            </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-12 py-10">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIndex}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            className="w-full glass rounded-[3rem] p-12 border border-[var(--card-border)] bg-[var(--card-bg)] shadow-2x-l relative"
          >
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-[80px] -z-10" />
            <div className="flex flex-col gap-6 text-center">
                <div className="flex items-center justify-center gap-2">
                    <span className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] border-b border-primary/30 pb-1">Question {currentIndex + 1} of {questions.length}</span>
                </div>
                <h2 className="text-3xl font-semibold text-[var(--text-main)] tracking-tight leading-tight px-4">{currentQuestion?.text}</h2>
                <AnimatePresence>
                    {showHint && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/20"
                        >
                            <p className="text-sm font-medium text-yellow-500 italic">💡 {currentQuestion?.hint}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="w-full relative group">
          <textarea 
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Describe your approach and architectural reasoning..."
            className="w-full min-h-[300px] bg-transparent border-none text-xl font-medium text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:ring-0 resize-none p-8 leading-relaxed scrollbar-hide"
          />
          <div className="absolute inset-0 border border-[var(--card-border)] bg-[var(--card-bg)] opacity-30 rounded-[2rem] -z-10 group-focus-within:border-primary/20 transition-all pointer-events-none" />
           {!currentAnswer && (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02]">
                    <FileText className="w-48 h-48 text-[var(--text-main)]" />
               </div>
           )}
        </div>
      </div>

      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
        <div className="glass p-4 rounded-[2rem] border border-[var(--card-border)] shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center justify-between gap-4">
            <div className="flex gap-2">
                <button 
                    onClick={() => setShowHint(!showHint)}
                    className={`p-4 rounded-2xl transition-all ${showHint ? 'bg-yellow-500 text-black' : 'bg-[var(--card-bg)] text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                >
                    <Lightbulb className="w-5 h-5" />
                </button>
                <button 
                     onClick={() => setShowIdeal(true)}
                    className="p-4 rounded-2xl bg-[var(--card-bg)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"
                >
                    <Sparkles className="w-5 h-5" />
                </button>
            </div>

            <div className="flex gap-3">
                <button 
                    onClick={() => setPhase('setup')}
                    className="px-6 py-2 rounded-2xl bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500/20 transition-all border border-red-500/20"
                >
                    Abort
                </button>
                <button 
                    onClick={handleNext}
                    disabled={!currentAnswer.trim()}
                    className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-black font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
                >
                    {currentIndex < questions.length - 1 ? 'Next Question' : 'Complete Interview'}
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
      </div>

      <AnimatePresence>
        {showIdeal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-8"
          >
            <motion.div 
               initial={{ scale: 0.95, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               className="w-full max-w-2xl glass rounded-[3rem] p-12 border border-primary/20 space-y-8 relative"
            >
                <button 
                    onClick={() => setShowIdeal(false)}
                    className="absolute top-8 right-8 p-3 rounded-full bg-[var(--card-bg)] hover:bg-black/5 text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--card-border)] transition-all"
                >
                    <X className="w-5 h-5" />
                </button>
                
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2 italic">
                        <Sparkles className="w-6 h-6 text-primary" />
                        AI <span className="text-primary italic">Ideal Rubric</span>
                    </h3>
                    <p className="text-[var(--text-muted)] font-medium leading-relaxed italic border-l-4 border-primary/30 pl-6 py-2">"{currentQuestion?.ideal}"</p>
                </div>

                <div className="space-y-4">
                      <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">Key Performance Indicators</p>
                      <ul className="space-y-3">
                          {["Mentioned design patterns", "Correct optimization reasoning", "Structured communication"].map(point => (
                              <li key={point} className="flex items-center gap-3 text-sm font-semibold text-[var(--text-main)]">
                                  <CheckCircle2 className="w-4 h-4 text-primary" />
                                  {point}
                              </li>
                          ))}
                      </ul>
                </div>

                <button 
                     onClick={() => setShowIdeal(false)}
                    className="w-full py-4 rounded-2xl bg-[var(--card-bg)] text-[var(--text-main)] font-bold text-sm border border-[var(--card-border)] hover:bg-primary/10 transition-all"
                >
                    Close Comparison
                </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 w-full h-1 bg-[var(--card-bg)] z-[60]">
        <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
        />
      </div>
    </div>
  );
};

const FileText = ({ className }) => (
    <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

export default MockInterviewPage;
