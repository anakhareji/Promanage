import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("manager");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  function handleRegister() {
    setError("");
    setSuccess(false);

    const payload = {
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      role: role.toLowerCase().trim()
    };

    fetch("http://localhost:8000/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json" // JSON Body
      },
      body: JSON.stringify(payload)
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          // Handle Validation Errors (Array of errors)
          if (data.detail && Array.isArray(data.detail)) {
            const msgs = data.detail.map(e => e.msg).join(", ");
            throw new Error(msgs);
          }
          throw new Error(data.detail || "Registration failed");
        }
        return data;
      })
      .then(data => {
        console.log("REGISTER SUCCESS:", data);
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      })
      .catch(err => {
        console.log("REGISTER ERROR:", err.message);
        setError(err.message);
      });
  }

  return (
    <div className="flex-item-center" style={{ minHeight: "100vh", justifyContent: "center", background: "var(--bg-dark)" }}>
      <div className="card" style={{ width: "350px" }}>
        <h2 className="text-center" style={{ color: "var(--primary)", marginBottom: "1.5rem" }}>Create Account</h2>

        {error && <div className="text-center" style={{ color: "var(--danger)", marginBottom: "1rem" }}>{error}</div>}
        {success && <div className="text-center" style={{ color: "var(--success)", marginBottom: "1rem" }}>Registration Successful! Redirecting...</div>}

        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            className="form-input"
            placeholder="John Doe"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

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
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button className="btn btn-primary btn-full" onClick={handleRegister}>
          Register
        </button>

        <div className="text-center mt-4">
          <span style={{ color: "var(--text-muted)" }}>Already have an account? </span>
          <Link to="/login" style={{ color: "var(--primary)", textDecoration: "none" }}>Login</Link>
        </div>

      </div>
    </div>
  );
}

export default Register;
