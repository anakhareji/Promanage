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
  if(!title) return alert("Enter title");

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
    if(!r.ok) throw new Error("Create failed");
    return r.json();
  })
  .then(() => {
    setTitle("");
    setStatus("Not Started");
    setPriority("Medium");
    loadTasks();
    refreshDashboard();
  })
  .catch(err=>{
    alert("Task create failed");
    console.log(err);
  });
};


  // DELETE
  const deleteTask = id => {
    fetch(API + "/tasks/" + id, { method: "DELETE" })
      .then(loadTasks)
      .then(refreshDashboard);
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
      refreshDashboard();
    });
  };

  return (
    <div>

      <h2 style={{marginBottom:"10px"}}>Task Management</h2>

      {/* CREATE FORM */}
      <div style={createBox}>
        <input style={input} placeholder="Task Title"
          value={title} onChange={e=>setTitle(e.target.value)} />

        <select style={input} value={status} onChange={e=>setStatus(e.target.value)}>
          <option>Not Started</option>
          <option>Pending</option>
          <option>Progress</option>
          <option>Completed</option>
        </select>

        <select style={input} value={priority} onChange={e=>setPriority(e.target.value)}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <button style={createBtn} onClick={createTask}>+ Create Task</button>
      </div>

      {/* TABLE */}
      <table style={tableStyle}>
        <thead>
          <tr>
            {["ID","Title","Status","Priority","Action"].map(h=>
              <th key={h} style={th}>{h}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {tasks.map(t=>(
            <tr key={t.id}>
              <td style={td}>{t.id}</td>
              <td style={td}>{t.title}</td>
              <td style={td}>{t.status}</td>
              <td style={td}>{t.priority}</td>
              <td style={td}>
                <button style={editBtn} onClick={()=>setEditTask({...t})}>Edit</button>{" "}
                <button style={delBtn} onClick={()=>deleteTask(t.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* UPDATE MODAL */}
      {editTask &&
        <div style={modalBg}>
          <div style={modalCard}>
            <h3>Edit Task</h3>

            <input style={input}
              value={editTask.title}
              onChange={e=>setEditTask({...editTask,title:e.target.value})}
            />

            <select style={input}
              value={editTask.status}
              onChange={e=>setEditTask({...editTask,status:e.target.value})}
            >
              <option>Not Started</option>
              <option>Pending</option>
              <option>Progress</option>
              <option>Completed</option>
            </select>

            <select style={input}
              value={editTask.priority}
              onChange={e=>setEditTask({...editTask,priority:e.target.value})}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <div style={{textAlign:"right"}}>
              <button style={saveBtn} onClick={updateTask}>Update</button>{" "}
              <button style={cancelBtn} onClick={()=>setEditTask(null)}>Cancel</button>
            </div>
          </div>
        </div>
      }

    </div>
  );
}
const createBox={background:"white",padding:"15px",marginBottom:"20px",borderRadius:"10px",display:"flex",gap:"10px",flexWrap:"wrap"};

const tableStyle={width:"100%",borderCollapse:"collapse",background:"white"};
const th={background:"#2563eb",color:"white",padding:"10px"};
const td={padding:"10px",textAlign:"center",borderBottom:"1px solid #ddd"};

const input={padding:"10px",borderRadius:"6px",border:"1px solid #ccc",minWidth:"180px"};

const createBtn={background:"#2563eb",color:"white",border:"none",padding:"10px 16px",borderRadius:"8px"};

const editBtn={background:"green",color:"white",border:"none",padding:"6px 10px",borderRadius:"6px"};
const delBtn={background:"red",color:"white",border:"none",padding:"6px 10px",borderRadius:"6px"};

const modalBg={position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",display:"flex",justifyContent:"center",alignItems:"center"};
const modalCard={background:"white",padding:"25px",borderRadius:"12px",width:"350px"};

const saveBtn={background:"#2563eb",color:"white",border:"none",padding:"8px 14px",borderRadius:"6px"};
const cancelBtn={background:"gray",color:"white",border:"none",padding:"8px 14px",borderRadius:"6px"};


export default Tasks;
