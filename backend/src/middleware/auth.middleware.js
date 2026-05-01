const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');
const Project = require('../models/Project');
const { AppError } = require('../utils/response');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('No access token provided', 401));
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.userId).select('fullName email');
    if (!user) {
      return next(new AppError('User no longer exists', 401));
    }

    req.user = { id: user._id, fullName: user.fullName, email: user.email };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Access token expired', 401));
    }
    if (err.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid access token', 401));
    }
    next(err);
  }
};

const requireProjectRole = (...roles) => {
  return async (req, res, next) => {
    try {
      const projectId = req.params.id || req.params.projectId || req.body.projectId;

      const project = await Project.findById(projectId);
      if (!project) {
        return next(new AppError('Project not found', 404));
      }

      const membership = project.members.find((m) => m.userId.toString() === req.user.id.toString());
      if (!membership) {
        return next(new AppError('You are not a member of this project', 403));
      }

      if (roles.length > 0 && !roles.includes(membership.role)) {
        return next(new AppError('Insufficient permissions for this action', 403));
      }

      req.membership = membership;
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = { authenticate, requireProjectRole };
