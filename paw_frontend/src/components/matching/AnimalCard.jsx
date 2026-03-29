import React, { useState } from "react";
import { Heart, MapPin, ArrowRight, Dog, Cat, Sparkles } from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { getMatchColor, getMatchLabel, AGE_LABELS, SIZE_LABELS } from "../../utils/constants";

export default function AnimalCard({ animal, onSelect }) {
  const [liked, setLiked] = useState(false);
  const {
    name,
    species,
    race,
    age,
    age_category,
    taille,
    match_score,
    photo,
    refuge_name,
    kid_friendly,
    needs_garden,
  } = animal;

  const matchColor = getMatchColor(match_score);
  const SpeciesIcon = species === "DOG" ? Dog : Cat;

  return (
    <div
      className="group bg-white rounded-[var(--radius-bento)] shadow-[var(--shadow-card)] border border-beige-200/40 overflow-hidden transition-all duration-300 ease-in-out hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1"
    >
      {/* ── Image Section ── */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={photo}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Match score badge — top left */}
        <div className="absolute top-3 left-3">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-sm ${matchColor}`}>
            <Sparkles size={11} strokeWidth={2.5} />
            <span>{match_score}%</span>
            <span className="hidden sm:inline">— {getMatchLabel(match_score)}</span>
          </div>
        </div>

        {/* Like button — top right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer ${
            liked
              ? "bg-ambre-400 text-white shadow-md scale-110"
              : "bg-white/70 backdrop-blur-md text-taupe-400 hover:text-ambre-500 hover:bg-white/90 shadow-sm"
          }`}
          aria-label={liked ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart
            size={15}
            strokeWidth={1.5}
            fill={liked ? "currentColor" : "none"}
            className={liked ? "animate-[pulse_0.3s_ease-in-out]" : ""}
          />
        </button>

        {/* Species icon — bottom right */}
        <div className="absolute bottom-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm">
          <SpeciesIcon size={15} strokeWidth={1.5} className="text-taupe-600" />
        </div>
      </div>

      {/* ── Content Section ── */}
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

        {/* Refuge */}
        <div className="flex items-center gap-1.5 text-xs text-taupe-400 mb-4">
          <MapPin size={12} strokeWidth={1.5} />
          <span>{refuge_name}</span>
        </div>

        {/* CTA */}
        <button
          onClick={() => onSelect(animal)}
          className="w-full flex items-center justify-center gap-2 bg-canard-50 text-canard-700 rounded-xl py-2.5 text-sm font-semibold transition-all duration-300 ease-in-out cursor-pointer group-hover:bg-canard-600 group-hover:text-white"
        >
          Découvrir son histoire
          <ArrowRight
            size={15}
            strokeWidth={1.5}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </button>
      </div>
    </div>
  );
}