import React, { useState } from "react";
import HeroSearch from "../components/home/HeroSearch";
import MapView from "../components/home/MapView";
import { mockTerritoires } from "../data/mockData";
import { Heart, TrendingUp, Shield, PawPrint, AlertCircle, X } from "lucide-react";
import { api } from "../api/client";

export default function HomePage({ onNavigate }) {
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");

  const handleSearch = async (query) => {
    setSearchError("");
    try {
      const res = await api.getWellbeing(query.length === 5 ? { zip_code: query } : { ville: query });
      setSearchResult(res);
    } catch {
      const found = mockTerritoires.find(t => t.zip_code === query || t.ville.toLowerCase().includes(query.toLowerCase()));
      if (found) setSearchResult(found);
      else { setSearchResult(null); setSearchError("Aucune ville trouvée pour cette recherche."); }
    }
  };

  const features = [
    { icon: Heart, title: "Matching IA", desc: "Notre algorithme trouve le compagnon idéal selon votre mode de vie." },
    { icon: TrendingUp, title: "Score territorial", desc: "Chaque ville reçoit une note de bien-être animal de A à E." },
    { icon: Shield, title: "Données vérifiées", desc: "Sources INSEE et OpenStreetMap pour des analyses fiables." },
  ];

  return (
    <div className="bg-beige-50">
      {/* HERO - min-h-screen centered */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <HeroSearch onSearch={handleSearch} onStartQuiz={() => onNavigate("quiz")} />
      </div>

      {/* SEARCH ERROR - flex centered */}
      {searchError && (
        <div className="flex justify-center px-6 mb-64">
          <div className="max-w-2xl w-full bg-ambre-50 border border-ambre-200 rounded-3xl p-6 flex items-center gap-4">
            <AlertCircle size={20} className="text-ambre-600 shrink-0" />
            <span className="text-base text-ambre-700 font-medium">{searchError}</span>
          </div>
        </div>
      )}

      {/* SEARCH RESULT - padding */}
      {searchResult && (
        <section className="bg-white py-32 px-6 flex flex-col items-center mb-64">
          <div className="max-w-2xl w-full">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-taupe-900">Score de bien-être</h2>
              <button 
                onClick={() => setSearchResult(null)}
                className="text-taupe-400 hover:text-taupe-600 transition-colors"
              >
                <X size={28} />
              </button>
            </div>
            <MapView territoire={searchResult} />
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-72 px-6 bg-white flex flex-col items-center mb-72">
        <div className="max-w-6xl w-full space-y-16">
          <div className="text-center space-y-10">
            <h2 className="text-5xl font-extrabold text-taupe-900 tracking-tight">Pourquoi RescuePaw ?</h2>
            <p className="text-xl text-taupe-600 max-w-3xl mx-auto text-center">Une plateforme pensée pour vous et les animaux</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map(({ icon: Icon, title, desc }) => (
              <article key={title} className="bg-beige-50 rounded-[32px] border border-beige-100 p-12 flex flex-col items-center text-center gap-6 shadow-sm">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <Icon size={28} className="text-canard-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-taupe-900">{title}</h3>
                  <p className="text-base text-taupe-600 leading-relaxed">{desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Cards */}
      <section className="py-720 px-6 bg-beige-50 flex flex-col items-center">
        <div className="max-w-4xl w-full space-y-16400">
          {/* Quiz Card */}
          <article className="bg-white rounded-[36px] border border-beige-100 p-12 flex flex-col md:flex-row md:items-center gap-10 shadow-md00">
            <div className="flex items-start gap-8 flex-1">
              <div className="w-16 h-16 bg-canard-50 rounded-2xl flex items-center justify-center shrink-0">
                <PawPrint size={26} className="text-canard-600" />
              </div>
              <div className="space-y-3 text-left">
                <h3 className="text-2xl font-bold text-taupe-900">Prêt à changer une vie ?</h3>
                <p className="text-base text-taupe-600 leading-relaxed">Trouvez votre compagnon idéal en 2 minutes grâce à un parcours conçu avec nos comportementalistes.</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate("quiz")}
              className="w-full md:w-auto bg-canard-600 hover:bg-canard-700 text-white px-12 py-5 rounded-2xl text-base font-semibold transition-colors"
            >
              Lancer le quiz
            </button>
          </article>

          {/* Signalement Card */}
          <article className="bg-white rounded-[36px] border border-beige-100 p-12 flex flex-col md:flex-row md:items-center gap-10 shadow-md">
            <div className="flex items-start gap-8 flex-1">
              <div className="w-16 h-16 bg-ambre-50 rounded-2xl flex items-center justify-center shrink-0">
                <AlertCircle size={26} className="text-ambre-600" />
              </div>
              <div className="space-y-3 text-left">
                <h3 className="text-2xl font-bold text-taupe-900">Vous avez trouvé un animal ?</h3>
                <p className="text-base text-taupe-600 leading-relaxed">Signalez-le anonymement, nous relayons immédiatement aux structures les plus proches.</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate("signalement")}
              className="w-full md:w-auto bg-ambre-400 hover:bg-ambre-500 text-white px-12 py-5 rounded-2xl text-base font-semibold transition-colors"
            >
              Signaler un animal
            </button>
          </article>
        </div>
      </section>

    </div>
  );
}
