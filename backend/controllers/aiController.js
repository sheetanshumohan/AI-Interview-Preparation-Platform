const OpenAI = require("openai");
const User = require("../models/User");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * @desc Generate technical interview questions using OpenAI
 */
const generateQuestions = async (req, res) => {
    try {
        const { role, topic, difficulty, count } = req.body;

        if (!role || !difficulty) {
            return res.status(400).json({ success: false, message: "Role and difficulty are required" });
        }

        const prompt = `
            You are an expert technical interviewer for a top-tier tech company. 
            Your task is to generate ${count || 5} unique, high-quality interview questions for a ${role} position.
            ${topic ? `The focus of these questions should be on: ${topic}.` : ""}
            The difficulty level should be: ${difficulty}.

            Return the response strictly as a JSON array of objects. Each object must have the following structure:
            {
                "id": number (unique within this array),
                "text": "The question text",
                "category": "A short category name (e.g., Frontend, Backend, System Design, Behavioral)",
                "difficulty": "${difficulty}"
            }

            Do not include any introductory or concluding text. Only return the JSON array.
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a specialized technical interview assistant." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        const content = response.choices[0].message.content;
        let questions;
        
        try {
            const parsed = JSON.parse(content);
            questions = Array.isArray(parsed) ? parsed : (parsed.questions || Object.values(parsed)[0]);
            if (!Array.isArray(questions)) questions = [parsed];
        } catch (parseError) {
            console.error("AI parsing error:", parseError);
            return res.status(500).json({ success: false, message: "AI generated invalid JSON", debug: content });
        }

        res.status(200).json({
            success: true,
            questions: questions.slice(0, count || 5)
        });

    } catch (error) {
        console.error("Error in generateQuestions:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to generate questions" });
    }
};

/**
 * @desc Generate a follow-up question using OpenAI
 */
const generateFollowUp = async (req, res) => {
    try {
        const { question, role } = req.body;
        if (!question) return res.status(400).json({ success: false, message: "Original question is required" });

        const prompt = `
            Original Question: "${question}"
            Role: ${role || "Technical Candidate"}
            
            Based on the question above, generate one high-quality, probing follow-up question that an interviewer would ask to dig deeper into the candidate's understanding.
            Keep it concise and relevant. Return only the follow-up question text.
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });

        res.status(200).json({ success: true, followUp: response.choices[0].message.content.trim() });
    } catch (error) {
        console.error("Error in generateFollowUp:", error);
        res.status(500).json({ success: false, message: "Failed to generate follow-up" });
    }
};

/**
 * @desc Generate a sample AI answer for a question
 */
