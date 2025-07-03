// src/components/Card.jsx
import React from "react";

export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white/10 backdrop-blur p-4 rounded-xl shadow ${className}`}>
      {children}
    </div>
  );
}
