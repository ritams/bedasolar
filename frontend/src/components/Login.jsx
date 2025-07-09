import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { SunIcon } from '../assets/icons'

export default function Login({ onAuthSuccess, error }) {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Check if user just authenticated successfully
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('auth') === 'success') {
      // Clear the URL parameters
      window.history.replaceState({}, document.title, window.location.pathname)
      onAuthSuccess()
      
      // If we're already on /app (from redirect), stay here
      // Otherwise redirect to /app
      if (location.pathname !== '/app') {
        navigate('/app')
      }
    }
  }, [onAuthSuccess, navigate, location.pathname])

  const handleGoogleLogin = () => {
    // Include returnTo parameter to indicate where to redirect after auth
    const returnTo = location.pathname === '/' ? '/app' : location.pathname
    window.location.href = `/auth/google?returnTo=${encodeURIComponent(returnTo)}`
  }

  return (
    <div className="login-page">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="bg-gradient primary"></div>
        <div className="bg-gradient secondary"></div>
        <div className="bg-particles"></div>
      </div>

      {/* Main Content */}
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-enhanced">
              <div className="logo-icon">
                <SunIcon size={48} />
              </div>
              <span>BEDA SOLAR</span>
            </div>
            <h1>Bill Analysis System</h1>
            <p>Sign in with your Google account to get started with your solar energy analysis</p>
          </div>

          {error && (
            <div className="error-message">
              <p>Authentication failed. Please try again.</p>
            </div>
          )}

          <button 
            onClick={handleGoogleLogin}
            className="google-login-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>

          <div className="login-footer">
            <p>Secure authentication powered by Google OAuth 2.0</p>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="floating-elements">
        <div className="float-shape shape-1"></div>
        <div className="float-shape shape-2"></div>
        <div className="float-shape shape-3"></div>
      </div>
    </div>
  )
} 