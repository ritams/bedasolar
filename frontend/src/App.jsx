import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Upload from './components/Upload.jsx'
import FormEditor from './components/FormEditor.jsx'
import UserInfoForm from './components/UserInfoForm.jsx'
import RoofCalculation from './components/RoofCalculation.jsx'
import ProgressBar from './components/ProgressBar.jsx'
import Login from './components/Login.jsx'
import UserProfile from './components/UserProfile.jsx'
import { SunIcon } from './assets/icons'
import { getCurrentUser } from './utils/api'

export default function App() {
  const navigate = useNavigate()
  const [step, setStep] = useState('upload')
  const [parsedData, setParsedData] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState(false)

  const steps = ['upload', 'billForm', 'userInfo', 'roofCalculation', 'proposal']

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await getCurrentUser()
      setUser(response.data)
      setAuthError(false)
    } catch (error) {
      setUser(null)
      // Check if there was an auth error in URL
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('error') === 'auth_failed') {
        setAuthError(true)
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    } finally {
      setAuthLoading(false)
    }
  }

  const handleAuthSuccess = () => {
    checkAuthStatus()
  }

  const handleLogout = () => {
    setUser(null)
    setParsedData(null)
    setUserInfo(null)
    setStep('upload')
    // Redirect to landing page after logout
    navigate('/')
  }

  const handleUploadSuccess = (data) => {
    setParsedData(data)
    setStep('billForm')
  }

  const handleBillConfirm = (confirmedData) => {
    setParsedData(confirmedData)
    setStep('userInfo')
  }

  const handleUserInfoSubmit = (info) => {
    setUserInfo(info)
    setStep('roofCalculation')
  }

  const handleRoofConfirm = (roofData) => {
    setUserInfo(prev => ({ ...prev, ...roofData }))
    setStep('proposal')
  }

  const handleReset = () => {
    setParsedData(null)
    setUserInfo(null)
    setStep('upload')
  }

  const handleBackToLanding = () => {
    navigate('/')
  }

  const renderStepContent = () => {
    switch(step) {
      case 'upload':
        return (
          <Upload 
            onSuccess={handleUploadSuccess} 
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )
      case 'billForm':
        return (
          <FormEditor 
            initialData={parsedData} 
            onConfirm={handleBillConfirm}
            onReset={handleReset}
            showProposal={false}
          />
        )
      case 'userInfo':
        return (
          <UserInfoForm 
            billData={parsedData}
            onSubmit={handleUserInfoSubmit}
            onBack={() => setStep('billForm')}
          />
        )
      case 'roofCalculation':
        return (
          <RoofCalculation 
            userInfo={userInfo}
            address={parsedData?.supplyAddress || parsedData?.billingAddress}
            onConfirm={handleRoofConfirm}
            onBack={() => setStep('userInfo')}
          />
        )
      case 'proposal':
        return (
          <FormEditor 
            initialData={parsedData} 
            userInfo={userInfo}
            onReset={handleReset}
            showProposal={true}
          />
        )
      default:
        return null
    }
  }

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="app-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // Show login page if not authenticated
  if (!user) {
    return <Login onAuthSuccess={handleAuthSuccess} error={authError} />
  }

  // Show main app if authenticated
  return (
    <div className="app-page">
      {/* Dynamic Background Elements */}
      <div className="background-elements">
        <div className="bg-gradient primary"></div>
        <div className="bg-gradient secondary"></div>
        <div className="bg-particles"></div>
      </div>

      {/* Enhanced Header with Progress */}
      <header className="header-enhanced">
        <div className="header-content-enhanced">
          <div className="logo-enhanced">
            <div className="logo-icon">
              <SunIcon size={32} />
            </div>
            <span>BEDA SOLAR</span>
          </div>
          
          <div className="nav-center">
            <ProgressBar currentStep={step} steps={steps} />
          </div>
          
          <div className="header-actions">
            <nav className="nav-enhanced">
              <button onClick={handleBackToLanding} className="btn btn-secondary btn-sm">
                ← Home
              </button>
              <button onClick={handleReset} className="btn btn-primary btn-sm">
                Start Over
              </button>
            </nav>
            <UserProfile user={user} onLogout={handleLogout} />
          </div>
        </div>
      </header>

      {/* Main Content - Full Width */}
      <main className="main-content">
        <div className="content-wrapper">
          {renderStepContent()}
        </div>
      </main>

      {/* Floating Elements */}
      <div className="floating-elements">
        <div className="float-shape shape-1"></div>
        <div className="float-shape shape-2"></div>
        <div className="float-shape shape-3"></div>
      </div>
    </div>
  )
} 