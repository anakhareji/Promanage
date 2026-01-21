import React from "react";

function About() {
  return React.createElement(
    "div",
    { style: { padding: "30px" } },
    React.createElement(
      "div",
      { style: card },
      React.createElement("h2", null, "About ProManage"),
      React.createElement(
        "p",
        null,
        "ProManage is a task management system for Admin, Manager and Team Members."
      )
    )
  );
}

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 5px 10px rgba(0,0,0,0.1)"
};

export default About;
