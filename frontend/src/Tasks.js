import React, { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000";

function Tasks({ refreshDashboard }) {

  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Not Started");
  const [priority, setPriority] = useState("Medium");

  const [editTask, setEditTask] = useState(null);

  const loadTasks = () => {
    fetch(API + "/tasks/")
      .then(r => r.json())
      .then(setTasks);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // CREATE
  const createTask = () => {
    if (!title) return alert("Enter title");

    fetch(API + "/tasks/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title,
        description: "",
        status: status,
        priority: priority
      })
    })
      .then(r => {
        if (!r.ok) throw new Error("Create failed");
        return r.json();
      })
      .then(() => {
        setTitle("");
        setStatus("Not Started");
        setPriority("Medium");
        loadTasks();
        if (refreshDashboard) refreshDashboard();
      })
      .catch(err => {
        alert("Task create failed");
        console.log(err);
      });
  };


  // DELETE
  const deleteTask = id => {
    fetch(API + "/tasks/" + id, { method: "DELETE" })
      .then(loadTasks)
      .then(() => {
        if (refreshDashboard) refreshDashboard();
      });
  };

  // UPDATE
  const updateTask = () => {
    fetch(API + "/tasks/" + editTask.id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editTask)
    }).then(() => {
      setEditTask(null);
      loadTasks();
      if (refreshDashboard) refreshDashboard();
    });
  };

  return (
    <div>

      <h2 className="page-title">📋 Task Management</h2>

      {/* CREATE FORM */}
      <div className="card" style={{ display: "flex", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "200px" }}>
          <input className="input-box" placeholder="Task Title"
            value={title} onChange={e => setTitle(e.target.value)} />
        </div>

        <div style={{ width: "150px" }}>
          <select className="input-box" value={status} onChange={e => setStatus(e.target.value)}>
            <option>Not Started</option>
            <option>Pending</option>
            <option>Progress</option>
            <option>Completed</option>
          </select>
        </div>

        <div style={{ width: "150px" }}>
          <select className="input-box" value={priority} onChange={e => setPriority(e.target.value)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <button className="btn btn-primary" onClick={createTask}>+ Create Task</button>
      </div>

      {/* TABLE */}
      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td style={{ fontWeight: 500 }}>{t.title}</td>
                <td>
                  <span className={`badge ${
                    t.status === "Completed" ? "badge-completed" :
                    t.status === "Progress" ? "badge-active" : "badge-pending"
                  }`}>
                    {t.status}
                  </span>
                </td>
                <td>
                  <span className={`badge ${
                    t.priority === "High" ? "badge-inactive" :
                    t.priority === "Low" ? "badge-completed" : "badge-pending"
                  }`}>
                    {t.priority}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-success" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }} onClick={() => setEditTask({ ...t })}>
                      Edit
                    </button>
                    <button className="btn btn-danger" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }} onClick={() => deleteTask(t.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* UPDATE MODAL */}
      {editTask &&
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex",
          justifyContent: "center", alignItems: "center", zIndex: 100
        }}>
          <div className="card" style={{ width: "400px", marginBottom: 0 }}>
            <h3 className="section-title">Edit Task</h3>

            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="input-box"
                value={editTask.title}
                onChange={e => setEditTask({ ...editTask, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="input-box"
                value={editTask.status}
                onChange={e => setEditTask({ ...editTask, status: e.target.value })}
              >
                <option>Not Started</option>
                <option>Pending</option>
                <option>Progress</option>
                <option>Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="input-box"
                value={editTask.priority}
                onChange={e => setEditTask({ ...editTask, priority: e.target.value })}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <div className="flex gap-2 justify-between mt-4">
              <button className="btn btn-secondary" onClick={() => setEditTask(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={updateTask}>Update Task</button>
            </div>
          </div>
        </div>
      }

    </div>
  );
}

export default Tasks;
