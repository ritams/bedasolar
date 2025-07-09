// Middleware to check if user is authenticated
export const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
};

// Middleware to attach user info to API requests
export const attachUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.userId = req.user.googleId;
    req.userEmail = req.user.email;
  }
  next();
}; 