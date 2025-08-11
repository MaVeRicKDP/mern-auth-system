const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    // Get user by ID from token
    const user = await User.findById(req.user.userId).select('-password -otp -otpExpiry');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Profile Fetch Error:', err);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

module.exports = router;
