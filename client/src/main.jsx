import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'

import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import ChatThreadPage from './pages/ChatThreadPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:id" element={<ChatThreadPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
