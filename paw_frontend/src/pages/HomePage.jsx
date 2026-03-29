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
        setSearchError("Aucune ville trouvée pour cette recherche.");
      }
    }
  };

  const features = [
    {
      icon: Sparkles,
      title: "Matching IA",
      desc: "Notre algorithme trouve le compagnon idéal selon votre mode de vie.",
    },
    {
      icon: TrendingUp,
      title: "Score territorial",
      desc: "Chaque ville reçoit une note de bien-être animal de A à E.",
    },
    {
      icon: Shield,
      title: "Données vérifiées",
      desc: "Sources INSEE et OpenStreetMap pour des analyses fiables.",
    },
  ];

  return (
    <div className="min-h-screen bg-beige-50">
      {/* ── Hero ── */}
      <HeroSearch onSearch={handleSearch} onStartQuiz={() => onNavigate("quiz")} />

      {/* ── Search Error ── */}
      {searchError && (
        <div className="max-w-2xl mx-auto px-6 -mt-6 mb-8">
          <div className="bg-ambre-50 border border-ambre-200 rounded-2xl px-5 py-4 flex items-center gap-3">
            <AlertCircle size={18} className="text-ambre-600 shrink-0" />
            <span className="text-sm text-ambre-700 font-medium">
              {searchError}
            </span>
          </div>
        </div>
      )}

      {/* ── Search Result (Map) ── */}
      {searchResult && (
        <section className="bg-white py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-taupe-900">
                Score de bien-être
              </h2>
              <button
                onClick={() => setSearchResult(null)}
                className="w-8 h-8 rounded-lg hover:bg-beige-100 flex items-center justify-center text-taupe-400 hover:text-taupe-600 transition-colors cursor-pointer"
              >
                <XIcon size={18} strokeWidth={1.5} />
              </button>
            </div>
            <MapView territoire={searchResult} />
          </div>
        </section>
      )}

      {/* ── Features Section ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-taupe-900 mb-3">
              Pourquoi RescuePaw ?
            </h2>
            <p className="text-base text-taupe-500">
              Une plateforme pensée pour vous et les animaux
            </p>
          </div>

          {/* Features grid — centered */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-canard-50 rounded-2xl flex items-center justify-center mb-5 transition-colors hover:bg-canard-100">
                  <Icon
                    size={26}
                    strokeWidth={1.5}
                    className="text-canard-600"
                  />
                </div>
                <h3 className="text-base font-bold text-taupe-900 mb-2">
                  {title}
                </h3>
                <p className="text-sm text-taupe-500 leading-relaxed max-w-xs">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA: Adoption Quiz ── */}
      <section className="px-6 pb-6">
        <div className="max-w-4xl mx-auto">
          <Card padding="p-6 sm:p-8" className="bg-canard-600 border-canard-600">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
                <PawPrint size={24} strokeWidth={1.5} className="text-white" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-white mb-1">
                  Prêt à changer une vie ?
                </h3>
                <p className="text-sm text-white/70">
                  Trouvez votre compagnon idéal en 2 minutes
                </p>
              </div>
              <button
                onClick={() => onNavigate("quiz")}
                className="shrink-0 bg-ambre-400 hover:bg-ambre-500 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
              >
                Lancer le quiz
                <ArrowRight size={16} strokeWidth={1.5} />
              </button>
            </div>
          </Card>
        </div>
      </section>

      {/* ── CTA: Signalement ── */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <Card padding="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-12 h-12 bg-ambre-50 rounded-xl flex items-center justify-center shrink-0">
                <AlertCircle
                  size={22}
                  strokeWidth={1.5}
                  className="text-ambre-500"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-taupe-900 mb-1">
                  Vous avez trouvé un animal ?
                </h3>
                <p className="text-sm text-taupe-500">
                  Signalez-le anonymement et aidez-le rapidement
                </p>
              </div>
              <button
                onClick={() => onNavigate("signalement")}
                className="shrink-0 bg-white border border-beige-300 hover:bg-beige-50 text-taupe-800 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                Signaler
                <ArrowRight size={16} strokeWidth={1.5} />
              </button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}