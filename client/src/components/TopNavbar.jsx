import React from 'react'

export default function TopNavbar() {
  return (
    <header className="top-navbar">
      <div className="top-navbar__brand">Knowledge Base AI</div>
      <div className="top-navbar__actions">
        <button className="top-navbar__button">New Chat</button>
        <button className="top-navbar__button">Account</button>
      </div>
    </header>
  )
}
