import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'

import ChatPage from './pages/ChatPage.jsx'
import ChatThreadPage from './pages/ChatThreadPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/:id" element={<ChatThreadPage />} />
        <Route path="/" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
