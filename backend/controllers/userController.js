const User = require('../models/User');
const pdf = require('pdf-parse');

const calculateCompletionScore = (user) => {
    let score = 0;
    if (user.role) score += 20; // +10
    if (user.experience) score += 15; // +5
    if (user.education) score += 15; // +5
    if (user.skills && user.skills.length > 0) score += 15;
    if (user.targetCompanies && user.targetCompanies.length > 0) score += 10;
    if (user.resume && user.resume.name) score += 15;
    if (user.avatar) score += 10;
    return score;
};

const roleBenchmarks = {
    "MERN Developer": ["React.js", "Node.js", "Express.js", "MongoDB", "Redux", "TypeScript", "Tailwind CSS", "Docker", "AWS", "Jest", "Git", "REST"],
    "Frontend Developer": ["React.js", "Vue.js", "CSS3", "HTML5", "JavaScript", "TypeScript", "Vite", "Testing Library", "Sass", "Webpack", "UI/UX"],
    "Backend Developer": ["Node.js", "Python", "SQL", "PostgreSQL", "Redis", "Microservices", "Docker", "Kubernetes", "gRPC", "RabbitMQ", "Data Structure"],
    "ML Engineer": ["Python", "PyTorch", "TensorFlow", "Pandas", "NumPy", "Scikit-learn", "MLOps", "SQL", "Statistics", "Computer Vision", "NLP"],
    "Data Analyst": ["SQL", "Python", "Pandas", "Tableau", "PowerBI", "Excel", "Statistics", "Data Visualization", "R", "Probability", "BigQuery"],
    "UI/UX Designer": ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research", "Wireframing", "Accessibility", "Design Systems", "Typography", "Color Theory", "Interaction Design"]
};

const powerVerbs = ["led", "developed", "optimized", "spearheaded", "managed", "implemented", "increased", "decreased", "saved", "engineered", "designed", "architected"];

const skillAliases = {
    "React.js": ["react", "reactjs", "react.js", "react js"],
    "Node.js": ["node", "nodejs", "node.js", "node js"],
    "Express.js": ["express", "expressjs", "express.js", "express js"],
    "MongoDB": ["mongo", "mongodb", "mongoose"],
    "TypeScript": ["ts", "typescript"],
    "Tailwind CSS": ["tailwind", "tailwindcss", "tailwind css"],
    "REST": ["rest api", "restful api", "rest"],
    "SQL": ["sql", "mysql", "postgresql", "postgres", "postgres sql"],
    "PostgreSQL": ["postgresql", "postgres", "psql"],
    "Vue.js": ["vue", "vuejs", "vue.js", "vue js"],
    "CSS3": ["css", "css3", "sass", "scss", "style"],
    "HTML5": ["html", "html5"],
    "JavaScript": ["js", "javascript", "ecmascript"],
    "Microservices": ["microservice", "microservices"],
    "Data Structure": ["dsa", "data structures", "algorithms"],
    "AWS": ["aws", "amazon web services", "s3", "ec2", "lambda"],
    "Docker": ["docker", "container", "containers"],
    "Kubernetes": ["k8s", "kubernetes", "kube"],
    "Redux": ["redux", "redux-toolkit", "rtk"],
    "UI/UX": ["ui", "ux", "ui/ux", "user interface", "user experience"],
    "C++": ["c++", "cpp"],
    "C#": ["c#", "csharp"],
    ".NET": [".net", "dotnet", "asp.net"]
};

