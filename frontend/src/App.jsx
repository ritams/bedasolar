import { useState } from 'react'
import Upload from './components/Upload.jsx'
import FormEditor from './components/FormEditor.jsx'
import UserInfoForm from './components/UserInfoForm.jsx'
import RoofCalculation from './components/RoofCalculation.jsx'
import ProgressBar from './components/ProgressBar.jsx'
import { SunIcon } from './assets/icons'

export default function App() {
  const [step, setStep] = useState('upload')
  const [parsedData, setParsedData] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const steps = ['upload', 'billForm', 'userInfo', 'roofCalculation', 'proposal']

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
    window.location.href = '/'
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
          
          <nav className="nav-enhanced">
            <button onClick={handleBackToLanding} className="btn btn-secondary btn-sm">
              ← Home
            </button>
            <button onClick={handleReset} className="btn btn-primary btn-sm">
              Start Over
            </button>
          </nav>
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