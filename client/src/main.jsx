import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./context/AuthContext";

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
 
    <BrowserRouter>
    <AuthProvider>
    <App />
    </AuthProvider>
  </BrowserRouter>
)
