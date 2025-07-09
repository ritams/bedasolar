# Google OAuth Setup for BEDA Solar

## 🎯 Implementation Complete!

I've successfully implemented Google OAuth authentication for your BEDA Solar bill analysis application. Here's what was added:

### ✅ Backend Changes
- **Authentication Routes**: `/auth/google`, `/auth/google/callback`, `/auth/logout`, `/auth/user`
- **Passport.js Configuration**: Google OAuth 2.0 strategy setup
- **Session Management**: Express sessions with secure cookie handling
- **API Protection**: All bill analysis routes now require authentication
- **User Context**: User ID is automatically attached to all API requests

### ✅ Frontend Changes
- **Login Component**: Beautiful login page with Google Sign-In button
- **User Profile**: Shows user avatar, name, and logout functionality
- **Authentication Flow**: Automatic redirect handling and session management
- **Protected Routes**: Main app only accessible after authentication

### ✅ Security Features
- Session-based authentication with secure cookies
- CORS configured for credentials
- User data stored in session (Google ID, name, email, picture)
- All API routes protected with authentication middleware

## 🔧 Setup Instructions

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Navigate to **APIs & Services > Credentials**
4. Configure **OAuth consent screen**:
   - Application type: **External**
   - Add scopes: `email` and `profile`
5. Create **OAuth Client ID**:
   - Application type: **Web Application**
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized Redirect URIs: `http://localhost:3001/auth/google/callback`

### 2. Environment Variables

Create a `.env` file in the `backend/` directory with:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_actual_google_client_id
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret
SESSION_SECRET=your_random_session_secret_minimum_32_characters

# Existing variables
OPENROUTER_API_KEY=sk-your-openrouter-key-here
MONGODB_URI=mongodb://localhost:27017/pdfparser
```

### 3. Running the Application

1. **Start Backend** (Port 3001):
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend** (Port 3000):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Authentication**:
   - Visit `http://localhost:3000`
   - Click "Sign in with Google"
   - Complete OAuth flow
   - Access the bill analysis workflow

## 🚀 How It Works

1. **User visits app** → Shows login page
2. **Clicks "Sign in with Google"** → Redirects to Google OAuth
3. **Google authentication** → Redirects back with user data
4. **Session created** → User can access bill analysis
5. **All API calls authenticated** → User ID logged with all actions
6. **Logout** → Session destroyed, redirected to login

## 🔐 Security Notes

- Google credentials are server-side only (never exposed to frontend)
- Sessions use secure cookies with HTTPOnly flag
- CORS configured to only allow requests from your frontend
- All bill analysis data is now tied to authenticated users

## 📱 Features

- ✅ Google OAuth 2.0 authentication
- ✅ Session persistence (stays logged in)
- ✅ User profile display with avatar
- ✅ Secure logout functionality
- ✅ Mobile-responsive login design
- ✅ Error handling for failed authentication
- ✅ Automatic redirect after successful login

The app is now fully protected and ready for production deployment! 