const getAIAnswer = async (req, res) => {
    try {
        const { question } = req.body;
        if (!question) return res.status(400).json({ success: false, message: "Question is required" });

        const prompt = `
            Question: "${question}"
            
            Provide a comprehensive, expert-level sample answer for this technical interview question. 
            Include key concepts, best practices, and a brief example if applicable.
            Format the answer clearly with bullet points if helpful.
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });

        res.status(200).json({ success: true, answer: response.choices[0].message.content.trim() });
    } catch (error) {
        console.error("Error in getAIAnswer:", error);
        res.status(500).json({ success: false, message: "Failed to generate answer" });
    }
};

/**
 * @desc Toggle save question for a user
 */
const toggleSaveQuestion = async (req, res) => {
    try {
        const { text, category, difficulty, answer } = req.body;
        const normalizedText = text.trim();
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const existingIndex = user.savedQuestions.findIndex(q => q.text.trim() === normalizedText);

        if (existingIndex > -1) {
            user.savedQuestions.splice(existingIndex, 1);
            await user.save();
            return res.status(200).json({ success: true, message: "Question removed from saved", isSaved: false });
        } else {
            const folder = 'General';
            user.savedQuestions.push({ text, category, difficulty, answer, folder });
            
            // Ensure folder exists in folder list
            if (!user.questionFolders.includes(folder)) {
                user.questionFolders.push(folder);
            }
            
            await user.save();
            return res.status(200).json({ success: true, message: "Question saved successfully", isSaved: true });
        }
    } catch (error) {
        console.error("Error in toggleSaveQuestion:", error);
        res.status(500).json({ success: false, message: "Failed to toggle save" });
    }
};

/**
 * @desc Get all saved questions for a user
 */
const getSavedQuestions = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("savedQuestions");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.status(200).json({ success: true, questions: user.savedQuestions });
    } catch (error) {
        console.error("Error in getSavedQuestions:", error);
        res.status(500).json({ success: false, message: "Failed to fetch saved questions" });
    }
};

/**
 * @desc Toggle favorite status on a saved question
 */
const toggleFavoriteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const question = user.savedQuestions.id(id);
        if (!question) return res.status(404).json({ success: false, message: "Question not found" });

        question.isFavorite = !question.isFavorite;
        await user.save();

        res.status(200).json({ success: true, isFavorite: question.isFavorite });
    } catch (error) {
        console.error("Error in toggleFavoriteQuestion:", error);
        res.status(500).json({ success: false, message: "Failed to toggle favorite" });
    }
};

/**
 * @desc Delete a saved question
 */
const deleteSavedQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        user.savedQuestions = user.savedQuestions.filter(q => q._id.toString() !== id);
        await user.save();

        res.status(200).json({ success: true, message: "Question deleted" });
    } catch (error) {
        console.error("Error in deleteSavedQuestion:", error);
        res.status(500).json({ success: false, message: "Failed to delete question" });
    }
};

/**
 * @desc Export generated questions and session data as CSV
 */
const exportQuestions = async (req, res) => {
    try {
        const { data } = req.body; // Array of { text, category, difficulty, answer, followUp }

        if (!data || !Array.isArray(data)) {
            return res.status(400).json({ success: false, message: "Invalid data format" });
        }

        // CSV Headers
        let csvContent = "Question,Category,Difficulty,Sample Answer,Follow-up Question\n";

        // Helper function to escape CSV values
        const escapeCSV = (str) => {
            if (!str) return '""';
            const escaped = str.toString().replace(/"/g, '""');
            return `"${escaped}"`;
        };

        data.forEach(item => {
            csvContent += `${escapeCSV(item.text)},${escapeCSV(item.category)},${escapeCSV(item.difficulty)},${escapeCSV(item.answer)},${escapeCSV(item.followUp)}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=interview_questions.csv');
        res.status(200).send(csvContent);

    } catch (error) {
        console.error("Error in exportQuestions:", error);
        res.status(500).json({ success: false, message: "Failed to export data" });
    }
};

/**
 * @desc Generate dynamic HR/Behavioral questions using OpenAI
 */
const generateHRQuestions = async (req, res) => {
    try {
        const { role } = req.query;
        const user = await User.findById(req.userId);
        const targetRole = role || user?.profile?.role || "Software Professional";

        const prompt = `
            You are an expert HR Interviewer. 
            Generate 5 unique, high-quality behavioral interview questions for a ${targetRole} candidate.
            
            Return the response strictly as a JSON object with a "questions" array. Each object must have:
            {
                "id": number,
                "question": "The question text",
                "category": "e.g., Leadership, Conflict Resolution, Adaptability",
                "strategy": "A brief explanation of what the interviewer is looking for",
                "tips": ["Tip 1", "Tip 2"],
                "sampleDelivery": "A perfect example of an answer using the STAR method"
            }
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "system", content: "You are a specialized behavioral interview assistant." }, { role: "user", content: prompt }],
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        const parsed = JSON.parse(response.choices[0].message.content);
        res.status(200).json({ success: true, questions: parsed.questions });

    } catch (error) {
        console.error("Error in generateHRQuestions:", error);
        res.status(500).json({ success: false, message: "Failed to generate HR questions" });
    }
};

/**
 * @desc Evaluate an HR answer using the STAR method and update user stats
 */
const evaluateHRAnswer = async (req, res) => {
    try {
        const { question, answer } = req.body;
        if (!question || !answer) return res.status(400).json({ success: false, message: "Question and answer are required" });

        const prompt = `
            Question: "${question}"
            Candidate Answer: "${answer}"
            
            Analyze the answer strictly using the STAR method (Situation, Task, Action, Result).
            Provide a score (out of 10), general feedback, a breakdown of each STAR component, and 3 specific improvements.
            
            Return response as JSON:
            {
                "score": number,
                "feedback": "...",
                "starAnalysis": {
                    "situation": "...",
                    "task": "...",
                    "action": "...",
                    "result": "..."
                },
                "improvements": ["...", "...", "..."]
            }
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "system", content: "You are an expert HR coach specialized in the STAR method." }, { role: "user", content: prompt }],
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        const evaluation = JSON.parse(response.choices[0].message.content);

        // Update User Stats
        const user = await User.findById(req.userId);
        if (user) {
            user.hrAnalysis.scores.push(evaluation.score);
            user.hrAnalysis.totalAttempts += 1;
            
            // Recalculate Average
            const total = user.hrAnalysis.scores.reduce((acc, curr) => acc + curr, 0);
            user.hrAnalysis.averageScore = parseFloat((total / user.hrAnalysis.totalAttempts).toFixed(1));

            // Auto-update insights every 5 attempts
            if (user.hrAnalysis.totalAttempts % 5 === 0) {
                const insights = await generateInternalHRInsights(user);
                user.hrAnalysis.insights = insights;
            }

            // Save individual practice session to history
            user.hrPracticeHistory.push({
                question,
                answer,
                score: evaluation.score,
                feedback: evaluation.feedback,
                starAnalysis: evaluation.starAnalysis,
                improvements: evaluation.improvements,
                completedAt: new Date()
            });

            await user.save();
        }

        res.status(200).json({ success: true, evaluation });

    } catch (error) {
        console.error("Error in evaluateHRAnswer:", error);
        res.status(500).json({ success: false, message: "Failed to evaluate answer" });
    }
};