const normalizeText = (text) => {
    if (!text) return "";
    // 1. Basic cleaning
    let cleaned = text.toLowerCase()
        .replace(/[\n\r\t]/g, ' ')
        .replace(/\u00a0/g, ' ')
        .replace(/[^a-z0-9+#. ]/g, ' '); // Replace fancy bullets/symbols with space
        
    // 2. Heal character-spaced text (e.g., "r e a c t" -> "react")
    // This looks for single letters separated by single spaces
    cleaned = cleaned.replace(/([a-z])\s(?=[a-z]\s)/g, '$1');
    
    // 3. Final collapse
    return cleaned.replace(/\s+/g, ' ').trim();
};

const countOccurrences = (text, skill) => {
    if (!text || !skill) return 0;
    
    const aliases = skillAliases[skill] || [skill];
    let totalCount = 0;
    
    // Normalize text once for this check
    const normalizedText = text; 

    aliases.forEach(alias => {
        const escaped = alias.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // More inclusive regex: allow skills to be surrounded by almost any delimiter
        // while still preventing partial matches like "C" in "CSS"
        const regex = new RegExp(`(?:^|[^a-z0-9+#.])(${escaped})(?![a-z0-9+#.])`, 'gi');
        totalCount += (normalizedText.match(regex) || []).length;
    });
    
    return totalCount;
};

const generateResumeAnalysis = async (user) => {
    const role = user.role || "MERN Developer";
    const userSkills = user.skills || [];
    const benchmarks = roleBenchmarks[role] || roleBenchmarks["MERN Developer"];
    
    let extractedText = "";
    let impactScore = 0;
    let metricsScore = 0;
    let keywordFreqs = {};
    let foundVerbs = [];
    let foundMetrics = [];

    // 1. Attempt PDF Text Extraction
    if (user.resume && user.resume.url && user.resume.url.includes('base64')) {
        try {
            const dataBuffer = Buffer.from(user.resume.url.split(',')[1], 'base64');
            const result = await pdf(dataBuffer);
            extractedText = normalizeText(result.text);
            
            // 2. Scan for Action Verbs (Impact)
            foundVerbs = powerVerbs.filter(verb => extractedText.includes(verb));
            impactScore = Math.min((foundVerbs.length / 5) * 20, 20); 
            
            // 3. Scan for Metrics (%, $, numbers)
            const metricRegex = /(\d+%|\$\d+|\d+\s*years|\d+\s*months|increased|decreased|improved|growth)/g;
            foundMetrics = extractedText.match(metricRegex) || [];
            metricsScore = Math.min((foundMetrics.length / 4) * 20, 20);
            
            // 4. Detailed Keyword Frequency
            benchmarks.forEach(skill => {
                keywordFreqs[skill] = countOccurrences(extractedText, skill);
            });
            
        } catch (error) {
            console.error('Error parsing PDF:', error);
            extractedText = ""; 
        }
    }

    // 5. Keyword Matching & Optimization (Strictly Resume-based detection)
    const strengths = benchmarks.filter(b => (keywordFreqs[b] || 0) > 0);
    const missingKeywords = benchmarks.filter(b => (keywordFreqs[b] || 0) === 0);

    const keywordOptimization = benchmarks
        .map(k => {
            const count = keywordFreqs[k] || 0;
            const standard = 3; 
            const gap = Math.max(0, standard - count);
            return {
                k,
                f: `${count}x`,
                s: `${standard}x`,
                i: count < standard ? `+${(gap * 4.5).toFixed(1)}% Match` : 'Optimized',
                gap
            };
        })
        .sort((a, b) => b.gap - a.gap)
        .slice(0, 6);

    // 6. Detailed Section Analysis
    const detailedAnalysis = {
        header: {
            score: user.name && user.email ? 90 : 40,
            feedback: user.name && user.email ? "Contact information is correctly formatted." : "Missing critical contact information."
        },
        summary: {
            score: extractedText && extractedText.length > 50 ? 85 : 30,
            feedback: extractedText && extractedText.length > 50 ? "Your professional summary is concise and keyword-rich." : "Consider adding a strong 3-4 sentence professional summary."
        },
        experience: {
            score: Math.round(impactScore * 2.5 + metricsScore * 2.5),
            feedback: impactScore < 10 
                ? `Found verbs: ${foundVerbs.join(', ') || 'None'}. Try adding words like ${powerVerbs.filter(v => !foundVerbs.includes(v)).slice(0, 3).join(', ')} to show more leadership.` 
                : `Excellent use of action verbs: ${foundVerbs.slice(0, 4).join(', ')}.`
        },
        education: {
            score: user.education ? 95 : 20,
            feedback: user.education ? "Education history is clear." : "Detail your educational background."
        },
        skills: {
            score: Math.round((strengths.length / benchmarks.length) * 100),
            feedback: missingKeywords.length > 5 ? `Add more technical skills like ${missingKeywords.slice(0, 2).join(', ')}.` : "Excellent technical skill coverage."
        }
    };

    // 7. Composite Scoring
    const keywordScore = Math.min((strengths.length / benchmarks.length) * 50, 50); 
    const baseScore = 15; 
    
    let totalScore = Math.round(baseScore + keywordScore + impactScore + metricsScore);
    totalScore = Math.min(totalScore, 98);

    // 8. Roadmap & Checklist
    const roadmap = [
        `Identify 3 projects where you used ${strengths[0] || 'core technologies'} and quantify results.`,
        `Integrate ${missingKeywords.slice(0, 2).join(' and ')} keywords naturally into your experience section.`,
        `Rewrite summary to focus on your goal of becoming a top-tier ${role}.`,
        `Run a final ATS scan after these updates to reach 95+ score.`
    ];

    const checklist = [
        { text: "Include quantifiable achievements", completed: metricsScore > 10 },
        { text: "Use strong action verbs", completed: impactScore > 10 },
        { text: `Optimize for '${missingKeywords[0] || benchmarks[0]}' keyword`, completed: strengths.includes(missingKeywords[0]) },
        { text: "Standardize formatting", completed: true },
        { text: "Maintain professional summary", completed: extractedText.length > 100 },
    ];

    const featuredImprovement = {
        title: impactScore < 10 ? "Impact Word Optimization" : metricsScore < 10 ? "Add Quantifiable Metrics" : `${role} Specialization`,
        description: impactScore < 10 ? "Your resume lacks action verbs. Try using words like 'Spearheaded' or 'Optimized' to show leadership." : 
                     metricsScore < 10 ? "Quantify your work! Use percentages or numbers to show the real impact of your contributions." :
                     `Focus on mastering ${missingKeywords[0] || 'advanced tools'} to stay competitive as a ${role}.`,
        progress: totalScore,
        roadmap
    };

    // 9. Final De-duplication and Formatting
    const areSkillsEquivalent = (s1, s2) => {
        if (!s1 || !s2) return false;
        const lower1 = s1.toLowerCase();
        const lower2 = s2.toLowerCase();
        if (lower1 === lower2) return true;
        
        // Check if one is an alias of the other or they share a group
        const group1 = skillAliases[s1] || [s1];
        const group2 = skillAliases[s2] || [s2];
        return group1.some(a => a.toLowerCase() === lower2) || group2.some(a => a.toLowerCase() === lower1);
    };

    const finalStrengths = strengths.length > 0 
        ? strengths 
        : Array.from(new Set([...userSkills, ...benchmarks.slice(0, 3)]));

    // Remove anything from missing that is already covered by strengths (including aliases)
    const finalMissing = missingKeywords.filter(m => 
        !finalStrengths.some(s => areSkillsEquivalent(s, m))
    );

    return {
        score: totalScore || 45,
        strengths: finalStrengths,
        missingKeywords: finalMissing.length > 0 ? finalMissing : ["Cloud Infrastructure", "System Scalability"],
        keywordOptimization,
        checklist,
        featuredImprovement,
        detailedAnalysis
    };
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        const completionScore = calculateCompletionScore(user);
        res.status(200).json({ success: true, user, completionScore });
    } catch (error) {
        console.error('Error in getProfile:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, email, role, experience, education, skills, targetCompanies, resume, avatar } = req.body;
        
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const oldResumeUrl = user.resume?.url;

        // Update fields if provided
        if (name) user.name = name;
        if (email) user.email = email;
        if (role !== undefined) user.role = role;
        if (experience !== undefined) user.experience = experience;
        if (education !== undefined) user.education = education;
        if (skills !== undefined) user.skills = skills;
        if (targetCompanies !== undefined) user.targetCompanies = targetCompanies;
        if (resume !== undefined) user.resume = resume;
        if (avatar !== undefined) user.avatar = avatar;

        // Trigger analysis if resume is new or role/skills changed
        if (resume?.url !== oldResumeUrl || role !== undefined || skills !== undefined) {
            user.resumeAnalysis = await generateResumeAnalysis(user);
        }

        await user.save();
        
        const completionScore = calculateCompletionScore(user);

        res.status(200).json({ success: true, message: 'Profile updated successfully', user, completionScore });
    } catch (error) {
        console.error('Error in updateProfile:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getAnalysis = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('resume resumeAnalysis role skills');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        if (!user.resume || !user.resume.url) {
            return res.status(200).json({ success: true, analysis: null, message: "No resume uploaded yet" });
        }

        // If for some reason analysis is missing but resume exists, generate it
        if (!user.resumeAnalysis || user.resumeAnalysis.score === 0) {
            user.resumeAnalysis = await generateResumeAnalysis(user);
            await user.save();
        }

        res.status(200).json({ success: true, analysis: user.resumeAnalysis });
    } catch (error) {
        console.error('Error in getAnalysis:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const toggleChecklistItem = async (req, res) => {
    try {
        const { index } = req.params;
        const user = await User.findById(req.userId);
        if (!user || !user.resumeAnalysis) {
            return res.status(404).json({ success: false, message: 'Analysis not found' });
        }

        if (user.resumeAnalysis.checklist[index]) {
            user.resumeAnalysis.checklist[index].completed = !user.resumeAnalysis.checklist[index].completed;
            await user.save();
            return res.status(200).json({ success: true, checklist: user.resumeAnalysis.checklist });
        }

        res.status(400).json({ success: false, message: 'Invalid checklist item' });
    } catch (error) {
        console.error('Error in toggleChecklistItem:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getDashboardData = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .select('name role completionScore mockInterviewHistory hrPracticeHistory resumeAnalysis skills targetCompanies');
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Calculate Stats
        const mockScores = user.mockInterviewHistory.map(h => h.score || 0);
        const hrScores = user.hrPracticeHistory.map(h => h.score || 0);
        const allScores = [...mockScores, ...hrScores];
        
        const avgScore = allScores.length > 0 
            ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1)
            : 0;

        const totalInterviews = user.mockInterviewHistory.length;
        const totalPractice = user.hrPracticeHistory.length;
        
        const completionScore = calculateCompletionScore(user);

        // Performance Insight (Last 6 Months)
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const performanceData = [];
        const now = new Date();
        
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const mName = monthNames[d.getMonth()];
            
            // Average score for this month
            const monthInterviews = user.mockInterviewHistory.filter(h => {
                const hDate = new Date(h.completedAt);
                return hDate.getMonth() === d.getMonth() && hDate.getFullYear() === d.getFullYear();
            });
            
            const monthHR = user.hrPracticeHistory.filter(h => {
                const hDate = new Date(h.completedAt);
                return hDate.getMonth() === d.getMonth() && hDate.getFullYear() === d.getFullYear();
            });

            const combined = [...monthInterviews.map(i => i.score), ...monthHR.map(h => h.score)];
            const mScore = combined.length > 0 
                ? Math.round(combined.reduce((a, b) => a + b, 0) / combined.length * 10) 
                : (i === 5 ? 0 : performanceData[performanceData.length - 1]?.score || 0); // Fill gaps with prev or 0

            performanceData.push({ name: mName, score: mScore });
        }

        // Recent Activity
        const recentMock = user.mockInterviewHistory.map(h => ({
            type: 'Interview',
            label: `${h.role} Mock`,
            time: h.completedAt,
            status: 'Completed',
            score: h.score ? (h.score).toFixed(1) : 'N/A'
        }));

        const recentHR = user.hrPracticeHistory.map(h => ({
            type: 'Practice',
            label: h.question.length > 30 ? h.question.substring(0, 30) + '...' : h.question,
            time: h.completedAt,
            status: 'Passed',
            score: h.score ? (h.score * 10).toFixed(0) + '%' : 'N/A'
        }));

        const recentResume = user.resumeAnalysis && user.resumeAnalysis.score ? [{
            type: 'Resume',
            label: 'Resume Analysis',
            time: user.updatedAt,
            status: 'Analyzed',
            score: user.resumeAnalysis.score
        }] : [];

        const recentActivity = [...recentMock, ...recentHR, ...recentResume]
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .slice(0, 4)
            .map(a => {
                // Humanize time (basic)
                const diff = Math.floor((new Date() - new Date(a.time)) / (1000 * 60 * 60));
                let timeStr = 'Just now';
                if (diff > 0 && diff < 24) timeStr = `${diff} hours ago`;
                else if (diff >= 24 && diff < 48) timeStr = 'Yesterday';
                else if (diff >= 48) timeStr = `${Math.floor(diff/24)} days ago`;
                
                return { ...a, time: timeStr };
            });

        res.status(200).json({
            success: true,
            dashboard: {
                user: {
                    name: user.name.split(' ')[0],
                    role: user.role || 'Career Explorer'
                },
                stats: [
                    { label: "Overall Progress", value: `${completionScore}%`, icon: 'TrendingUp', color: "text-primary", bg: "bg-primary/10" },
                    { label: "AI Mock Score", value: `${avgScore}/10`, icon: 'BrainCircuit', color: "text-secondary", bg: "bg-secondary/10" },
                    { label: "Interviews", value: totalInterviews + totalPractice, icon: 'CheckCircle2', color: "text-accent", bg: "bg-accent/10" },
                    { label: "Achievements", value: allScores.filter(s => s >= 8).length, icon: 'Star', color: "text-yellow-500", bg: "bg-yellow-500/10" },
                ],
                performanceData,
                recentActivity
            }
        });

    } catch (error) {
        console.error('Error in getDashboardData:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getAnalysis,
    toggleChecklistItem,
    getDashboardData
};
