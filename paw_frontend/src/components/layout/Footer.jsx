import React, { useState } from "react";
import { Heart, PawPrint } from "lucide-react";

export default function Footer() {
  const [imgError, setImgError] = useState(false);

  return (
    <footer className="bg-white border-t border-beige-200/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            {imgError ? (
              <>
                <div className="w-8 h-8 bg-canard-600 rounded-lg flex items-center justify-center">
                  <PawPrint size={16} strokeWidth={1.5} className="text-white" />
                </div>
                <span className="text-sm font-bold text-taupe-900">
                  Rescue<span className="text-canard-600">Paw</span>
                </span>
              </>
            ) : (
              <img
                src="/logo.png"
                alt="RescuePaw"
                className="h-10 w-auto"
                onError={() => setImgError(true)}
              />
            )}
          </div>

          {/* Centered text */}
          <div className="flex items-center justify-center flex-1">
            <p className="text-sm text-taupe-700 flex items-center justify-center gap-1 flex-wrap">
              © PFE 2026 — Fait avec{" "}
              <Heart size={14} strokeWidth={2} className="text-ambre-400" />{" "}
              pour le bien-être animal
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}