/**
 * @desc Get user's HR practice stats
 */
const getHRStats = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('hrAnalysis');
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.status(200).json({ success: true, stats: user.hrAnalysis });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch HR stats" });
    }
};

/**
 * @desc Manually update HR insights
 */
const updateHRInsights = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const insights = await generateInternalHRInsights(user);
        user.hrAnalysis.insights = insights;
        await user.save();

        res.status(200).json({ success: true, insights });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update insights" });
    }
};

/**
 * Helper to generate insights based on performance
 */
const generateInternalHRInsights = async (user) => {
    try {
        if (!user.hrAnalysis.scores || user.hrAnalysis.scores.length === 0) {
            return "You haven't completed any behavioral practice sessions yet. Start a session to unlock personalized AI insights into your communication style.";
        }

        const scoresString = user.hrAnalysis.scores.join(', ');
        const prompt = `
            Analyze the following behavioral interview performance scores for a ${user.profile?.role || 'professional'}:
            Scores (out of 10): ${scoresString}
            Target Role: ${user.profile?.role || 'Not specified'}
            
            Provide a 2-3 sentence sophisticated, encouraging, and highly professional "Behavioral Identity" summary. 
            Focus on what these scores suggest about their soft skills, leadership, and readiness.
            Return ONLY the text summary.
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "system", content: "You are a senior HR consultant summarizing a candidate's potential." }, { role: "user", content: prompt }],
            temperature: 0.7,
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error("Insight generation error:", error);
        return "You are building a consistent record of behavioral excellence. Keep practicing to unlock deeper analysis.";
    }
};

const fs = require('fs');
const path = require('path');

/**
 * @desc Transcribe audio to text using OpenAI Whisper
 */
const transcribeAudio = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No audio file provided" });
        }

        const filePath = req.file.path;

        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: "whisper-1",
        });

        // Clean up the temporary file
        fs.unlinkSync(filePath);

        res.status(200).json({ success: true, text: transcription.text });
    } catch (error) {
        console.error("Error in transcribeAudio:", error);
        // Clean up even on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ success: false, message: "Failed to transcribe audio" });
    }
};

/**
 * @desc Generate a full technical mock interview session
 */
const generateMockInterviewSession = async (req, res) => {
    try {
        const { role, difficulty } = req.query;
        if (!role || !difficulty) {
            return res.status(400).json({ success: false, message: "Role and difficulty are required" });
        }

        const prompt = `
            You are an elite technical interviewer. Generate 3 unique, challenging interview questions for a ${role} position at ${difficulty} level.
            
            Return the response strictly as a JSON object with a "questions" array. Each object MUST have:
            {
                "id": number,
                "text": "The question text",
                "hint": "A subtle, helpful hint (1 sentence)",
                "ideal": "A concise, expert-level ideal answer rubric"
            }
            
            Make the questions relevant to modern industry standards.
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a specialized technical interview architect." },
                { role: "user", content: prompt }
            ],
            temperature: 0.8,
            response_format: { type: "json_object" }
        });

        const parsed = JSON.parse(response.choices[0].message.content);
        res.status(200).json({ success: true, questions: parsed.questions });

    } catch (error) {
        console.error("Error in generateMockInterviewSession:", error);
        res.status(500).json({ success: false, message: "Failed to generate interview session" });
    }
};

