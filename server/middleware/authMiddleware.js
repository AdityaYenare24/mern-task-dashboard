import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

/**
 * Protect middleware — verifies the JWT token from the Authorization header.
 * Attaches the authenticated user object to req.user for downstream handlers.
 * Usage: add `protect` as middleware to any route that requires authentication.
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Tokens arrive as: "Bearer <token>"
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token signature and expiry using our secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (exclude password field)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('User belonging to this token no longer exists');
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
});