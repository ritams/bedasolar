import axios from 'axios'

export default function Upload({ onSuccess, isLoading, setIsLoading }) {
  
  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file || file.type !== 'application/pdf') return

    setIsLoading(true)
    const formData = new FormData()
    formData.append('pdf', file)

    try {
      const { data } = await axios.post('/api/upload', formData)
      onSuccess(data)
    } catch (error) {
      alert('Upload failed: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <div style={{ 
        border: '2px dashed #ccc', 
        padding: '40px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <input 
          type="file" 
          accept=".pdf"
          onChange={handleFileUpload}
          disabled={isLoading}
          style={{ fontSize: '16px' }}
        />
      </div>
      {isLoading && <p>🔄 Processing PDF...</p>}
      <p style={{ color: '#666' }}>Upload a single-page PDF to extract data</p>
    </div>
  )
} 