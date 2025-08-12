import React from "react";

const ComingSoonWrapper = ({ children }) => {
  return (
    <div
      style={{
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "1.5rem",
        color: "#888",
        textAlign: "center",
        padding: "20px",
      }}
    >
      {children || "Coming Soon 🚧"}
    </div>
  );
};

export default ComingSoonWrapper;
