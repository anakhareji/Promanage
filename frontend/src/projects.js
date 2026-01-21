import React, { useState, useEffect } from "react";

const API = "http://127.0.0.1:8000";

function Projects() {

  const [projects, setProjects] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Not Started");
  const [deadline, setDeadline] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchProjects = () => {
    fetch(API + "/projects/")
      .then(res => res.json())
      .then(data => setProjects(data));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const saveProject = () => {
    const method = editId ? "PUT" : "POST";
    const url = editId
      ? API + "/projects/" + editId
      : API + "/projects/";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        status,
        deadline
      })
    }).then(() => {
      clearForm();
      fetchProjects();
    });
  };

  const deleteProject = (id) => {
    fetch(API + "/projects/" + id, { method: "DELETE" })
      .then(() => fetchProjects());
  };

  const clearForm = () => {
    setName("");
    setDescription("");
    setStatus("Not Started");
    setDeadline("");
    setEditId(null);
  };

  return (
    <div>

      <h2 style={titleStyle}>📁 Project Management</h2>

      {/* FORM CARD */}
      <div style={cardStyle}>

        <h3>{editId ? "Update Project" : "Create Project"}</h3>

        <input
          placeholder="Project Name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={inputBox}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={inputBox}
        />

        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          style={inputBox}
        >
          <option>Not Started</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <input
          type="date"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
          style={inputBox}
        />

        <button style={saveBtn} onClick={saveProject}>
          {editId ? "Update Project" : "+ Create Project"}
        </button>

        {editId && (
          <button style={cancelBtn} onClick={clearForm}>
            Cancel Edit
          </button>
        )}

      </div>

      {/* TABLE */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Deadline</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>

        <tbody>
          {projects.map(p => (
            <tr key={p.id}>
              <td style={tdStyle}>{p.id}</td>
              <td style={tdStyle}>{p.name}</td>
              <td style={tdStyle}>{p.description}</td>
              <td style={tdStyle}>{p.status}</td>
              <td style={tdStyle}>{p.deadline}</td>
              <td style={tdStyle}>

                <button
                  style={updateBtn}
                  onClick={() => {
                    setEditId(p.id);
                    setName(p.name);
                    setDescription(p.description);
                    setStatus(p.status);
                    setDeadline(p.deadline);
                  }}
                >
                  Update
                </button>

                <button
                  style={deleteBtn}
                  onClick={() => deleteProject(p.id)}
                >
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

/* ---------- STYLES ---------- */

const titleStyle = {
  marginBottom: "20px",
  color: "#1e40af"
};

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  marginBottom: "25px",
  width: "420px"
};

const inputBox = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const saveBtn = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "10px 15px",
  borderRadius: "8px",
  cursor: "pointer",
  marginRight: "10px"
};

const cancelBtn = {
  background: "gray",
  color: "white",
  border: "none",
  padding: "10px 15px",
  borderRadius: "8px",
  cursor: "pointer"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "white",
  boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
};

const thStyle = {
  background: "#2563eb",
  color: "white",
  padding: "10px"
};

const tdStyle = {
  padding: "10px",
  textAlign: "center",
  borderBottom: "1px solid #ddd"
};

const updateBtn = {
  background: "green",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  marginRight: "6px",
  cursor: "pointer"
};

const deleteBtn = {
  background: "red",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  cursor: "pointer"
};

export default Projects;
