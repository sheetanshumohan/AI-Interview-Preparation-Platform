const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function() {
            // Password is only required if user is not using social login
            return !this.googleId && !this.githubId;
        }
    },
    googleId: String,
    githubId: String,
    avatar: String,
    role: {
        type: String,
        default: ''
    },
    experience: {
        type: String,
        default: ''
    },
    skills: {
        type: [String],
        default: []
    },
    targetCompanies: {
        type: [String],
        default: []
    },
    education: {
        type: String,
        default: ''
    },
    resume: {
        name: String,
        url: String,
        size: String,
        date: String
    },
    resumeAnalysis: {
        score: { type: Number, default: 0 },
        strengths: [String],
        missingKeywords: [String],
        keywordOptimization: [{
            k: String, // Keyword
            f: String, // Frequency
            s: String, // Market Standard
            i: String  // Improvement
        }],
        checklist: [{
            text: String,
            completed: Boolean
        }],
        featuredImprovement: {
            title: String,
            description: String,
            progress: Number,
            roadmap: [String] // Actionable steps
        },
        detailedAnalysis: {
            header: { score: Number, feedback: String },
            summary: { score: Number, feedback: String },
            experience: { score: Number, feedback: String },
            education: { score: Number, feedback: String },
            skills: { score: Number, feedback: String }
        }
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    savedQuestions: [{
        text: String,
        category: String,
        difficulty: String,
        answer: String,
        isFavorite: { type: Boolean, default: false },
        folder: { type: String, default: 'General' },
        savedAt: { type: Date, default: Date.now }
    }],
    questionFolders: {
        type: [String],
        default: []
    },
    hrAnalysis: {
        averageScore: { type: Number, default: 0 },
        totalAttempts: { type: Number, default: 0 },
        insights: { type: String, default: 'Practice 5 questions to unlock deep behavioral insights.' },
        scores: { type: [Number], default: [] }
    },
    mockInterviewHistory: [{
        role: String,
        difficulty: String,
        score: Number,
        feedback: String,
        questions: [{
            text: String,
            userAnswer: String,
            idealAnswer: String,
            feedback: String
        }],
        completedAt: { type: Date, default: Date.now }
    }],
    hrPracticeHistory: [{
        question: String,
        answer: String,
        score: Number,
        feedback: String,
        starAnalysis: {
            situation: String,
            task: String,
            action: String,
            result: String
        },
        improvements: [String],
        completedAt: { type: Date, default: Date.now }
    }],
    isAdmin: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['Active', 'Suspended'],
        default: 'Active'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
