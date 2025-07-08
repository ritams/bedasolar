import { useState } from 'react'
import Upload from './components/Upload.jsx'
import FormEditor from './components/FormEditor.jsx'

export default function App() {
  const [parsedData, setParsedData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleUploadSuccess = (data) => {
    setParsedData(data)
  }

  const handleReset = () => {
    setParsedData(null)
  }

  return (
    <div className="container">
      <div className="card">
        <div className="brand-header">
          <h1 className="brand-title">BEDA SOLAR</h1>
          <p className="brand-subtitle">Clean Energy Solutions • Solar Onboarding Platform</p>
        </div>
        
        {!parsedData ? (
          <Upload 
            onSuccess={handleUploadSuccess} 
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        ) : (
          <FormEditor 
            initialData={parsedData} 
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  )
} 