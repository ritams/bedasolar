import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import LandingPage from './components/LandingPage.jsx'
import ErrorBoundary from './components/ui/ErrorBoundary.jsx'
import './styles/design-system.css'
import './styles/utilities.css'
import './styles/main.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <Router basename="/bedasolar">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<App />} />
      </Routes>
    </Router>
  </ErrorBoundary>
) 