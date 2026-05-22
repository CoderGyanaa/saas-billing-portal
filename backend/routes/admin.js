// routes/admin.js
const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, updateUserRole, toggleUserActive } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
router.use(protect, authorize('superadmin', 'admin'));
router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', authorize('superadmin'), updateUserRole);
router.put('/users/:id/toggle-active', toggleUserActive);
module.exports = router;
