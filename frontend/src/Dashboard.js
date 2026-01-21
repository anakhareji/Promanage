
import React, { useState } from "react";

function App() {
  const _useState = useState;
  const pageState = _useState("home");
  const nameState = _useState("Guest");

  const page = pageState[0];
  const setPage = pageState[1];

  const name = nameState[0];
  const setName = nameState[1];

  return React.createElement(
    "div",
    { style: { minHeight: "100vh", background: "#f2f4f8" } },

    // NAVBAR
    React.createElement(
      "div",
      {
        style: {
          background: "#2563eb",
          color: "white",
          padding: "15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }
      },
      React.createElement("h2", null, "ProManage"),
      React.createElement(
        "div",
        null,
        React.createElement("button", { style: btnNav, onClick: () => setPage("home") }, "Home"),
        React.createElement("button", { style: btnNav, onClick: () => setPage("about") }, "About"),
        React.createElement("button", { style: btnNav, onClick: () => setPage("login") }, "Login")
      )
    ),

    // CONTENT
    React.createElement(
      "div",
      { style: { padding: "30px" } },

      page === "home" && React.createElement(
        "div",
        { style: card },
        React.createElement("h2", null, "Welcome ", name, " 👋"),
        React.createElement("p", null, "This is ProManage Task Management Dashboard.")
      ),

      page === "about" && React.createElement(
        "div",
        { style: card },
        React.createElement("h2", null, "About ProManage"),
        React.createElement("p", null, "ProManage is a task management system for Admin, Manager and Team Members.")
      ),

      page === "login" && React.createElement(
        "div",
        { style: Object.assign({}, card, { width: "300px" }) },
        React.createElement("h2", null, "Login"),
        React.createElement("input", {
          style: input,
          placeholder: "Enter your name",
          onChange: (e) => setName(e.target.value)
        }),
        React.createElement("button", {
          style: btn,
          onClick: () => setPage("home")
        }, "Login")
      )
    )
  );
}

const btnNav = {
  marginLeft: "10px",
  background: "white",
  color: "#2563eb",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer"
};

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 5px 10px rgba(0,0,0,0.1)"
};

const input = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const btn = {
  width: "100%",
  padding: "10px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

export default App;
