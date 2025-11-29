import React from "react";

const SensorCard = ({ icon, title, value, unit, status, bgColor, onClick }) => {
  const style = {
    background: bgColor,
    borderRadius: 16,
    padding: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    transition: "background-color 0.5s ease",
    cursor: onClick ? "pointer" : "default",
  };

  return (
    <div style={style} onClick={onClick}>
      <div style={{ fontSize: 32 }}>{icon}</div>
      <div>
        <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{title}</h3>
        <p style={{ margin: 0, fontWeight: "bold", fontSize: "1.3rem" }}>
          {value} <span style={{ fontSize: "0.9rem", color: "#777" }}>{unit}</span>
        </p>
        <p
          style={{
            margin: 0,
            fontWeight: "600",
            color:
              status === "Thấp"
                ? "#1565c0"
                : status === "Trung bình"
                  ? "#ef6c00"
                  : "#c62828",
          }}
        >
          Tình trạng: {status}
        </p>
      </div>
    </div>
  );
};



export default SensorCard;
