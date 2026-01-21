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

      <h2 className="page-title">📁 Project Management</h2>

      {/* FORM CARD */}
      <div className="card" style={{ maxWidth: "500px" }}>

        <h3 className="section-title">{editId ? "Update Project" : "Create Project"}</h3>

        <div className="form-group">
          <input
            className="input-box"
            placeholder="Project Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <textarea
            className="input-box"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows="3"
            style={{ fontFamily: "inherit" }}
          />
        </div>

        <div className="form-group">
          <select
            className="input-box"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>

        <div className="form-group">
          <input
            className="input-box"
            type="date"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={saveProject}>
            {editId ? "Update Project" : "+ Create Project"}
          </button>

          {editId && (
            <button className="btn btn-secondary" onClick={clearForm}>
              Cancel
            </button>
          )}
        </div>

      </div>

      {/* TABLE */}
      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Deadline</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {projects.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td style={{ fontWeight: 500 }}>{p.name}</td>
                <td style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {p.description}
                </td>
                <td>
                  <span className={`badge ${
                    p.status === "Completed" ? "badge-completed" : 
                    p.status === "In Progress" ? "badge-active" : "badge-pending"
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td>{p.deadline}</td>
                <td>
                  <div className="flex gap-2">
                    <button
                      className="btn btn-success"
                      style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                      onClick={() => {
                        setEditId(p.id);
                        setName(p.name);
                        setDescription(p.description);
                        setStatus(p.status);
                        setDeadline(p.deadline);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger"
                      style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                      onClick={() => deleteProject(p.id)}
                    >
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

export default Projects;
