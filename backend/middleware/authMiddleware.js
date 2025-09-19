const jwt = require('jsonwebtoken');

function protect(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach minimal user info; controllers can fetch full doc if needed
    req.user = { id: decoded.id, email: decoded.email, username: decoded.username };
    return next();
  } catch (e) {
    res.status(401);
    return next(new Error('Not authorized, token invalid'));
  }
}

module.exports = { protect };
