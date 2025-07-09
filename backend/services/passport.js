import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  // Create user object from Google profile
  const user = {
    googleId: profile.id,
    name: profile.displayName,
    email: profile.emails[0].value,
    picture: profile.photos[0].value
  };
  
  return done(null, user);
}));

// Serialize user for session storage
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport; 