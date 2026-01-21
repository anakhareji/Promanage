import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Layout from "./components/Layout";
import Home from "./Home";
import Members from "./Members";
import Tasks from "./Tasks";
import Projects from "./projects";
import ManagerDashboard from "./ManagerDashboard";

function App() {
  const [user, setUser] = useState(null);

  // Protected Route Wrapper
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!user) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to={user ? (user.role === 'admin' ? "/admin/dashboard" : "/manager/dashboard") : "/login"} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout user={user} setUser={setUser}>
              <Routes>
                <Route path="dashboard" element={<Home user={user} />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="projects" element={<Projects />} />
                <Route path="members" element={<Members />} />
                <Route path="create-task" element={<div>Create Task Component Placeholder</div>} />
                <Route path="*" element={<Navigate to="dashboard" />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />

        {/* Manager Routes */}
        <Route path="/manager/*" element={
          <ProtectedRoute allowedRoles={['manager']}>
            <Layout user={user} setUser={setUser}>
              <Routes>
                <Route path="dashboard" element={<ManagerDashboard />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="members" element={<Members />} />
                <Route path="projects" element={<Projects />} />
                <Route path="create-task" element={<div>Create Task Manager Placeholder</div>} />
                <Route path="*" element={<Navigate to="dashboard" />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />

      </Routes>
    </Router>
  );
}

export default App;
