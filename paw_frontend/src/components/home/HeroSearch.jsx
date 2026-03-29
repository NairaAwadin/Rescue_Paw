import React, { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import Button from "../ui/Button";

export default function HeroSearch({ onSearch, onStartQuiz }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <div className="bg-beige-50 min-h-screen flex flex-col items-center justify-center px-6">
      {/* Title & Subtitle */}
      <div className="text-center mb-40 max-w-3xl">
        <h1 className="text-6xl md:text-7xl font-extrabold text-taupe-900 mb-8 leading-tight">
          Trouver le compagnon idéal
        </h1>
        <p className="text-xl text-taupe-600 leading-relaxed">
          Découvrez le bien-être animal de votre région et trouvez l'animal qui vous correspond.
        </p>
      </div>
      
      {/* Search & CTA Section */}
      <div className="w-full max-w-md mx-auto space-y-12">
          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative group">
              <input 
                type="text" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                placeholder="Ville ou code postal" 
                className="w-full pl-6 pr-16 py-3.5 bg-white border border-beige-300 rounded-xl text-taupe-900 placeholder:text-taupe-500 text-base focus:outline-none focus:ring-2 focus:ring-canard-500 focus:border-transparent transition-all"
              />
              <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                <Search size={18} strokeWidth={1.5} className="text-canard-600 group-focus-within:text-canard-700 transition-colors" />
              </div>
            </div>
          </form>

          {/* Search Submit Button */}
          <button 
            onClick={() => {
              if (query.trim()) handleSubmit({ preventDefault: () => {} });
            }}
            className="w-full bg-canard-600 hover:bg-canard-700 text-white px-10 py-4 rounded-md font-semibold text-base transition-all duration-200"
          >
            Voir le score de bien-être
          </button>

          {/* OR Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-beige-300"></div>
            <span className="text-xs text-taupe-400 font-semibold">OU</span>
            <div className="flex-1 h-px bg-beige-300"></div>
          </div>

          {/* Quiz CTA Button */}
          <button 
            onClick={onStartQuiz}
            className="w-full bg-ambre-400 hover:bg-ambre-500 text-white px-10 py-4 rounded-md font-semibold text-base transition-all duration-200"
          >
            Lancer le quiz d'adoption
          </button>
        </div>
    </div>
  );
}
