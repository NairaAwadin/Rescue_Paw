import React, { useState, useEffect } from "react";
import { Search, Filter, Dog, Cat, X } from "lucide-react";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { api } from "../api/client";
import { SPECIES_LABELS, SIZE_LABELS, AGE_LABELS } from "../utils/constants";

function AnimalCard({ animal }) {
  const [imgError, setImgError] = useState(false);
  const {
    name,
    species,
    race,
    age,
    age_category,
    taille,
    photo,
    kid_friendly,
    needs_garden,
  } = animal;

  const SpeciesIcon = species === "DOG" ? Dog : Cat;

  const getPlaceholderColor = () => {
    return species === "DOG" ? "bg-canard-100" : "bg-ambre-100";
  };

  return (
    <div className="group bg-white rounded-lg shadow-md border border-beige-200/40 overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
      {/* Image Section */}
      <div className={`relative aspect-[4/3] overflow-hidden ${imgError ? getPlaceholderColor() : "bg-gray-200"}`}>
        {!imgError && photo ? (
          <img
            src={photo}
            alt={name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <SpeciesIcon size={48} strokeWidth={1.5} className="text-taupe-400 opacity-40" />
          </div>
        )}

        {/* Species icon — bottom right */}
        <div className="absolute bottom-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm">
          <SpeciesIcon size={15} strokeWidth={1.5} className="text-taupe-600" />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 pb-5">
        {/* Name + Race */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-taupe-900 leading-tight">{name}</h3>
          <p className="text-sm text-taupe-400 mt-0.5">{race}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <Badge className="bg-beige-100 text-taupe-600">
            {AGE_LABELS[age_category]} · {age} an{age > 1 ? "s" : ""}
          </Badge>
          <Badge className="bg-beige-100 text-taupe-600">{SIZE_LABELS[taille]}</Badge>
          {kid_friendly && (
            <Badge className="bg-canard-50 text-canard-700">Enfants OK</Badge>
          )}
          {!needs_garden && (
            <Badge className="bg-beige-50 text-taupe-500">Appart OK</Badge>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AnimalPage({ onNavigate }) {
  const [animals, setAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filtres
  const [speciesFilter, setSpeciesFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Charger les animaux
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        setLoading(true);
        const data = await api.getAnimals();
        const animalsList = Array.isArray(data) ? data : data.results || [];
        setAnimals(animalsList);
        setFilteredAnimals(animalsList);
      } catch (err) {
        setError("Impossible de charger les animaux");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  // Appliquer les filtres
  useEffect(() => {
    let filtered = animals;

    // Filtre recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (animal) =>
          animal.name.toLowerCase().includes(query) ||
          animal.race.toLowerCase().includes(query)
      );
    }

    // Filtre espèce
    if (speciesFilter) {
      filtered = filtered.filter((animal) => animal.species === speciesFilter);
    }

    // Filtre taille
    if (sizeFilter) {
      filtered = filtered.filter((animal) => animal.taille === sizeFilter);
    }

    // Filtre âge
    if (ageFilter) {
      filtered = filtered.filter((animal) => animal.age_category === ageFilter);
    }

    setFilteredAnimals(filtered);
  }, [animals, searchQuery, speciesFilter, sizeFilter, ageFilter]);

  const resetFilters = () => {
    setSearchQuery("");
    setSpeciesFilter("");
    setSizeFilter("");
    setAgeFilter("");
  };

  const hasActiveFilters = searchQuery || speciesFilter || sizeFilter || ageFilter;

  return (
    <div className="min-h-screen bg-cream pb-16">
      <div style={{ marginTop: "120px" }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-taupe-900 mb-4">
            Nos Animaux
          </h1>
          <p className="text-lg text-taupe-500">
            Découvrez {animals.length} animaux en attente d'adoption
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ marginTop: "80px", marginBottom: "80px" }} className="flex justify-center">
          <div className="relative" style={{ width: "550px" }}>
            <input
              type="text"
              placeholder="Chercher par nom ou race..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-3 bg-white border border-beige-200 rounded-lg text-taupe-900 placeholder-taupe-300 focus:outline-none focus:ring-2 focus:ring-ambre-400 focus:border-transparent transition-all"
            />
            <Search
              className="absolute right-4 top-1/2 -translate-y-1/2 text-taupe-400"
              size={20}
            />
          </div>
        </div>

        {/* Filters Toggle & Reset */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-beige-200 rounded-lg text-taupe-700 hover:bg-beige-50 transition-colors"
          >
            <Filter size={18} />
            <span>Filtres</span>
          </button>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2 bg-beige-100 text-taupe-600 rounded-lg hover:bg-beige-200 transition-colors"
            >
              <X size={18} />
              <span>Réinitialiser</span>
            </button>
          )}

          <span className="text-sm text-taupe-500">
            {filteredAnimals.length} animal{filteredAnimals.length !== 1 ? "x" : ""}
          </span>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="mb-8 bg-white p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Espèce */}
              <div>
                <label className="block text-sm font-semibold text-taupe-900 mb-3">
                  Espèce
                </label>
                <div className="space-y-2">
                  {["DOG", "CAT"].map((species) => (
                    <label key={species} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="species"
                        value={species}
                        checked={speciesFilter === species}
                        onChange={(e) =>
                          setSpeciesFilter(e.target.checked ? species : "")
                        }
                        className="w-4 h-4 text-ambre-400 cursor-pointer"
                      />
                      <span className="text-taupe-700 flex items-center gap-2">
                        {species === "DOG" ? (
                          <Dog size={16} />
                        ) : (
                          <Cat size={16} />
                        )}
                        {SPECIES_LABELS[species]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Taille */}
              <div>
                <label className="block text-sm font-semibold text-taupe-900 mb-3">
                  Taille
                </label>
                <div className="space-y-2">
                  {["S", "M", "L"].map((size) => (
                    <label key={size} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="size"
                        value={size}
                        checked={sizeFilter === size}
                        onChange={(e) =>
                          setSizeFilter(e.target.checked ? size : "")
                        }
                        className="w-4 h-4 text-ambre-400 cursor-pointer"
                      />
                      <span className="text-taupe-700">{SIZE_LABELS[size]}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Âge */}
              <div>
                <label className="block text-sm font-semibold text-taupe-900 mb-3">
                  Catégorie d'âge
                </label>
                <div className="space-y-2">
                  {["puppy", "adult", "senior"].map((age) => (
                    <label key={age} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="age"
                        value={age}
                        checked={ageFilter === age}
                        onChange={(e) =>
                          setAgeFilter(e.target.checked ? age : "")
                        }
                        className="w-4 h-4 text-ambre-400 cursor-pointer"
                      />
                      <span className="text-taupe-700">{AGE_LABELS[age]}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-beige-200 border-t-ambre-400 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-taupe-500">Chargement des animaux...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <p className="text-red-600 font-semibold mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-ambre-400 text-white rounded-lg hover:bg-ambre-500 transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        ) : filteredAnimals.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <p className="text-taupe-500 mb-4">Aucun animal ne correspond à vos critères</p>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 bg-ambre-400 text-white rounded-lg hover:bg-ambre-500 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnimals.map((animal) => (
              <div key={animal.id} className="cursor-pointer">
                <AnimalCard animal={animal} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
