import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, clear tokens here
    // localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="user-profile">
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{user?.name || 'User'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.role?.toUpperCase()}</div>
        </div>
        <div className="avatar">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
