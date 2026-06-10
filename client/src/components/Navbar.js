import React from 'react';

function Navbar({ onLogout }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2>📋 TaskFlow</h2>
      </div>
      <div className="nav-user">
        <span>👋 Welcome, {user.name}</span>
        <button onClick={onLogout} className="logout-nav-btn">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;