/**
 * @desc Submit and grade a full mock interview session
 */
const submitMockInterviewSession = async (req, res) => {
    try {
        const { role, difficulty, questions } = req.body; // questions: [{ text, userAnswer, idealAnswer }]
        if (!questions || !Array.isArray(questions)) {
            return res.status(400).json({ success: false, message: "Questions and answers are required" });
        }

        const prompt = `
            You are a senior technical lead grading a candidate's mock interview results.
            Role: ${role}
            Difficulty: ${difficulty}
            
            Evaluate the following question-answer pairs:
            ${questions.map((q, i) => `
            Question ${i+1}: ${q.text}
            Candidate Answer: ${q.userAnswer}
            Reference Ideal Answer: ${q.idealAnswer}
            `).join('\n')}
            
            Provide a total score out of 100, a professional feedback summary, and individual feedback for each question.
            
            Return response as JSON:
            {
                "score": number,
                "feedback": "Overall feedback summary",
                "questionFeedback": [
                    { "text": "Question text", "feedback": "Brief critique of this specific answer" }
                ]
            }
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are an expert technical evaluator." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        const evaluation = JSON.parse(response.choices[0].message.content);

        // Save to User History
        const user = await User.findById(req.userId);
        if (user) {
            const historyEntry = {
                role,
                difficulty,
                score: evaluation.score,
                feedback: evaluation.feedback,
                questions: questions.map(q => {
                    const feedbackObj = evaluation.questionFeedback.find(f => f.text === q.text);
                    return {
                        text: q.text,
                        userAnswer: q.userAnswer,
                        idealAnswer: q.idealAnswer,
                        feedback: feedbackObj ? feedbackObj.feedback : "Good response."
                    };
                }),
                completedAt: new Date()
            };
            user.mockInterviewHistory.push(historyEntry);
            await user.save();
        }

        res.status(200).json({ success: true, evaluation });

    } catch (error) {
        console.error("Error in submitMockInterviewSession:", error);
        res.status(500).json({ success: false, message: "Failed to evaluate interview session" });
    }
};



/**
 * @desc Get unified interview history and prep stats
 */
const getInterviewHistory = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('mockInterviewHistory hrPracticeHistory hrAnalysis createdAt');
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Normalize Technical History
        const techHistory = user.mockInterviewHistory.map(session => ({
            id: session._id,
            date: session.completedAt,
            topic: session.role,
            type: "Technical Mock",
            duration: "30m", // Mock duration for now
            score: session.score,
            questions: session.questions.map(q => ({
                q: q.text,
                a: q.userAnswer,
                feedback: q.feedback
            }))
        }));

        // Normalize HR History
        const hrHistory = user.hrPracticeHistory.map(session => ({
            id: session._id,
            date: session.completedAt,
            topic: "HR Behavioral Practice",
            type: "HR Practice",
            duration: "15m",
            score: session.score,
            questions: [{
                q: session.question,
                a: session.answer,
                feedback: session.feedback
            }]
        }));

        // Combine and Sort by Date Descending
        const fullHistory = [...techHistory, ...hrHistory].sort((a, b) => new Date(b.date) - new Date(a.date));

        // Calculate Stats
        const totalMocks = user.mockInterviewHistory.length;
        const totalPractice = totalMocks + user.hrAnalysis.totalAttempts;
        
        const allScores = [...user.mockInterviewHistory.map(s => s.score), ...user.hrPracticeHistory.map(s => s.score)];
        const avgScore = allScores.length > 0 
            ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
            : 0;

        // Unique Prep Days
        const dates = [
            ...user.mockInterviewHistory.map(s => new Date(s.completedAt).toDateString()),
            ...user.hrPracticeHistory.map(s => new Date(s.completedAt).toDateString())
        ];
        const uniqueDays = new Set(dates).size;

        res.status(200).json({
            success: true,
            history: fullHistory,
            stats: {
                totalMocks,
                totalPractice,
                avgScore,
                prepDays: uniqueDays || 1 // At least 1 if they are here
            }
        });

    } catch (error) {
        console.error("Error in getInterviewHistory:", error);
        res.status(500).json({ success: false, message: "Failed to fetch history" });
    }
};

/**
 * @desc Get all user folders
 */
const getFolders = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('questionFolders');
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        
        // Deduplicate just in case
        const uniqueFolders = [...new Set(user.questionFolders)];
        res.status(200).json({ success: true, folders: uniqueFolders });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch folders" });
    }
};

/**
 * @desc Create a new folder
 */
const createFolder = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ success: false, message: "Folder name is required" });

        const user = await User.findById(req.userId);
        
        // Case-insensitive duplicate check
        const folderExists = user.questionFolders.some(f => f.toLowerCase() === name.toLowerCase());
        if (folderExists) {
            return res.status(400).json({ success: false, message: "Folder already exists" });
        }

        user.questionFolders.push(name);
        await user.save();
        res.status(201).json({ success: true, folders: user.questionFolders });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to create folder" });
    }
};

/**
 * @desc Delete a folder and move its questions to General
 */
const deleteFolder = async (req, res) => {
    try {
        const { name } = req.params;
        if (name === 'General') return res.status(400).json({ success: false, message: "Cannot delete General folder" });

        const user = await User.findById(req.userId);
        user.questionFolders = user.questionFolders.filter(f => f !== name);
        
        // Migrate questions in this folder to General
        user.savedQuestions.forEach(q => {
            if (q.folder === name) q.folder = 'General';
        });

        await user.save();
        res.status(200).json({ success: true, folders: user.questionFolders });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete folder" });
    }
};

/**
 * @desc Move a question to a different folder
 */
const moveQuestionToFolder = async (req, res) => {
    try {
        const { id } = req.params;
        const { folder } = req.body;

        const user = await User.findById(req.userId);
        const question = user.savedQuestions.id(id);
        if (!question) return res.status(404).json({ success: false, message: "Question not found" });

        question.folder = folder || 'General';
        
        // Ensure destination folder exists in folder list
        if (!user.questionFolders.includes(question.folder)) {
            user.questionFolders.push(question.folder);
        }

        await user.save();
        res.status(200).json({ success: true, folder: question.folder });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to move question" });
    }
};

/**
 * @desc Manually add a saved question
 */
const addManualQuestion = async (req, res) => {
    try {
        const { text, category, difficulty, answer, folder } = req.body;
        if (!text || !category || !difficulty) {
            return res.status(400).json({ success: false, message: "Required fields missing" });
        }

        const user = await User.findById(req.userId);
        const targetFolder = folder || 'General';
        user.savedQuestions.push({ text, category, difficulty, answer, folder: targetFolder });
        
        // Ensure folder exists in list
        if (!user.questionFolders.includes(targetFolder)) {
            user.questionFolders.push(targetFolder);
        }

        await user.save();
        res.status(201).json({ success: true, question: user.savedQuestions[user.savedQuestions.length - 1] });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to add manual question" });
    }
};

module.exports = {
    generateQuestions,
    generateFollowUp,
    getAIAnswer,
    toggleSaveQuestion,
    getSavedQuestions,
    toggleFavoriteQuestion,
    deleteSavedQuestion,
    exportQuestions,
    generateHRQuestions,
    evaluateHRAnswer,
    transcribeAudio,
    getHRStats,
    updateHRInsights,
    generateMockInterviewSession,
    submitMockInterviewSession,

    getFolders,
    createFolder,
    deleteFolder,
    moveQuestionToFolder,
    addManualQuestion,
    getInterviewHistory
};
