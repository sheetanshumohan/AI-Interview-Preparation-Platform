const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getAnalysis, toggleChecklistItem, getDashboardData } = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken');

router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.get('/analysis', verifyToken, getAnalysis);
router.get('/dashboard', verifyToken, getDashboardData);
router.patch('/analysis/checklist/:index', verifyToken, toggleChecklistItem);

module.exports = router;
