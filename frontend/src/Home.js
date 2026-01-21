import React, { useState, useEffect } from "react";

function Home(props) {

  const pinnedList = [
    "Design Dashboard",
    "Create Task Module",
    "Fix Login Bug",
    "API Integration",
    "Testing Phase"
  ];

  const [pinnedTask, setPinnedTask] = useState(pinnedList[0]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % pinnedList.length;
      setPinnedTask(pinnedList[i]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return React.createElement(
    "div",
    { style: { padding: "25px" } },

    // WELCOME
    React.createElement("h2", null, "Welcome ", props.name, " 👋"),

    React.createElement(
      "p",
      { style: { marginBottom: "15px", color: "#555" } },
      "ProManage Task Management Dashboard"
    ),

    // LOGIN STATS FROM DB
    props.user && React.createElement(
  "div",
  { style:{background:"#ecfdf5",padding:"15px",borderRadius:"10px",marginBottom:"20px"} },
  React.createElement("p", null, "Login Count: ", props.user.login_count),
  React.createElement("p", null, "Last Login: ", props.user.last_login),
  React.createElement("p", null, "Status: Logged In")
),


    // DASH CARDS
    React.createElement(
      "div",
      { style: cardRow },
      dashCard("Total Projects", 0),
      dashCard("Total Tasks", 0),
      dashCard("Pending Tasks", 0),
      dashCard("Completed Tasks", 0)
    ),

    // PINNED TASK
    React.createElement(
      "div",
      { style: pinnedCard },
      React.createElement("h3", null, "Pinned Task"),
      React.createElement("h2", { style: { color: "#2563eb" } }, pinnedTask),
      React.createElement(
        "p",
        { style: { color: "#777" } },
        "Pinned task auto changes every few seconds"
      )
    )
  );
}

function dashCard(title, value) {
  return React.createElement(
    "div",
    { style: statCard },
    React.createElement("p", { style: { color: "#777" } }, title),
    React.createElement("h2", null, value)
  );
}

const loginCard = {
  background: "#ecfdf5",
  padding: "15px",
  borderRadius: "10px",
  marginBottom: "20px",
  border: "1px solid #bbf7d0"
};

const cardRow = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "15px",
  marginBottom: "25px"
};

const statCard = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 5px 10px rgba(0,0,0,0.1)",
  textAlign: "center"
};

const pinnedCard = {
  background: "white",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 5px 10px rgba(0,0,0,0.1)",
  textAlign: "center"
};

export default Home;
