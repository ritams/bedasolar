import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import LandingPage from './components/LandingPage.jsx'
import ErrorBoundary from './components/ui/ErrorBoundary.jsx'
import './styles/design-system.css'
import './styles/utilities.css'
import './styles/main.css'

// Use conditional basename: "/bedasolar" for production (GitHub Pages), "/" for local development
const basename = import.meta.env.PROD ? '/bedasolar' : '/'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<App />} />
      </Routes>
    </Router>
  </ErrorBoundary>
) 