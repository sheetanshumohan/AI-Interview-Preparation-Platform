const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserStatus, deleteUser, getAdminStats, provisionUser, getAnalytics, getAuditLogs, getLogStats } = require('../controllers/adminController');
const verifyToken = require('../middleware/verifyToken');
const adminOnly = require('../middleware/adminOnly');

// Apply both middlewares to all routes
router.use(verifyToken);
router.use(adminOnly);

router.get('/users', getAllUsers);
router.get('/stats', getAdminStats);
router.get('/analytics', getAnalytics);
router.get('/logs', getAuditLogs);
router.get('/logs/stats', getLogStats);
router.post('/provision', provisionUser);
router.put('/users/:userId/status', updateUserStatus);
router.delete('/users/:userId', deleteUser);

module.exports = router;
