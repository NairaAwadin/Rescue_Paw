import React, { useState } from "react";
import { Search } from "lucide-react";

export default function HeroSearch({ onSearch, onStartQuiz }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <section className="bg-beige-50 pt-48 pb-40 px-6 sm:px-8 lg:px-12 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-3xl text-center">
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-taupe-900 mb-8 leading-[1.2] tracking-tight w-full">
          Trouver le compagnon{" "}
          <span className="text-canard-600">idéal</span>
        </h1>
        <p className="text-sm sm:text-base text-taupe-500 leading-relaxed max-w-3xl mx-auto">
          Découvrez le bien-être animal de votre région et trouvez l'animal qui vous correspond
        </p>
        <div className="h-8"></div>

        {/* Search + Buttons */}
        <div className="flex flex-col items-center justify-center w-full space-y-5">
          <div className="w-full max-w-sm">
            {/* Search input */}
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ville ou code postal"
                  className="w-full pl-5 pr-12 py-4 bg-white border border-beige-300 rounded-2xl text-taupe-900 placeholder:text-taupe-400 text-base focus:outline-none focus:ring-2 focus:ring-canard-400 focus:border-transparent transition-all shadow-sm"
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

            <div className="h-4"></div>

            {/* Primary CTA — Search */}
            <button
              onClick={() => {
                if (query.trim()) onSearch(query.trim());
              }}
              className="w-full bg-canard-600 hover:bg-canard-700 text-white py-4 rounded-2xl font-semibold text-base transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
            >
              Voir le score de bien-être
            </button>

            <div className="h-6"></div>

            {/* Divider */}
            <div className="flex items-center gap-4 py-4">
              <div className="flex-1 h-px bg-beige-300" />
              <span className="text-[11px] text-taupe-400 font-semibold uppercase tracking-wider">
                ou
              </span>
              <div className="flex-1 h-px bg-beige-300" />
            </div>

            <div className="h-6"></div>

            {/* Secondary CTA — Quiz */}
            <button
              onClick={onStartQuiz}
              className="w-full bg-ambre-400 hover:bg-ambre-500 text-white py-4 rounded-2xl font-semibold text-base transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
            >
              Lancer le quiz d'adoption
            </button>
            <div className="h-16"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
