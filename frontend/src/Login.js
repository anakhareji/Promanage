import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleLogin() {
    setError("");

    fetch("http://localhost:8000/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email.trim(),
        password: password.trim(),
        role: role.toLowerCase().trim()
      })
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Invalid credentials");
        return data;
      })
      .then(data => {
        console.log("LOGIN SUCCESS:", data);
        setUser(data);

        // Redirect based on role
        if (data.role === "admin") navigate("/admin/dashboard");
        else if (data.role === "manager") navigate("/manager/dashboard");
        else navigate("/");
      })
      .catch(err => {
        console.log("LOGIN ERROR:", err.message);
        setError(err.message);
      });
  }

  return (
    <div className="flex-item-center" style={{ minHeight: "100vh", justifyContent: "center", background: "var(--bg-dark)" }}>
      <div className="card" style={{ width: "350px" }}>
        <h2 className="text-center" style={{ color: "var(--primary)", marginBottom: "1.5rem" }}>ProManage Login</h2>

        {error && <div className="text-center" style={{ color: "var(--danger)", marginBottom: "1rem" }}>{error}</div>}

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Role</label>
          <select
            className="form-input"
            value={role}
            onChange={e => setRole(e.target.value)}
            style={{ color: "var(--text-main)", backgroundColor: "rgba(0,0,0,0.2)" }}
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        <button className="btn btn-primary btn-full" onClick={handleLogin}>
          Login
        </button>
        
        <div className="text-center mt-4">
          <span style={{ color: "var(--text-muted)" }}>Don't have an account? </span>
          <Link to="/register" style={{ color: "var(--primary)", textDecoration: "none" }}>Sign up</Link>
        </div>

      </div>
    </div>
  );
}

export default Login;
