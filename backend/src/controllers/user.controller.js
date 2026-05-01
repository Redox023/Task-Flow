const User = require('../models/User');
const { sendSuccess } = require('../utils/response');

const searchUsers = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email || email.length < 3) {
      return sendSuccess(res, { users: [] }, 'Provide at least 3 characters');
    }

    const users = await User.find({
      email: { $regex: email.toLowerCase(), $options: 'i' },
      _id: { $ne: req.user.id },
    })
      .select('fullName email')
      .limit(10);

    const normalized = users.map((u) => ({ id: u._id, fullName: u.fullName, email: u.email }));
    return sendSuccess(res, { users: normalized }, 'Users found');
  } catch (err) {
    next(err);
  }
};

module.exports = { searchUsers };
