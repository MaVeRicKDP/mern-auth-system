"use strict";

var mongoose = require('mongoose');

var connectDB = function connectDB() {
  return regeneratorRuntime.async(function connectDB$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log('Connecting to MongoDB with URI:', process.env.MONGO_URI); // Add this debug line

          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
          }));

        case 4:
          console.log('✅ MongoDB connected successfully');
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](1);
          console.error('❌ MongoDB connection error:', _context.t0.message);
          process.exit(1);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 7]]);
};

module.exports = connectDB;