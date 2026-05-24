const express = require('express');
const router = express.Router();
const { 
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
} = require('../controllers/aiController');
const verifyToken = require('../middleware/verifyToken');
const multer = require('multer');
const path = require('path');

// Multer configuration for audio uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `audio-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /audio|video|octet-stream|webm|mp3|wav|m4a/;
        const mimetypes = ['audio/webm', 'audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/mp4', 'application/octet-stream', 'video/webm'];
        
        if (mimetypes.includes(file.mimetype) || filetypes.test(path.extname(file.originalname).toLowerCase())) {
            return cb(null, true);
        }
        cb(new Error("Error: Only audio files are allowed!"));
    }
});

// All AI routes require authentication
router.post('/generate-questions', verifyToken, generateQuestions);
router.post('/follow-up', verifyToken, generateFollowUp);
router.post('/sample-answer', verifyToken, getAIAnswer);
router.post('/toggle-save', verifyToken, toggleSaveQuestion);
router.get('/saved', verifyToken, getSavedQuestions);
router.patch('/favorite/:id', verifyToken, toggleFavoriteQuestion);
router.delete('/saved/:id', verifyToken, deleteSavedQuestion);
router.post('/export', verifyToken, exportQuestions);

// HR Practice Routes
router.get('/hr/questions', verifyToken, generateHRQuestions);
router.post('/hr/evaluate', verifyToken, evaluateHRAnswer);
router.post('/transcribe', verifyToken, upload.single('audio'), transcribeAudio);
router.get('/hr/stats', verifyToken, getHRStats);
router.post('/hr/update-insights', verifyToken, updateHRInsights);

// Technical Mock Interview Routes
router.get('/mock/generate', verifyToken, generateMockInterviewSession);
router.post('/mock/submit', verifyToken, submitMockInterviewSession);


// Folder & Manual Saved Questions Routes
router.get('/folders', verifyToken, getFolders);
router.post('/folders', verifyToken, createFolder);
router.delete('/folders/:name', verifyToken, deleteFolder);
router.patch('/saved/:id/folder', verifyToken, moveQuestionToFolder);
router.post('/saved/manual', verifyToken, addManualQuestion);

// Complete History Route
router.get('/history', verifyToken, getInterviewHistory);

module.exports = router;
