import React from "react";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-beige-200 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <img src="/logo.png" alt="RescuePaw" className="h-12 w-auto" />
          <p className="text-xs text-taupe-400 flex items-center gap-1">
            © 2026 · Fait avec <Heart size={12} className="text-ambre-400" /> pour le bien-être animal
          </p>
        </div>
      </div>
    </footer>
  );
}
