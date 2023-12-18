// import { errorHandler } from './error';
import jwt from 'jsonwebtoken';
import errorHandler from '../utils/error.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token; // Corrected spelling to 'access_token'
    console.log(token);
    if (!token) {
      // If no token is present in cookies, return an error response
      return next(errorHandler(401, 'Unauthorized - No access token provided'));
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return next(errorHandler(403, 'Forbidden'));
      req.user = user;
      next();
    });
  };
  