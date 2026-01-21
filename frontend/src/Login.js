import React, { useState } from "react";

function Login(props) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");

  function handleLogin() {
    setError("");

    fetch("http://127.0.0.1:8000/login/", {
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

        props.setName(data.name);
        props.setUser(data);

        // 🔥 ROLE BASED REDIRECT
        if (data.role === "admin") {
          props.setPage("admin");
        } 
        else if (data.role === "manager") {
          props.setPage("manager");
        }
        else {
          props.setPage("home");
        }
      })
      .catch(err => {
        console.log("LOGIN ERROR:", err.message);
        setError(err.message);
      });
  }

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={title}>ProManage Login</h2>

        {error && <p style={errorStyle}>{error}</p>}

        <input
          style={input}
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          style={input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <select
          style={input}
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="member">Member</option>
        </select>

        <button style={btn} onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

/* ---------- UI STYLES ---------- */

const container = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "85vh",
  background: "#f2f4f8"
};

const card = {
  background: "white",
  padding: "30px",
  width: "330px",
  borderRadius: "12px",
  boxShadow: "0 6px 15px rgba(0,0,0,0.25)"
};

const title = {
  textAlign: "center",
  color: "#2563eb",
  marginBottom: "20px"
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "14px"
};

const btn = {
  width: "100%",
  padding: "10px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontSize: "16px",
  cursor: "pointer"
};

const errorStyle = {
  color: "red",
  textAlign: "center",
  marginBottom: "10px",
  fontWeight: "bold"
};

export default Login;
