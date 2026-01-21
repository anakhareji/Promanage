import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ role }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <span style={{ fontSize: '1.5rem' }}>⚡</span> <span className="sidebar-text">ProManage</span>
      </div>

      <nav>
        {role === 'admin' ? (
          <>
            <Link to="/admin/dashboard" className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}>
              <span>📊</span> <span className="sidebar-text">Dashboard</span>
            </Link>
            <Link to="/admin/tasks" className={`nav-link ${isActive('/admin/tasks') ? 'active' : ''}`}>
              <span>📋</span> <span className="sidebar-text">All Tasks</span>
            </Link>
            <Link to="/admin/projects" className={`nav-link ${isActive('/admin/projects') ? 'active' : ''}`}>
              <span>📁</span> <span className="sidebar-text">Projects</span>
            </Link>
            <Link to="/admin/members" className={`nav-link ${isActive('/admin/members') ? 'active' : ''}`}>
              <span>👥</span> <span className="sidebar-text">Members</span>
            </Link>
            <Link to="/admin/create-task" className={`nav-link ${isActive('/admin/create-task') ? 'active' : ''}`}>
              <span>➕</span> <span className="sidebar-text">Create Task</span>
            </Link>
          </>
        ) : (
          <>
            <Link to="/manager/dashboard" className={`nav-link ${isActive('/manager/dashboard') ? 'active' : ''}`}>
              <span>📊</span> <span className="sidebar-text">Dashboard</span>
            </Link>
            <Link to="/manager/tasks" className={`nav-link ${isActive('/manager/tasks') ? 'active' : ''}`}>
              <span>📋</span> <span className="sidebar-text">All Tasks</span>
            </Link>
            <Link to="/manager/members" className={`nav-link ${isActive('/manager/members') ? 'active' : ''}`}>
              <span>👥</span> <span className="sidebar-text">Members</span>
            </Link>
            <Link to="/manager/projects" className={`nav-link ${isActive('/manager/projects') ? 'active' : ''}`}>
              <span>📁</span> <span className="sidebar-text">Projects</span>
            </Link>
            <Link to="/manager/create-task" className={`nav-link ${isActive('/manager/create-task') ? 'active' : ''}`}>
               <span>➕</span> <span className="sidebar-text">Create Task</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
