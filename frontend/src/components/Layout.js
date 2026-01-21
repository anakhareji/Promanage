import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children, user, setUser }) => {
  return (
    <div className="app-container">
      {user && <Sidebar role={user.role} />}
      
      <div className="main-content" style={{ marginLeft: user ? 'var(--sidebar-width)' : '0' }}>
        {user && <Navbar user={user} setUser={setUser} />}
        
        <div className="content-fade-in">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
