"use strict";

var express = require('express');

var router = express.Router();

var authMiddleware = require('../middleware/authMiddleware');

var User = require('../models/User');

router.get('/profile', authMiddleware, function _callee(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.user.userId).select('-password -otp -otpExpiry'));

        case 3:
          user = _context.sent;

          if (user) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: 'User not found'
          }));

        case 6:
          res.json(user);
          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          console.error('Profile Fetch Error:', _context.t0);
          res.status(500).json({
            message: 'Server error fetching profile'
          });

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
module.exports = router;