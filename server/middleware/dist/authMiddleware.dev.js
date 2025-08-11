"use strict";

var jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // Get token from Authorization header
  var authHeader = req.headers.authorization; // Check if Authorization header exists and starts with 'Bearer '

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Authorization token missing or malformed'
    });
  } // Extract token string after 'Bearer '


  var token = authHeader.split(' ')[1];

  try {
    // Verify token with your secret key
    var decoded = jwt.verify(token, process.env.JWT_SECRET); // Attach decoded user info (payload) to req.user for later use

    req.user = decoded; // Proceed to next middleware or route handler

    next();
  } catch (err) {
    // Token invalid or expired
    return res.status(401).json({
      message: 'Invalid or expired token'
    });
  }
}

module.exports = authMiddleware;