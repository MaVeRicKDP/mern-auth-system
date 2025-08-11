"use strict";

var express = require('express');

var router = express.Router();

var User = require('../models/User');

var bcrypt = require('bcryptjs');

var crypto = require('crypto');

var nodemailer = require('nodemailer');

var jwt = require('jsonwebtoken'); // Configure nodemailer transporter


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    // your gmail address
    pass: process.env.EMAIL_PASS // your app password from Google

  }
}); // ====== SIGNUP ======

router.post('/signup', function _callee(req, res) {
  var _req$body, firstName, lastName, email, password, user, hashedPassword, otp, otpExpiry;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, firstName = _req$body.firstName, lastName = _req$body.lastName, email = _req$body.email, password = _req$body.password;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 4:
          user = _context.sent;

          if (!user) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: 'Email already registered'
          }));

        case 7:
          _context.next = 9;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 9:
          hashedPassword = _context.sent;
          otp = crypto.randomInt(100000, 999999).toString();
          otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
          user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            otp: otp,
            otpExpiry: otpExpiry,
            isVerified: false
          });
          _context.next = 15;
          return regeneratorRuntime.awrap(user.save());

        case 15:
          _context.next = 17;
          return regeneratorRuntime.awrap(transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Verification Code',
            text: "Hello ".concat(firstName, ",\n\nYour OTP code is ").concat(otp, ". It will expire in 10 minutes.\n\nThank you!")
          }));

        case 17:
          res.json({
            message: 'Signup successful! Please check your email for the OTP to verify your account.'
          });
          _context.next = 24;
          break;

        case 20:
          _context.prev = 20;
          _context.t0 = _context["catch"](1);
          console.error(_context.t0);
          res.status(500).json({
            message: 'Server error during signup'
          });

        case 24:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 20]]);
}); // ====== VERIFY OTP ======

router.post('/verify-otp', function _callee2(req, res) {
  var _req$body2, email, otp, user;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, email = _req$body2.email, otp = _req$body2.otp;

          if (!(!email || !otp)) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: 'Email and OTP are required'
          }));

        case 3:
          _context2.prev = 3;
          _context2.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 6:
          user = _context2.sent;

          if (user) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: 'User not found'
          }));

        case 9:
          if (!user.isVerified) {
            _context2.next = 11;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: 'User is already verified'
          }));

        case 11:
          if (!(user.otp !== otp)) {
            _context2.next = 13;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: 'Invalid OTP'
          }));

        case 13:
          if (!(user.otpExpiry < new Date())) {
            _context2.next = 15;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: 'OTP expired'
          }));

        case 15:
          user.isVerified = true;
          user.otp = undefined;
          user.otpExpiry = undefined;
          _context2.next = 20;
          return regeneratorRuntime.awrap(user.save());

        case 20:
          res.json({
            message: 'Email verified successfully. You can now log in.'
          });
          _context2.next = 27;
          break;

        case 23:
          _context2.prev = 23;
          _context2.t0 = _context2["catch"](3);
          console.error(_context2.t0);
          res.status(500).json({
            message: 'Server error during OTP verification'
          });

        case 27:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 23]]);
}); // ====== LOGIN ======

router.post('/login', function _callee3(req, res) {
  var _req$body3, email, password, user, isMatch, token;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body3 = req.body, email = _req$body3.email, password = _req$body3.password;

          if (!(!email || !password)) {
            _context3.next = 3;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: 'Email and password are required'
          }));

        case 3:
          _context3.prev = 3;
          _context3.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 6:
          user = _context3.sent;

          if (user) {
            _context3.next = 9;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: 'Invalid email or password'
          }));

        case 9:
          if (user.isVerified) {
            _context3.next = 11;
            break;
          }

          return _context3.abrupt("return", res.status(403).json({
            message: 'Please verify your email before logging in'
          }));

        case 11:
          _context3.next = 13;
          return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

        case 13:
          isMatch = _context3.sent;

          if (isMatch) {
            _context3.next = 16;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: 'Invalid email or password'
          }));

        case 16:
          // Generate JWT token
          token = jwt.sign({
            id: user._id,
            email: user.email
          }, process.env.JWT_SECRET, {
            expiresIn: '1d'
          });
          res.json({
            message: 'Login successful',
            token: token,
            // <-- send token here
            user: {
              id: user._id,
              email: user.email,
              firstName: user.firstName
            }
          });
          _context3.next = 24;
          break;

        case 20:
          _context3.prev = 20;
          _context3.t0 = _context3["catch"](3);
          console.error(_context3.t0);
          res.status(500).json({
            message: 'Server error during login'
          });

        case 24:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[3, 20]]);
}); // ====== FORGOT PASSWORD (Send OTP) ======

router.post('/forgot-password', function _callee4(req, res) {
  var email, user, otp, otpExpiry;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          email = req.body.email;

          if (email) {
            _context4.next = 3;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            message: 'Email is required'
          }));

        case 3:
          _context4.prev = 3;
          _context4.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 6:
          user = _context4.sent;

          if (user) {
            _context4.next = 9;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: 'User not found'
          }));

        case 9:
          otp = crypto.randomInt(100000, 999999).toString();
          otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
          user.otp = otp;
          user.otpExpiry = otpExpiry;
          _context4.next = 15;
          return regeneratorRuntime.awrap(user.save());

        case 15:
          _context4.next = 17;
          return regeneratorRuntime.awrap(transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset OTP',
            text: "Hello ".concat(user.firstName || 'User', ",\n\nYour password reset OTP is ").concat(otp, ". It will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.")
          }));

        case 17:
          res.json({
            message: 'OTP sent to your email for password reset.'
          });
          _context4.next = 24;
          break;

        case 20:
          _context4.prev = 20;
          _context4.t0 = _context4["catch"](3);
          console.error(_context4.t0);
          res.status(500).json({
            message: 'Server error during password reset request'
          });

        case 24:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[3, 20]]);
}); // ====== RESET PASSWORD ======

router.post('/reset-password', function _callee5(req, res) {
  var _req$body4, email, otp, newPassword, user, hashedPassword;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body4 = req.body, email = _req$body4.email, otp = _req$body4.otp, newPassword = _req$body4.newPassword;

          if (!(!email || !otp || !newPassword)) {
            _context5.next = 3;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            message: 'Email, OTP, and new password are required'
          }));

        case 3:
          _context5.prev = 3;
          _context5.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 6:
          user = _context5.sent;

          if (user) {
            _context5.next = 9;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: 'User not found'
          }));

        case 9:
          if (!(user.otp !== otp)) {
            _context5.next = 11;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            message: 'Invalid OTP'
          }));

        case 11:
          if (!(user.otpExpiry < new Date())) {
            _context5.next = 13;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            message: 'OTP expired'
          }));

        case 13:
          _context5.next = 15;
          return regeneratorRuntime.awrap(bcrypt.hash(newPassword, 10));

        case 15:
          hashedPassword = _context5.sent;
          user.password = hashedPassword;
          user.otp = undefined;
          user.otpExpiry = undefined;
          _context5.next = 21;
          return regeneratorRuntime.awrap(user.save());

        case 21:
          res.json({
            message: 'Password reset successful. You can now log in.'
          });
          _context5.next = 28;
          break;

        case 24:
          _context5.prev = 24;
          _context5.t0 = _context5["catch"](3);
          console.error(_context5.t0);
          res.status(500).json({
            message: 'Server error during password reset'
          });

        case 28:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[3, 24]]);
});
module.exports = router;