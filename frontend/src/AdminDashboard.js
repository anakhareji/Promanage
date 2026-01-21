{page==="admin" &&
  <div style={{display:"flex"}}>

    {/* SIDEBAR */}
    <div style={{
      width:"220px",
      background:"#1e40af",
      padding:"20px",
      minHeight:"100vh"
    }}>

      <button style={sideBtn} onClick={()=>setAdminTab("dashboard")}>Dashboard</button>
      <button style={sideBtn} onClick={()=>setAdminTab("tasks")}>Tasks</button>
      <button style={sideBtn} onClick={()=>setAdminTab("projects")}>Projects</button>
      <button style={sideBtn} onClick={()=>setAdminTab("members")}>Members</button>

    </div>

    {/* CONTENT */}
    <div style={{flex:1,padding:"25px"}}>

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
        <div>
          <h2>All Tasks</h2>
          <table border="1" width="100%" cellPadding="10">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(t=>(
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.title}</td>
                  <td>{t.status}</td>
                  <td>{t.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
