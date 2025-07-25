// src/components/CardContent.jsx
import React from "react";

export default function CardContent({ children, className = "" }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
