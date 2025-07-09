# 📄 Specification: Web App with Google Sign-In

## 🎯 Purpose

This web application allows users to **sign in using their Google account**. After signing in, the app displays basic user profile information and maintains a session for the user. The app also allows users to log out.

---

## 🏗️ Architecture Overview

* **Frontend:** React (or any JavaScript frontend)
* **Backend:** Node.js with Express
* **Authentication:** Google OAuth 2.0 using Passport.js
* **Session Management:** Server-side sessions via Express-session with cookies
* **Deployment:** Initially for local development; should be portable to production

---

## 🔑 Features

### ✅ User Authentication via Google

* Login flow initiated by clicking a "Sign in with Google" button
* Redirects to Google OAuth 2.0 flow
* Upon successful authentication, the user is redirected back to the app
* If login fails or is cancelled, user returns to login page with error message

### 🧾 User Session

* Once authenticated, the user remains logged in until they manually log out or the session expires
* Session stores basic user profile info:

  * `name`
  * `email`
  * `Google ID`
  * `profile picture URL`

### 👤 User Profile Page

* Displays a welcome message with the user’s name and email
* Shows the user’s Google profile picture
* Includes a "Logout" button

### 🔒 Logout Functionality

* Invalidates the session on the server
* Clears authentication cookie
* Redirects user to login page

---

## 🌐 OAuth Setup Instructions

### Google Cloud Console

1. Navigate to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Go to **APIs & Services > Credentials**
4. Enable **OAuth consent screen** (set `Application Type` to **External**, add scopes `email` and `profile`)
5. Create **OAuth Client ID**

   * Application type: **Web Application**
   * Authorized JavaScript origins:

     ```
     http://localhost:3000
     ```
   * Authorized Redirect URIs:

     ```
     http://localhost:5000/auth/google/callback
     ```

### Required Values

* `GOOGLE_CLIENT_ID`: OAuth 2.0 Client ID
* `GOOGLE_CLIENT_SECRET`: OAuth 2.0 Client Secret

---

## 🛠 Backend Specification (Express)

### Endpoints

| Method | Route                   | Description                                      |
| ------ | ----------------------- | ------------------------------------------------ |
| GET    | `/auth/google`          | Initiates Google OAuth login                     |
| GET    | `/auth/google/callback` | Handles Google callback, sets session, redirects |
| GET    | `/auth/logout`          | Logs out the user, destroys session              |
| GET    | `/auth/user`            | Returns current user profile JSON if logged in   |

### Session Storage

* Uses in-memory session via `express-session`
* Stores user info: Google ID, name, email, picture
* Session cookie with HTTPOnly, Secure (in prod), SameSite settings

---

## 💻 Frontend Specification (React)

### Components

1. **Login Page**

   * Contains a "Sign in with Google" button
   * Clicking the button redirects to `/auth/google` on the backend

2. **Profile Page**

   * Shows logged-in user’s name, email, and picture
   * Displays "Logout" button (which calls `/auth/logout`)
   * On load, fetches `/auth/user` to check if the user is authenticated

### State Management

* Keeps track of `user` object in frontend state
* Redirects to login if `user` is `null`

### Network Requests

* All calls to the backend are made with `credentials: 'include'` to pass cookies
* Handles 401/403 responses by redirecting to login

---

## 🔐 Security Considerations

* Backend only accepts requests from trusted frontend origin (`http://localhost:3000`)
* Use HTTPS in production
* Google credentials are loaded from `.env` file, not hardcoded
* Do not expose `client_secret` to frontend
* CSRF protection and cookie hardening recommended in production

---

## 🧪 Testing Instructions

### Manual Testing

1. Start backend on `http://localhost:5000`
2. Start frontend on `http://localhost:3000`
3. Navigate to `http://localhost:3000`
4. Click “Sign in with Google”
5. Authenticate with a Google account
6. Confirm redirection to profile page and correct user info displayed
7. Click “Logout” and verify session ends and user is redirected to login

---

## 🧾 Environment Variables

The following environment variables must be defined in a `.env` file in the backend directory:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=random_string_used_for_session_encryption
```

---

## 🚀 Deployment Notes (optional)

* Replace `localhost` URLs with production domain in:

  * Google OAuth credentials
  * CORS setup
  * Redirect URIs
* Use Redis or database-backed session store for scalability
