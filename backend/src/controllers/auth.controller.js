const bcrypt = require('bcryptjs');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { sendSuccess, AppError } = require('../utils/response');

const REFRESH_TOKEN_EXPIRY_DAYS = 7;

const signup = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) throw new AppError('Email already in use', 409);

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ fullName, email, passwordHash });

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    await RefreshToken.create({
      token: refreshToken,
      userId: user._id,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 86400000),
    });

    const safeUser = { id: user._id, fullName: user.fullName, email: user.email, createdAt: user.createdAt };
    return sendSuccess(res, { user: safeUser, accessToken, refreshToken }, 'Account created successfully', 201);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) throw new AppError('Invalid email or password', 401);

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new AppError('Invalid email or password', 401);

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    await RefreshToken.create({
      token: refreshToken,
      userId: user._id,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 86400000),
    });

    const safeUser = { id: user._id, fullName: user.fullName, email: user.email, createdAt: user.createdAt };
    return sendSuccess(res, { user: safeUser, accessToken, refreshToken }, 'Logged in successfully');
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new AppError('Refresh token required', 400);

    const decoded = verifyRefreshToken(refreshToken);

    const stored = await RefreshToken.findOne({ token: refreshToken });
    if (!stored || stored.userId.toString() !== decoded.userId || stored.expiresAt < new Date()) {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    await RefreshToken.deleteOne({ token: refreshToken });

    const newAccessToken = generateAccessToken(decoded.userId);
    const newRefreshToken = generateRefreshToken(decoded.userId);

    await RefreshToken.create({
      token: newRefreshToken,
      userId: decoded.userId,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 86400000),
    });

    return sendSuccess(res, { accessToken: newAccessToken, refreshToken: newRefreshToken }, 'Tokens refreshed');
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await RefreshToken.deleteMany({ token: refreshToken });
    }
    return sendSuccess(res, {}, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};

const me = async (req, res, next) => {
  try {
    return sendSuccess(res, { user: req.user }, 'User profile');
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login, refresh, logout, me };
