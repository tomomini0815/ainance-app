import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Components
import { AuthProvider } from './components/AuthProvider'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import ReceiptProcessing from './pages/ReceiptProcessing'
import InvoiceCreation from './pages/InvoiceCreation'
import BusinessAnalysis from './pages/BusinessAnalysis'
import ChatToBook from './pages/ChatToBook'
import BusinessConversion from './pages/BusinessConversion'
import IntegrationSettings from './pages/IntegrationSettings'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* パブリックルート */}
            <Route path="/" element={<LandingPage />} />
            
            {/* 保護されたルート */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/receipt-processing" 
              element={
                <ProtectedRoute>
                  <ReceiptProcessing />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/invoice-creation" 
              element={
                <ProtectedRoute>
                  <InvoiceCreation />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/business-analysis" 
              element={
                <ProtectedRoute>
                  <BusinessAnalysis />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chat-to-book" 
              element={
                <ProtectedRoute>
                  <ChatToBook />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/business-conversion" 
              element={
                <ProtectedRoute>
                  <BusinessConversion />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/integration-settings" 
              element={
                <ProtectedRoute>
                  <IntegrationSettings />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App