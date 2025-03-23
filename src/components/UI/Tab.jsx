import React from "react";

const Tab = ({ children, active, onClick }) => {
  return (
    <button className={`tab ${active ? "active" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Tab;
