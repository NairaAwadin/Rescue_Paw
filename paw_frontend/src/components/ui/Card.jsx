import React from "react";

export default function Card({ children, className = "", hover = false, padding = "p-5", onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-[var(--radius-bento)] shadow-[var(--shadow-card)] border border-beige-200/40 ${padding} ${hover ? "transition-all duration-300 ease-in-out hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5 cursor-pointer" : ""} ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
