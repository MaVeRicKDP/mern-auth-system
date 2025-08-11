"use strict";

var path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '.env')
});

var express = require('express');

var cors = require('cors');

var connectDB = require('./config/db');

var authRoutes = require('./routes/authRoutes');

var profileRoutes = require('./routes/profile'); // Profile routes


var app = express();
var PORT = process.env.PORT || 5000; // Middleware

app.use(cors());
app.use(express.json()); // Connect to MongoDB

connectDB(); // Routes

app.use('/api/auth', authRoutes);
app.use('/api', profileRoutes); // Default test route

app.get('/', function (req, res) {
  res.send('✅ Backend is running');
}); // Start the server

app.listen(PORT, function () {
  console.log("\uD83D\uDE80 Server running on port ".concat(PORT));
});