import React, { useState } from "react";
import HeroSearch from "../components/home/HeroSearch";
import MapView from "../components/home/MapView";
import Card from "../components/ui/Card";
import { mockTerritoires } from "../data/mockData";
import {
  Sparkles,
  TrendingUp,
  Shield,
  PawPrint,
  AlertCircle,
  ArrowRight,
  X as XIcon,
} from "lucide-react";
import { api } from "../api/client";

export default function HomePage({ onNavigate }) {
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");

  const handleSearch = async (query) => {
    setSearchError("");
    try {
      const res = await api.getWellbeing(
        query.length === 5 ? { zip_code: query } : { ville: query }
      );
      setSearchResult(res);
    } catch {
      const found = mockTerritoires.find(
        (t) =>
          t.zip_code === query ||
          t.ville.toLowerCase().includes(query.toLowerCase())
      );
      if (found) setSearchResult(found);
      else {
        setSearchResult(null);
        setSearchError("Aucune ville trouvée pour cette recherche");
      }
    }
  };

  const features = [
    {
      icon: Sparkles,
      title: "Matching IA",
      desc: "Notre algorithme trouve le compagnon idéal selon votre mode de vie",
    },
    {
      icon: TrendingUp,
      title: "Score territorial",
      desc: "Chaque ville reçoit une note de bien-être animal de A à E",
    },
    {
      icon: Shield,
      title: "Données vérifiées",
      desc: "Sources INSEE et OpenStreetMap pour des analyses fiables",
    },
  ];

  return (
    <div className="min-h-screen bg-beige-50">
      {/* ── Hero ── */}
      <HeroSearch onSearch={handleSearch} onStartQuiz={() => onNavigate("quiz")} />

      {/* ── Search Error ── */}
      {searchError && (
        <div className="max-w-4xl mx-auto px-6 -mt-8 mb-12">
          <div className="bg-ambre-50 border border-ambre-200 rounded-2xl px-6 py-4 flex items-center gap-3">
            <AlertCircle size={18} className="text-ambre-600 shrink-0" />
            <span className="text-sm text-ambre-700 font-medium">
              {searchError}
            </span>
          </div>
        </div>
      )}

      {/* ── Search Result (Map) ── */}
      {searchResult && (
        <section className="bg-white py-20 px-6 sm:px-8 border-t border-beige-200 flex justify-center">
          <div className="w-full max-w-5xl">
            <div className="flex items-center justify-center mb-12 relative">
              <h2 className="text-3xl font-bold text-taupe-900">
                Score de bien-être
              </h2>
              <button
                onClick={() => setSearchResult(null)}
                className="absolute right-0 w-10 h-10 rounded-lg hover:bg-beige-100 flex items-center justify-center text-taupe-400 hover:text-taupe-600 transition-colors cursor-pointer"
              >
                <XIcon size={20} strokeWidth={1.5} />
              </button>
            </div>
            <MapView territoire={searchResult} />
          </div>
        </section>
      )}

      {/* ── Features Section ── */}
      <section className="py-32 px-6 sm:px-8 bg-white border-t border-beige-200 flex justify-center">
        <div className="w-full max-w-6xl">
          {/* Section header */}
          <div className="text-center mb-40">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-taupe-900 mb-6 leading-tight">
              Pourquoi RescuePaw ?
            </h2>
            <p className="text-lg text-taupe-500 mx-auto leading-relaxed">
              Une plateforme pensée pour vous et les animaux
            </p>
          </div>

          <div className="h-12"></div>

          {/* Features grid — centered */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full px-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-canard-50 rounded-3xl flex items-center justify-center mb-8 transition-all duration-300 group-hover:bg-canard-100 group-hover:scale-110 group-hover:shadow-lg">
                  <Icon
                    size={32}
                    strokeWidth={1.5}
                    className="text-canard-600"
                  />
                </div>
                <h3 className="text-xl font-bold text-taupe-900 mb-4 leading-tight">
                  {title}
                </h3>
                <p className="text-base text-taupe-500 leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Space between sections */}
      <div className="h-16"></div>

      {/* ── CTA: Adoption Quiz ── */}
      <section className="px-6 sm:px-8 py-20 flex justify-center">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full px-4">
          {/* Adoption Card */}
          <div className="bg-canard-600 rounded-3xl p-8 sm:p-10 flex flex-col justify-center items-center text-center transition-all hover:shadow-lg">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <PawPrint size={32} strokeWidth={1.5} className="text-white" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
              Prêt à changer une vie ?
            </h3>
            <p className="text-white/80 leading-relaxed max-w-sm">
              Trouvez votre compagnon idéal en 2 minutes grâce à notre quiz d'adoption intelligent
            </p>
            <div className="h-4"></div>
            <button
              onClick={() => onNavigate("quiz")}
              className="bg-ambre-400 hover:bg-ambre-500 text-white px-8 py-4 rounded-lg text-base font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg mt-8"
            >
              Lancer le quiz
              <ArrowRight size={18} strokeWidth={1.5} />
            </button>
            <div className="h-6"></div>
          </div>

          {/* Signalement Card */}
          <div className="bg-white border-2 border-beige-200 rounded-3xl p-8 sm:p-10 flex flex-col justify-center items-center text-center transition-all hover:shadow-lg hover:border-canard-300">
            <div className="w-16 h-16 bg-ambre-50 rounded-2xl flex items-center justify-center mb-6">
              <AlertCircle size={32} strokeWidth={1.5} className="text-ambre-500" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-taupe-900 mb-3 leading-tight">
              Vous avez trouvé un animal ?
            </h3>
            <p className="text-taupe-600 leading-relaxed max-w-sm">
              Signalez-le anonymement et aidez-le rapidement en le mettant en contact avec les bons refuges
            </p>
            <div className="h-4"></div>
            <button
              onClick={() => onNavigate("signalement")}
              className="bg-canard-600 hover:bg-canard-700 text-white px-8 py-4 rounded-lg text-base font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg mt-8"
            >
              Signaler
              <ArrowRight size={18} strokeWidth={1.5} />
            </button>
            <div className="h-6"></div>
          </div>
        </div>
        </div>
      </section>

      <div className="h-16"></div>
    </div>
  );
}