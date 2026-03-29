import React from "react";

const variants = {
  primary: "bg-canard-600 text-white hover:bg-canard-800 active:bg-canard-900 shadow-sm",
  secondary: "bg-ambre-400 text-white hover:bg-ambre-600 active:bg-ambre-800 shadow-sm",
  outline: "bg-white border border-beige-200 text-taupe-800 hover:bg-beige-50 hover:border-beige-300",
  ghost: "text-taupe-600 hover:bg-beige-50 hover:text-taupe-800",
  danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
};

const sizes = {
  sm: "px-3.5 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
  xl: "px-8 py-4 text-base",
};

export default function Button({ children, variant = "primary", size = "md", icon: Icon, iconRight: IconRight, disabled = false, className = "", ...props }) {
  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 ease-in-out disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={18} strokeWidth={1.5} />}
      {children}
      {IconRight && <IconRight size={18} strokeWidth={1.5} />}
    </button>
  );
}
