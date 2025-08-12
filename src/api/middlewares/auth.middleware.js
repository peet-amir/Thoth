const jwt = require('jsonwebtoken');
const { User } = require('../../db/models/user.model');

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request object
 */
exports.authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ error: 'User account is inactive' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Role-based authorization middleware
 * @param {string[]} roles - Array of allowed roles
 */
exports.authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

/**
 * Resource ownership middleware
 * Checks if the user owns or has access to the requested resource
 * @param {Function} checkOwnership - Function to check resource ownership
 */
exports.checkResourceAccess = (checkOwnership) => {
  return async (req, res, next) => {
    try {
      const hasAccess = await checkOwnership(req.user, req);
      if (!hasAccess) {
        return res.status(403).json({
          error: 'You do not have access to this resource'
        });
      }
      next();
    } catch (error) {
      console.error('Resource access check error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};

/**
 * API key authentication middleware
 * Verifies API key for external service integrations
 */
exports.authenticateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      return res.status(401).json({ error: 'No API key provided' });
    }

    // TODO: Implement API key validation logic
    // This could involve checking against a database of valid API keys
    
    next();
  } catch (error) {
    console.error('API key authentication error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};