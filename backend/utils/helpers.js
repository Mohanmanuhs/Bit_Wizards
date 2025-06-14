const generateToken = (user) => {
  const jwt = require('jsonwebtoken');
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

module.exports = { generateToken };
