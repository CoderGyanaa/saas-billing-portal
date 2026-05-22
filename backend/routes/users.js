const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
// Extend as needed
router.get('/me', protect, (req, res) => res.json({ success: true, user: req.user }));
module.exports = router;
