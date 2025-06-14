const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'No token, unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    console.error('Invalid token', err);
    res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = {protect : authMiddleware};
