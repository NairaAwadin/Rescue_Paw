import React, { useState } from "react";
import { Search } from "lucide-react";

export default function HeroSearch({ onSearch, onStartQuiz }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <section className="bg-beige-50 pt-32 pb-20 px-6">
      <div className="max-w-xl mx-auto text-center">
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-taupe-900 mb-5 leading-[1.1] tracking-tight">
          Trouver le compagnon{" "}
          <span className="text-canard-600">idéal</span>
        </h1>
        <p className="text-base sm:text-lg text-taupe-500 leading-relaxed mb-10 max-w-md mx-auto">
          Découvrez le bien-être animal de votre région et trouvez l'animal qui
          vous correspond.
        </p>

        {/* Search + Buttons */}
        <div className="w-full max-w-sm mx-auto space-y-4">
          {/* Search input */}
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ville ou code postal"
                className="w-full pl-5 pr-12 py-3.5 bg-white border border-beige-300 rounded-2xl text-taupe-900 placeholder:text-taupe-400 text-base focus:outline-none focus:ring-2 focus:ring-canard-400 focus:border-transparent transition-all shadow-sm"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer"
              >
                <Search
                  size={18}
                  strokeWidth={1.5}
                  className="text-taupe-400 hover:text-canard-600 transition-colors"
                />
              </button>
            </div>
          </form>

          {/* Primary CTA — Search */}
          <button
            onClick={() => {
              if (query.trim()) onSearch(query.trim());
            }}
            className="w-full bg-canard-600 hover:bg-canard-700 text-white py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
          >
            Voir le score de bien-être
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 py-1">
            <div className="flex-1 h-px bg-beige-300" />
            <span className="text-[11px] text-taupe-400 font-semibold uppercase tracking-wider">
              ou
            </span>
            <div className="flex-1 h-px bg-beige-300" />
          </div>

          {/* Secondary CTA — Quiz */}
          <button
            onClick={onStartQuiz}
            className="w-full bg-ambre-400 hover:bg-ambre-500 text-white py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
          >
            Lancer le quiz d'adoption
          </button>
        </div>
      </div>
    </section>
  );
}