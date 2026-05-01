const express = require('express');
const { signup, login, refresh, logout, me } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate, signupSchema, loginSchema } = require('../utils/validators');

const router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authenticate, me);

module.exports = router;
