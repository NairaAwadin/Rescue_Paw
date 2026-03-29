import React, { useState } from "react";
import { Heart, PawPrint } from "lucide-react";

export default function Footer() {
  const [imgError, setImgError] = useState(false);

  return (
    <footer className="bg-white border-t border-beige-200/40 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo with fallback */}
          <div className="flex items-center gap-2">
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

          <p className="text-xs text-taupe-400 flex items-center gap-1">
            Projet PFE — Fait avec{" "}
            <Heart size={12} strokeWidth={2} className="text-ambre-400" /> pour
            le bien-être animal
          </p>
        </div>
      </div>
    </footer>
  );
}