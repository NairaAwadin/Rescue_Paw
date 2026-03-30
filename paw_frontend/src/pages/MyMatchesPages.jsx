import React, { useState, useEffect } from "react";
import { ArrowLeft, PawPrint, AlertCircle } from "lucide-react";
import AnimalCard from "../components/matching/AnimalCard";
import AnimalProfile from "../components/matching/AnimalProfile";
import { api } from "../api/client";

export default function MyMatchesPage({ onExit, onNavigate }) {
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [matchs, setMatchs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getMatching()
      .then(data => {
        setMatchs(data.matchs || []);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError("Impossible de charger les matchs. " + err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (selectedAnimal) {
    return (
      <AnimalProfile
        animal={selectedAnimal}
        onBack={() => setSelectedAnimal(null)}
        onLoginRequired={onNavigate}
      />
    );
  }

  return (
    <div className="min-h-screen bg-beige-50 pb-16">
      <div style={{ marginTop: "120px" }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onExit}
          className="flex items-center gap-2 text-sm font-medium text-taupe-500 hover:text-taupe-800 mb-12"
        >
          <ArrowLeft size={18} />
          Retour à l'accueil
        </button>

        <div style={{ marginBottom: "60px" }} className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-taupe-900 mb-4">Mes Matchs</h1>
          <p className="text-lg text-taupe-500">
            {matchs.length} animal{matchs.length > 1 ? "x" : ""} correspond{matchs.length > 1 ? "ent" : ""} à votre profil
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <p className="text-taupe-500">Chargement des matchs...</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle size={20} className="text-red-600" />
            <p className="text-red-600">{error}</p>
          </div>
        ) : matchs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {matchs.map((m) => (
                <AnimalCard
                key={m.animal.id}
                animal={{ ...m.animal, match_score: m.score }}
                onSelect={setSelectedAnimal}
  />
))}
            
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-beige-100 rounded-2xl flex items-center justify-center mb-5">
              <PawPrint size={28} className="text-taupe-400" />
            </div>
            <h3 className="text-lg font-bold text-taupe-900 mb-2">
              Aucun match trouvé
            </h3>
            <p className="text-sm text-taupe-400">
              Complétez le quiz pour voir les animaux compatibles
            </p>
          </div>
        )}
      </div>
    </div>
  );
}