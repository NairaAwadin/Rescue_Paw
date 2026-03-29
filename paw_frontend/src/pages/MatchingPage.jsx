import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  SlidersHorizontal,
  Dog,
  Cat,
  RotateCcw,
  Sparkles,
  PawPrint,
} from "lucide-react";
import AnimalCard from "../components/matching/AnimalCard";
import AnimalProfile from "../components/matching/AnimalProfile";
import Button from "../components/ui/Button";
import { mockAnimals } from "../data/mockData";

export default function MatchingPage({
  answers,
  onRestart,
  onExit,
  onLoginRequired,
}) {
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [speciesFilter, setSpeciesFilter] = useState("ALL");

  // In production: api.getMatching() → ranked animals from ML model
  // For now: mock data sorted by match_score
  const sortedAnimals = useMemo(() => {
    let filtered = [...mockAnimals];

    if (speciesFilter !== "ALL") {
      filtered = filtered.filter((a) => a.species === speciesFilter);
    }

    return filtered.sort((a, b) => b.match_score - a.match_score);
  }, [speciesFilter, answers]);

  // ── Detail view ──
  if (selectedAnimal) {
    return (
      <AnimalProfile
        animal={selectedAnimal}
        onBack={() => setSelectedAnimal(null)}
        onLoginRequired={onLoginRequired}
      />
    );
  }

  const filterOptions = [
    { value: "ALL", label: "Tous", icon: SlidersHorizontal },
    { value: "DOG", label: "Chiens", icon: Dog },
    { value: "CAT", label: "Chats", icon: Cat },
  ];

  return (
    <div className="min-h-screen bg-beige-50 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <div className="mb-10">
          <button
            onClick={onExit}
            className="flex items-center gap-2 text-sm font-medium text-taupe-500 hover:text-taupe-800 transition-colors duration-200 mb-5 cursor-pointer"
          >
            <ArrowLeft size={18} strokeWidth={1.5} />
            Retour à l'accueil
          </button>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            {/* Title */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-canard-50 rounded-xl flex items-center justify-center">
                  <Sparkles
                    size={20}
                    strokeWidth={1.5}
                    className="text-canard-600"
                  />
                </div>
                <h1 className="text-3xl font-extrabold text-taupe-900">
                  Vos compagnons compatibles
                </h1>
              </div>
              <p className="text-taupe-500 ml-[52px]">
                {sortedAnimals.length} animal{sortedAnimals.length > 1 ? "x" : ""}{" "}
                correspond{sortedAnimals.length > 1 ? "ent" : ""} à votre profil
              </p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-1.5 bg-white border border-beige-200/60 rounded-2xl p-1 shadow-[var(--shadow-card)]">
              {filterOptions.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setSpeciesFilter(value)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    speciesFilter === value
                      ? "bg-canard-600 text-white shadow-sm"
                      : "text-taupe-500 hover:text-taupe-700 hover:bg-beige-50"
                  }`}
                >
                  <Icon size={15} strokeWidth={1.5} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Results Grid ── */}
        {sortedAnimals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedAnimals.map((animal) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                onSelect={setSelectedAnimal}
              />
            ))}
          </div>
        ) : (
          /* ── Empty State ── */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-beige-100 rounded-2xl flex items-center justify-center mb-5">
              <PawPrint
                size={28}
                strokeWidth={1.5}
                className="text-taupe-400"
              />
            </div>
            <h3 className="text-lg font-bold text-taupe-900 mb-2">
              Aucun animal pour ce filtre
            </h3>
            <p className="text-sm text-taupe-400 max-w-sm mb-6">
              Essayez d'élargir vos critères pour découvrir plus de compagnons
              en attente d'une famille.
            </p>
            <Button
              variant="outline"
              icon={RotateCcw}
              onClick={() => setSpeciesFilter("ALL")}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}

        {/* ── Footer action ── */}
        <div className="flex items-center justify-center mt-14">
          <button
            onClick={onRestart}
            className="flex items-center gap-2 text-sm font-medium text-taupe-400 hover:text-taupe-600 transition-colors duration-200 cursor-pointer"
          >
            <RotateCcw size={15} strokeWidth={1.5} />
            Refaire le quiz
          </button>
        </div>
      </div>
    </div>
  );
}