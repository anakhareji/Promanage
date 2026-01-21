import React, { useState, useEffect } from "react";
import Tasks from "./Tasks";
import Login from "./Login";
import Home from "./Home";
import About from "./About";
import Projects from "./projects";
import Members from "./Members";
import ManagerDashboard from "./ManagerDashboard";

function App() {

  const [page, setPage] = useState("home");
  const [adminTab, setAdminTab] = useState("dashboard");

  const [name, setName] = useState("Guest");
  const [user, setUser] = useState(null);

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);

  const API = "http://127.0.0.1:8000";

  const fetchProjects = () => fetch(API+"/projects/").then(r=>r.json()).then(setProjects);
  const fetchTasks = () => fetch(API+"/tasks/").then(r=>r.json()).then(setTasks);
  const fetchMembers = () => fetch(API+"/members/").then(r=>r.json()).then(setMembers);

  const refreshAll = () => {
    fetchProjects();
    fetchTasks();
    fetchMembers();
  };

  useEffect(()=>{
    if(page==="admin") refreshAll();
  },[page]);

  const logout = () => {
    fetch(API+"/logout/"+user.id,{method:"POST"}).then(()=>{
      setUser(null);
      setName("Guest");
      setPage("home");
    });
  };

  return (
    <div style={{minHeight:"100vh",background:"#f2f4f8"}}>

      {/* NAVBAR */}
      <div style={navBar}>
        <h2>ProManage</h2>
        <div>
          <button style={btnNav} onClick={()=>setPage("home")}>Home</button>
          <button style={btnNav} onClick={()=>setPage("about")}>About</button>
          {user
            ? <button style={btnNav} onClick={logout}>Logout</button>
            : <button style={btnNav} onClick={()=>setPage("login")}>Login</button>}
        </div>
      </div>

      {page==="home" && <Home name={name} user={user}/>}
      {page==="about" && <About/>}

      {page==="admin" &&
  <div style={{display:"flex"}}>

    {/* SIDEBAR */}
    <div style={sidebarStyle}>
      {sidebarBtn("Dashboard",()=>setAdminTab("dashboard"))}
      {sidebarBtn("Tasks",()=>setAdminTab("tasks"))}
      {sidebarBtn("Projects",()=>setAdminTab("projects"))}
      {sidebarBtn("Members",()=>setAdminTab("members"))}
    </div>

    {/* CONTENT */}
    <div style={contentStyle}>

      {adminTab==="dashboard" &&
        <div>
          <h2>Admin Dashboard</h2>
          <div style={{display:"flex",gap:"20px"}}>
            <Card title="Projects" value={projects.length}/>
            <Card title="Tasks" value={tasks.length}/>
            <Card title="Members" value={members.length}/>
          </div>
        </div>
      }

      {adminTab==="tasks" &&
        <Tasks refreshDashboard={refreshAll}/>
      }

      {adminTab==="projects" &&
        <Projects refreshDashboard={refreshAll}/>
      }

      {adminTab==="members" &&
        <Members refreshDashboard={refreshAll}/>
      }

    </div>
  </div>
}

      {page==="manager" && <ManagerDashboard/>}

      {page==="login" &&
        <Login
          setName={setName}
          setPage={setPage}
          setUser={(u)=>{
            setUser(u);
            if(u.role==="admin") setPage("admin");
            else if(u.role==="manager") setPage("manager");
            else setPage("home");
          }}
        />
      }

    </div>
  );
}

/* ---------- STYLES ---------- */

const navBar={background:"#2563eb",color:"white",padding:"15px",display:"flex",justifyContent:"space-between"};
const btnNav={marginLeft:"10px",background:"white",color:"#2563eb",border:"none",padding:"6px 14px",borderRadius:"8px",cursor:"pointer"};
const sidebarStyle={width:"220px",background:"#1e40af",padding:"20px",display:"flex",flexDirection:"column",gap:"12px"};
const sidebarBtnStyle={padding:"10px",borderRadius:"6px",border:"none",cursor:"pointer",fontWeight:"bold"};
const contentStyle={flex:1,padding:"25px"};

const sidebarBtn=(text,click)=>
  <button onClick={click} style={sidebarBtnStyle}>{text}</button>;
const Card = ({title,value}) => (
  <div style={{
    background:"white",
    padding:"20px",
    borderRadius:"10px",
    width:"160px",
    textAlign:"center",
    boxShadow:"0 2px 6px rgba(0,0,0,0.2)"
  }}>
    <h3>{title}</h3>
    <h1>{value}</h1>
  </div>
);

export default App;
