import express from 'express';
import passport from 'passport';

const router = express.Router();

// Initiate Google OAuth login
router.get('/google', (req, res, next) => {
  // Store the return URL in session if provided
  const returnTo = req.query.returnTo || '/app';
  req.session.returnTo = returnTo;
  
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res, next);
});

// Handle Google OAuth callback
router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: 'http://localhost:3000?error=auth_failed' 
  }),
  (req, res) => {
    // Get the intended destination from session
    const returnTo = req.session.returnTo || '/app';
    delete req.session.returnTo; // Clean up
    
    // Successful authentication, redirect to intended destination
    res.redirect(`http://localhost:3000${returnTo}?auth=success`);
  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Session destruction failed' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
  });
});

// Get current user info
router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      id: req.user.googleId,
      name: req.user.name,
      email: req.user.email,
      picture: req.user.picture
    });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

export default router; 