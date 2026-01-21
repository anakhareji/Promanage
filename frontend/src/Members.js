import React, { useState, useEffect } from "react";

const API = "http://127.0.0.1:8000";

function Members({ refreshDashboard }) {

  const [members, setMembers] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Active");
  const [editId, setEditId] = useState(null);

  // ---------- FETCH MEMBERS ----------
  const fetchMembers = () => {
    fetch(API + "/members/")
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setMembers(data);
        else if (data.members) setMembers(data.members);
        else if (data.data) setMembers(data.data);
        else setMembers([]);
      })
      .catch(error => {
        console.error("Error fetching members:", error);
        setMembers([]);
      });
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // ---------- SAVE MEMBER ----------
  const saveMember = () => {
    const method = editId ? "PUT" : "POST";
    const url = editId
      ? API + "/members/" + editId
      : API + "/members/";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password: "member123",
        role: "member",
        position,
        is_active: status === "Active"
      })
    })
      .then(res => res.json())
      .then(() => {
        clearForm();
        fetchMembers();
        if (refreshDashboard) refreshDashboard();
      });
  };

  // ---------- DELETE ----------
  const deleteMember = (id) => {
    fetch(API + "/members/" + id, { method: "DELETE" })
      .then(() => {
        fetchMembers();
        if (refreshDashboard) refreshDashboard();
      });
  };

  // ---------- CLEAR ----------
  const clearForm = () => {
    setName("");
    setEmail("");
    setPosition("");
    setStatus("Active");
    setEditId(null);
  };

  // ---------- COUNTERS ----------
  const total = members.length;
  const active = members.filter(m => m.is_active).length;
  const inactive = members.filter(m => !m.is_active).length;

  return (
    <div>

      <h2 className="page-title">👥 Members Management</h2>

      {/* STATS */}
      <div className="grid-3 mb-4">
        <StatCard title="Total Members" value={total} color="var(--primary)" />
        <StatCard title="Active Members" value={active} color="var(--success)" />
        <StatCard title="Inactive Members" value={inactive} color="var(--danger)" />
      </div>

      {/* FORM */}
      <div className="card" style={{ maxWidth: "500px" }}>
        <h3 className="section-title">{editId ? "Update Member" : "Create Member"}</h3>

        <div className="form-group">
          <input className="input-box" placeholder="Name" value={name}
            onChange={e => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <input className="input-box" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)} />
        </div>

        <div className="form-group">
          <input className="input-box" placeholder="Position" value={position}
            onChange={e => setPosition(e.target.value)} />
        </div>

        <div className="form-group">
          <select className="input-box" value={status}
            onChange={e => setStatus(e.target.value)}>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={saveMember}>
            {editId ? "Update Member" : "+ Create Member"}
          </button>
          {editId && <button className="btn btn-secondary" onClick={clearForm}>Cancel</button>}
        </div>
      </div>

      {/* TABLE */}
      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Position</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map(m => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td style={{ fontWeight: 500 }}>{m.name}</td>
                <td>{m.email}</td>
                <td>{m.position}</td>
                <td>
                  <span className={`badge ${m.is_active ? "badge-active" : "badge-inactive"}`}>
                    {m.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-success" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }} onClick={() => {
                      setEditId(m.id);
                      setName(m.name);
                      setEmail(m.email);
                      setPosition(m.position);
                      setStatus(m.is_active === 1 ? "Active" : "Active"); // Assuming 1/0 or bool, treating as active for now? Logic was m.is_active===1
                      // Wait, original logic: setStatus(m.is_active===1?"Active":"Inactive");
                      // But let's check m.is_active type. If boolean:
                      setStatus(m.is_active ? "Active" : "Inactive");
                    }}>
                      Edit
                    </button>
                    <button className="btn btn-danger" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }} onClick={() => deleteMember(m.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

/* ---------- STAT CARD ---------- */
const StatCard = ({ title, value, color }) => (
  <div className="card stat-card" style={{ marginBottom: 0, textAlign: "center", borderTop: `4px solid ${color}` }}>
    <p style={{ color: "var(--text-secondary)", marginBottom: "0.5rem", fontSize: "0.9rem" }}>{title}</p>
    <h2 style={{ fontSize: "2rem", margin: 0, color: "var(--text-main)" }}>{value}</h2>
  </div>
);

export default Members;
