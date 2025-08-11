"use strict";

require('dotenv').config();

var nodemailer = require('nodemailer');

function sendTestEmail() {
  var transporter, info;
  return regeneratorRuntime.async(function sendTestEmail$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          });
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            // send to yourself
            subject: 'Test Email from Node',
            text: 'This is a test email. If you get this, nodemailer is working!'
          }));

        case 4:
          info = _context.sent;
          console.log('Email sent:', info.response);
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](1);
          console.error('Error sending test email:', _context.t0);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 8]]);
}

sendTestEmail();