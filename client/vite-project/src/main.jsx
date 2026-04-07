import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import {AuthProvider} from './context/AuthContext.jsx'
import { Toaster } from 'sonner'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if(!clerkPubKey) {
  throw new Error("Missing Clerk publishable key.")
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey} afterSignOutUrl="/">
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toaster richColors closeButton position="top-right" expand />
        </AuthProvider>
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>,
)
