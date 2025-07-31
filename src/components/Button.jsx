import React from "react";

export default function Button({ children, onClick, className = "", ...props }) {
  return (
    <button
      onClick={onClick}
      className={`bg-white text-gray-900 px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 active:scale-100 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
