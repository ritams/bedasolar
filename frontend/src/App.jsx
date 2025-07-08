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
      <h1>🧾 PDF Parser</h1>
      
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
  )
} 