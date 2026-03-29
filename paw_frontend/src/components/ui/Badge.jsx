import React from "react";

export default function Badge({ children, className = "", icon: Icon }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${className}`}>
      {Icon && <Icon size={12} strokeWidth={2} />}
      {children}
    </span>
  );
}
