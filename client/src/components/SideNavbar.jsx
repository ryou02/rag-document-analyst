import React from 'react'
import { NavLink } from 'react-router-dom'

export default function SideNavbar() {
  return (
    <aside className="side-navbar">
      <div className="side-navbar__section">
        <div className="side-navbar__title">Navigation</div>
        <nav className="side-navbar__links">
          <NavLink to="/" className="side-navbar__link">
            Home
          </NavLink>
          <NavLink to="/chat" className="side-navbar__link">
            Chats
          </NavLink>
        </nav>
      </div>
      <div className="side-navbar__section">
        <div className="side-navbar__title">Recent</div>
        <div className="side-navbar__item">Project Docs</div>
        <div className="side-navbar__item">Sprint Notes</div>
        <div className="side-navbar__item">Customer FAQs</div>
      </div>
    </aside>
  )
}
