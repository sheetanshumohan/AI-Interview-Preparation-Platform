import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Briefcase, 
  GraduationCap, 
  Plus, 
  X, 
  Upload, 
  FileText, 
  Save, 
  ChevronDown, 
  Building2, 
  CheckCircle2, 
  Camera,
  Download,
  Trash2,
  Eye
} from 'lucide-react';
import FloatingInput from '../components/FloatingInput';
import axios from '../lib/axios';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const roles = ["MERN Developer", "Frontend Developer", "Backend Developer", "ML Engineer", "Data Analyst", "UI/UX Designer"];
const expLevels = ["Fresher", "1-2 Years", "3-5 Years", "5+ Years"];

const ProfilePage = () => {
  const { user, checkAuth } = useAuthStore();
  const [profileImage, setProfileImage] = useState(null);
  const [skills, setSkills] = useState([]);
  const [targetCompanies, setTargetCompanies] = useState([]);
  const [resume, setResume] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [completionScore, setCompletionScore] = useState(0);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    experience: '',
    education: ''
  });

  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/user/profile');
        if (response.data.success) {
          const userData = response.data.user;
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            role: userData.role || roles[0],
            experience: userData.experience || expLevels[0],
            education: userData.education || ''
          });
          setSkills(userData.skills || []);
          setTargetCompanies(userData.targetCompanies || []);
          setResume(userData.resume || null);
          setProfileImage(userData.avatar || null);
          setCompletionScore(response.data.completionScore || 0);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setResume({
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          date: new Date().toLocaleDateString(),
          url: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadResume = () => {
    if (!resume || !resume.url) {
      toast.error('No resume data found to download');
      return;
    }
    
    try {
      // Convert Data URL to Blob
      const byteString = atob(resume.url.split(',')[1]);
      const mimeString = resume.url.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = resume.name || 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast.error('Failed to download resume');
    }
  };

  const handleViewResume = () => {
    if (!resume || !resume.url) {
      toast.error('No resume data found to view');
      return;
    }

    try {
      // Convert Data URL to Blob
      const byteString = atob(resume.url.split(',')[1]);
      const mimeString = resume.url.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const objectUrl = URL.createObjectURL(blob);
      
      const newWindow = window.open(objectUrl, '_blank');
      if (!newWindow) {
        toast.error('Please allow popups to view the resume');
      }
      
      // We can't easily revokeObjectURL for a new tab without risking it being revoked before loading
      // But browsers usually handle this when the tab is closed or navigation happens
    } catch (error) {
      console.error('Error viewing resume:', error);
      toast.error('Failed to view resume');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await axios.put('/user/profile', {
        ...formData,
        skills,
        targetCompanies,
        resume,
        avatar: profileImage
      });
      if (response.data.success) {
        // Update the auth store so other parts of the app have the new user data
        await checkAuth();
        setCompletionScore(response.data.completionScore || 0);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

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

  return (
    <div className="space-y-8 pb-32 relative">
      {/* Header Section with Profile Image */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-64 rounded-[2.5rem] overflow-hidden group shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white/20 overflow-hidden bg-black/40 backdrop-blur-xl shadow-2xl relative group/avatar">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white/40" />
                </div>
              )}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
            {/* Animated Glow behind avatar */}
            <div className="absolute -inset-4 bg-white/20 rounded-full blur-2xl -z-10 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-main)] mt-4 tracking-tight drop-shadow-lg">{formData.name}</h1>
          <p className="text-[var(--text-muted)] font-medium">{formData.role} • {formData.experience}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information Section */}
        <SectionCard title="Basic Information" icon={User}>
          <div className="space-y-4">
            <FloatingInput 
              label="Full Name" 
              id="profile-name"
              icon={User} 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
            <FloatingInput 
              label="Email Address" 
              id="profile-email"
              type="email" 
              icon={Mail} 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
          </div>
        </SectionCard>

        {/* Career Details Section */}
        <SectionCard title="Career Aspirations" icon={Briefcase}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomDropdown 
              label="Preferred Role" 
              options={roles} 
              value={formData.role} 
              onChange={(val) => setFormData({...formData, role: val})} 
              icon={Briefcase}
            />
            <CustomDropdown 
              label="Experience Level" 
              options={expLevels} 
              value={formData.experience} 
              onChange={(val) => setFormData({...formData, experience: val})} 
              icon={GraduationCap}
            />
          </div>
          <div className="mt-6">
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold mb-3 px-2">Key Skills</p>
            <ChipInput 
              tags={skills} 
              setTags={setSkills} 
              placeholder="Add a skill..." 
              color="primary"
            />
          </div>
        </SectionCard>

        {/* Education Section */}
        <SectionCard title="Education" icon={GraduationCap}>
          <div className="relative">
            <textarea 
              className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 text-[var(--text-main)] font-medium focus:ring-2 ring-primary/50 transition-all outline-none min-h-[120px]"
              placeholder="Share your educational background..."
              value={formData.education}
              onChange={(e) => setFormData({...formData, education: e.target.value})}
            />
            <GraduationCap className="absolute right-4 top-4 w-5 h-5 text-[var(--text-muted)] opacity-30" />
          </div>
        </SectionCard>

        {/* Target Companies Section */}
        <SectionCard title="Dream Companies" icon={Building2}>
          <p className="text-xs text-[var(--text-muted)] font-medium mb-4 italic px-2">Type company names and press enter to add tags.</p>
          <ChipInput 
            tags={targetCompanies} 
            setTags={setTargetCompanies} 
            placeholder="e.g. Google, Tesla..." 
            color="secondary"
          />
        </SectionCard>

        {/* Resume Section */}
        <div className="lg:col-span-2">
          <SectionCard title="Professional Resume" icon={FileText}>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1 w-full">
                {resume ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 rounded-3xl bg-primary/5 border border-primary/20 flex items-center justify-between group shadow-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-4 rounded-2xl bg-primary/10">
                        <FileText className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <p className="text-[var(--text-main)] font-semibold truncate max-w-[200px]">{resume.name}</p>
                        <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">{resume.size} • Uploaded on {resume.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <button 
                        onClick={handleViewResume}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"
                        title="View Resume"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                       <button 
                        onClick={handleDownloadResume}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"
                        title="Download Resume"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setResume(null)}
                        className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500/60 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <button 
                    onClick={() => resumeInputRef.current?.click()}
                    className="w-full py-12 rounded-[2rem] border-2 border-dashed border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-black/5 hover:border-primary/30 transition-all group flex flex-col items-center justify-center gap-4"
                  >
                    <div className="p-4 rounded-full bg-[var(--card-bg)] group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-[var(--text-muted)] group-hover:text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-[var(--text-main)] font-semibold">Upload your latest resume</p>
                      <p className="text-xs text-[var(--text-muted)] font-medium">Supports PDF, DOCX (Max 5MB)</p>
                    </div>
                  </button>
                )}
                <input 
                  type="file" 
                  ref={resumeInputRef} 
                  className="hidden" 
                  accept=".pdf,.doc,.docx" 
                  onChange={handleResumeUpload} 
                />
              </div>
              
              <div className="w-full md:w-64 p-6 rounded-3xl glass border border-[var(--card-border)] space-y-4">
                <h4 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  AI Ready Profile
                </h4>
                <div className="space-y-2">
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${completionScore}%` }}
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                    />
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] font-bold">Your profile is {completionScore}% complete for AI analysis.</p>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Floating Save Button */}
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50"
      >
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="group relative px-12 py-5 rounded-full bg-[var(--sidebar-bg)] backdrop-blur-3xl border border-[var(--card-border)] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center gap-3 transition-all active:scale-95"
        >
          {/* Neon Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
          
          {isSaving ? (
            <>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              >
                <Save className="w-5 h-5 text-primary" />
              </motion.div>
              <span className="text-[var(--text-main)] font-bold tracking-tight">Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-[var(--text-main)] font-bold tracking-tight">Save Profile</span>
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};

const SectionCard = ({ title, icon: Icon, children }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.98 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="glass rounded-[2.5rem] p-8 border border-[var(--card-border)] shadow-2xl relative overflow-hidden group"
  >
    <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
      <Icon className="w-24 h-24" />
    </div>
    <h2 className="text-xl font-semibold text-[var(--text-main)] flex items-center gap-3 mb-8 relative">
      <div className="p-2 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)]">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      {title}
    </h2>
    <div className="relative">
      {children}
    </div>
  </motion.div>
);

const CustomDropdown = ({ label, options, value, onChange, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  return (
    <div className="relative mb-4">
       <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold mb-2 px-2">{label}</p>
       <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-4 py-4 rounded-2xl bg-[var(--card-bg)] ring-1 ring-[var(--card-border)] hover:bg-black/5 cursor-pointer transition-all ${isOpen ? 'ring-primary/50 bg-white/5 shadow-lg' : ''}`}
       >
        <Icon className={`w-5 h-5 ${isOpen ? 'text-primary' : 'text-[var(--text-muted)]'}`} />
        <span className="text-[var(--text-main)] font-semibold text-sm flex-1">{value}</span>
        <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
       </div>
       
       <AnimatePresence>
         {isOpen && (
           <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 5, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute z-50 w-full bg-[var(--sidebar-bg)] border border-[var(--card-border)] rounded-2xl overflow-hidden shadow-2xl backdrop-blur-3xl p-1"
           >
             {options.map((opt) => (
                <div 
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${value === opt ? 'bg-primary/20 text-primary' : 'text-[var(--text-muted)] hover:bg-black/5 hover:text-[var(--text-main)]'}`}
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

const ChipInput = ({ tags, setTags, placeholder, color = 'primary' }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const colorClasses = {
    primary: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
    secondary: 'bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20'
  };

  return (
    <div className="flex flex-wrap gap-2 p-1">
      <AnimatePresence initial={false}>
        {tags.map((tag) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${colorClasses[color]}`}
          >
            {tag}
            <button onClick={() => removeTag(tag)} className="hover:scale-110 transition-transform">
              <X className="w-3 h-3" />
            </button>
          </motion.span>
        ))}
      </AnimatePresence>
      <input 
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="bg-transparent border-none outline-none text-[var(--text-main)] text-xs font-semibold px-2 py-1.5 min-w-[120px] placeholder:text-[var(--text-muted)] opacity-70"
      />
    </div>
  );
};

export default ProfilePage;
