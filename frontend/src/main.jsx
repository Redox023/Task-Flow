import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1c1c21',
            color: '#eeeae4',
            border: '1px solid rgba(255,255,255,0.08)',
            fontFamily: "'Inter', sans-serif",
            fontSize: '13px',
            borderRadius: '10px',
          },
          success: { iconTheme: { primary: '#34c98a', secondary: '#1c1c21' } },
          error:   { iconTheme: { primary: '#e8604a', secondary: '#1c1c21' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
