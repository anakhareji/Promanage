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
      console.log("Response status:", res.status);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      console.log("RAW API:", data);

      if (Array.isArray(data)) {
        console.log("Setting members:", data);
        setMembers(data);
      } 
      else if (data.members) {
        setMembers(data.members);
      }
      else if (data.data) {
        setMembers(data.data);
      }
      else {
        setMembers([]);
      }
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

      <h2 style={{color:"#1e40af"}}>👥 Members Management</h2>

      {/* STATS */}
      <div style={{display:"flex",gap:"20px",marginBottom:"20px"}}>
        <StatCard title="Total Members" value={total} />
        <StatCard title="Active" value={active} />
        <StatCard title="Inactive" value={inactive} />
      </div>

      {/* FORM */}
      <div style={cardStyle}>
        <h3>{editId ? "Update Member" : "Create Member"}</h3>

        <input placeholder="Name" value={name}
          onChange={e=>setName(e.target.value)} style={inputBox}/>

        <input placeholder="Email" value={email}
          onChange={e=>setEmail(e.target.value)} style={inputBox}/>

        <input placeholder="Position" value={position}
          onChange={e=>setPosition(e.target.value)} style={inputBox}/>

        <select value={status}
          onChange={e=>setStatus(e.target.value)} style={inputBox}>
          <option>Active</option>
          <option>Inactive</option>
        </select>

        <button style={saveBtn} onClick={saveMember}>
          {editId ? "Update Member" : "+ Create Member"}
        </button>

        {editId && <button style={cancelBtn} onClick={clearForm}>Cancel</button>}
      </div>

      {/* TABLE */}
      <table style={tableStyle}>
        <thead>
          <tr>
            {["ID","Name","Email","Position","Status","Action"].map(h =>
              <th key={h} style={thStyle}>{h}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {members.map(m => (
            <tr key={m.id}>
              <td style={tdStyle}>{m.id}</td>
              <td style={tdStyle}>{m.name}</td>
              <td style={tdStyle}>{m.email}</td>
              <td style={tdStyle}>{m.position}</td>

              <td style={{
                ...tdStyle,
                color: m.is_active ? "green" : "red",
                fontWeight:"bold"
              }}>
                {m.is_active ? "Active" : "Inactive"}
              </td>

              <td style={tdStyle}>
                <button style={updateBtn} onClick={()=>{
                  setEditId(m.id);
                  setName(m.name);
                  setEmail(m.email);
                  setPosition(m.position);
                  setStatus(m.is_active===1?"Active":"Inactive");
                }}>
                  Update
                </button>{" "}

                <button style={deleteBtn} onClick={()=>deleteMember(m.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

/* ---------- STAT CARD ---------- */
const StatCard = ({title,value}) => (
  <div style={{
    background:"white",
    padding:"15px",
    borderRadius:"10px",
    boxShadow:"0 4px 10px rgba(0,0,0,0.1)",
    width:"160px",
    textAlign:"center"
  }}>
    <p style={{color:"#777"}}>{title}</p>
    <h2>{value}</h2>
  </div>
);

/* ---------- STYLES ---------- */

const cardStyle = {
  background:"white",
  padding:"20px",
  borderRadius:"12px",
  boxShadow:"0 4px 10px rgba(0,0,0,0.15)",
  width:"420px",
  marginBottom:"25px"
};

const inputBox = {
  width:"100%",
  padding:"10px",
  marginBottom:"12px",
  borderRadius:"6px",
  border:"1px solid #ccc"
};

const saveBtn = {
  background:"#2563eb",
  color:"white",
  border:"none",
  padding:"10px 15px",
  borderRadius:"8px",
  cursor:"pointer",
  marginRight:"10px"
};

const cancelBtn = {
  background:"gray",
  color:"white",
  border:"none",
  padding:"10px 15px",
  borderRadius:"8px",
  cursor:"pointer"
};

const tableStyle = {
  width:"100%",
  borderCollapse:"collapse",
  background:"white",
  boxShadow:"0 4px 10px rgba(0,0,0,0.15)"
};

const thStyle = {
  background:"#2563eb",
  color:"white",
  padding:"10px"
};

const tdStyle = {
  padding:"10px",
  textAlign:"center",
  borderBottom:"1px solid #ddd"
};

const updateBtn = {
  background:"green",
  color:"white",
  border:"none",
  padding:"6px 10px",
  borderRadius:"6px",
  cursor:"pointer",
  marginRight:"6px"
};

const deleteBtn = {
  background:"red",
  color:"white",
  border:"none",
  padding:"6px 10px",
  borderRadius:"6px",
  cursor:"pointer"
};

export default Members;
