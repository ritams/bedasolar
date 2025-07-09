import { useState } from 'react'
import { logout } from '../utils/api'

export default function UserProfile({ user, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false)

  // Get first name from full name
  const firstName = user.name.split(' ')[0]
  
  // Get initials for fallback
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown)
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
      // Continue with client-side logout even if API fails
    } finally {
      setShowDropdown(false)
      onLogout() // This will redirect to landing page
    }
  }

  // Close dropdown when clicking outside
  const handleDropdownBlur = () => {
    setTimeout(() => setShowDropdown(false), 150)
  }

  return (
    <div className="user-profile-enhanced" onBlur={handleDropdownBlur}>
      <button 
        onClick={handleProfileClick}
        className="profile-trigger"
        title={`Signed in as ${user.name} - Click to manage account`}
      >
        <div className="user-avatar-container">
          {user.picture ? (
            <img 
              src={user.picture} 
              alt={user.name}
              className="user-avatar"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
          ) : (
            <div className="user-avatar-initials">
              {getInitials(user.name)}
            </div>
          )}
          <div className="user-avatar-initials" style={{ display: user.picture ? 'none' : 'flex' }}>
            {getInitials(user.name)}
          </div>
        </div>
        <div className="user-details">
          <span className="user-name">{firstName}</span>
          <div className="user-status">
            <span className="status-dot"></span>
            <span>Online</span>
          </div>
        </div>
        <div className="profile-chevron">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </div>
      </button>

      {showDropdown && (
        <div className="profile-dropdown">
          <div className="dropdown-header">
            <div className="user-info-full">
              <span className="full-name">{user.name}</span>
              <span className="user-email">{user.email}</span>
            </div>
          </div>
          
          <div className="dropdown-divider"></div>
          
          <div className="dropdown-actions">
            <button className="dropdown-item" disabled>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <span>Manage Account</span>
              <span className="coming-soon">Soon</span>
            </button>
            
            <button className="dropdown-item" disabled>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
              </svg>
              <span>Settings</span>
              <span className="coming-soon">Soon</span>
            </button>
          </div>
          
          <div className="dropdown-divider"></div>
          
          <button className="dropdown-item logout-item" onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  )
} 