import React, { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000";

function ManagerDashboard() {

  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [taskComments, setTaskComments] = useState({});
  const [newComment, setNewComment] = useState({});

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "Pending",
    priority: "Medium"
  });

  const loadAll = () => {
    fetch(API + "/manager/tasks-with-member/")
      .then(r => r.json())
      .then(data => {
        setTasks(data);
        data.forEach(task => loadComments(task.id));
      })
      .catch(error => console.error("Error loading tasks:", error));

    fetch(API + "/members/")
      .then(r => r.json())
      .then(setMembers)
      .catch(error => console.error("Error loading members:", error));
  };

  const loadComments = (taskId) => {
    fetch(API + `/manager/task-comments/${taskId}`)
      .then(r => r.json())
      .then(comments => {
        setTaskComments(prev => ({ ...prev, [taskId]: comments }));
      })
      .catch(error => console.error("Error loading comments for task", taskId, error));
  };

  useEffect(() => {
    loadAll();
  }, []);

  const saveTask = (taskId, updates) => {
    fetch(API + `/manager/update-task/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    }).then(() => {
      alert("Saved Successfully");
      loadAll();
    }).catch(error => console.error("Error saving task:", error));
  };

  const addComment = (taskId) => {
    const comment = newComment[taskId];
    if (!comment) return;
    saveTask(taskId, { comment });
    setNewComment(prev => ({ ...prev, [taskId]: "" }));
  };

  const createTask = () => {
    fetch(API + "/manager/create-task/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask)
    }).then(() => {
      alert("Task Created");
      setNewTask({ title: "", description: "", status: "Pending", priority: "Medium" });
      loadAll();
    }).catch(error => console.error("Error creating task:", error));
  };

  return (
    <div style={{ padding: "20px", background: "#f5f5f5", minHeight: "100vh" }}>

      <h1 style={{ color: "#2563eb", textAlign: "center", marginBottom: "30px" }}>
        🔥 MANAGER DASHBOARD 🔥
      </h1>

      {/* CREATE TASK */}
      <div style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        marginBottom: "30px"
      }}>
        <h3>Create New Task</h3>
        <input
          placeholder="Title"
          value={newTask.title}
          onChange={e => setNewTask({ ...newTask, title: e.target.value })}
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <textarea
          placeholder="Description"
          value={newTask.description}
          onChange={e => setNewTask({ ...newTask, description: e.target.value })}
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc", height: "60px" }}
        />
        <select
          value={newTask.priority}
          onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
          style={{ padding: "10px", marginRight: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <button
          onClick={createTask}
          style={{ padding: "10px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          Create Task
        </button>
      </div>

      {/* TASKS CARDS */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {tasks.map(t => (
          <div key={t.id} style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
          }}>
            <h4>{t.title}</h4>
            <p><strong>Status:</strong>
              <select
                value={t.status}
                onChange={e => {
                  const newTasks = [...tasks];
                  const idx = newTasks.findIndex(x => x.id === t.id);
                  newTasks[idx].status = e.target.value;
                  setTasks(newTasks);
                }}
                style={{ marginLeft: "10px", padding: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </p>
            <p><strong>Priority:</strong> {t.priority}</p>
            <p><strong>Assigned to:</strong>
              <select
                value={t.assigned_to || ""}
                onChange={e => {
                  const newTasks = [...tasks];
                  const idx = newTasks.findIndex(x => x.id === t.id);
                  newTasks[idx].assigned_to = e.target.value;
                  setTasks(newTasks);
                }}
                style={{ marginLeft: "10px", padding: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
              >
                <option value="">Select Member</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </p>

            {/* COMMENTS */}
            <div style={{ marginTop: "20px" }}>
              <h5>Comments</h5>
              {taskComments[t.id]?.map(c => (
                <div key={c.id} style={{
                  background: "#f9f9f9",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "5px"
                }}>
                  {c.comment_text}
                </div>
              ))}
              <input
                placeholder="Add comment"
                value={newComment[t.id] || ""}
                onChange={e => setNewComment({ ...newComment, [t.id]: e.target.value })}
                style={{ width: "70%", padding: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
              />
              <button
                onClick={() => addComment(t.id)}
                style={{ marginLeft: "10px", padding: "5px 10px", background: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
              >
                Add
              </button>
            </div>

            <button
              onClick={() => saveTask(t.id, { status: t.status, assigned_to: t.assigned_to })}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                width: "100%"
              }}
            >
              Save Changes
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}

export default ManagerDashboard;
