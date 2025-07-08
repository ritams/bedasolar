import { useState } from 'react'
import axios from 'axios'

export default function FormEditor({ initialData, onReset }) {
  const [formData, setFormData] = useState(initialData)
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await axios.post('/api/submit', formData)
      alert('✅ Data saved successfully!')
    } catch (error) {
      alert('Save failed: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const generateProposal = async () => {
    try {
      const { data } = await axios.post('/api/generate', formData)
      
      // Download PDF
      const pdfBlob = new Blob([Uint8Array.from(atob(data.pdf), c => c.charCodeAt(0))], { type: 'application/pdf' })
      const pdfUrl = URL.createObjectURL(pdfBlob)
      const pdfLink = document.createElement('a')
      pdfLink.href = pdfUrl
      pdfLink.download = 'proposal.pdf'
      pdfLink.click()
      
      // Download HTML
      const htmlBlob = new Blob([data.html], { type: 'text/html' })
      const htmlUrl = URL.createObjectURL(htmlBlob)
      const htmlLink = document.createElement('a')
      htmlLink.href = htmlUrl
      htmlLink.download = 'proposal.html'
      htmlLink.click()
      
    } catch (error) {
      alert('Generation failed: ' + error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name *</label>
        <input 
          type="text" 
          value={formData.name || ''} 
          onChange={(e) => handleChange('name', e.target.value)}
          required
          style={{ width: '100%', padding: '8px', fontSize: '14px' }}
        />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email *</label>
        <input 
          type="email" 
          value={formData.email || ''} 
          onChange={(e) => handleChange('email', e.target.value)}
          required
          style={{ width: '100%', padding: '8px', fontSize: '14px' }}
        />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Address *</label>
        <textarea 
          value={formData.address || ''} 
          onChange={(e) => handleChange('address', e.target.value)}
          required
          rows={3}
          style={{ width: '100%', padding: '8px', fontSize: '14px', resize: 'vertical' }}
        />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Invoice Number *</label>
        <input 
          type="text" 
          value={formData.invoiceNumber || ''} 
          onChange={(e) => handleChange('invoiceNumber', e.target.value)}
          required
          style={{ width: '100%', padding: '8px', fontSize: '14px' }}
        />
      </div>
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button type="submit" disabled={isSaving} style={{ flex: 1, padding: '10px', fontSize: '16px' }}>
          {isSaving ? 'Saving...' : 'Submit'}
        </button>
        <button type="button" onClick={generateProposal} style={{ flex: 1, padding: '10px', fontSize: '16px' }}>
          Generate Proposal
        </button>
        <button type="button" onClick={onReset} style={{ padding: '10px', fontSize: '16px' }}>
          Reset
        </button>
      </div>
    </form>
  )
} 