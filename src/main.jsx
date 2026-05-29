/**
 * main.jsx — The Entry Point
 * ==========================
 * 
 * This is the FIRST file that runs when someone opens the website.
 * It wraps the entire app with:
 * 1. ErrorBoundary — catches crashes, shows friendly error page
 * 2. BrowserRouter — enables page navigation (URLs like /search, /login)
 * 3. AuthProvider — provides login state to every component
 * 4. App — the actual routes and pages
 * 
 * ORDER MATTERS: ErrorBoundary must be outermost so it catches errors
 * from everything inside. AuthProvider must be inside BrowserRouter
 * because it may need to use navigation.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
