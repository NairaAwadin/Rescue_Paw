import React, { useState } from "react";
import { Heart, MapPin, ArrowRight, Dog, Cat } from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { getMatchColor, getMatchLabel, AGE_LABELS, SIZE_LABELS } from "../../utils/constants";

export default function AnimalCard({ animal, onSelect }) {
  const [liked, setLiked] = useState(false);
  const { name, species, race, age, age_category, taille, match_score, photo, refuge_name, kid_friendly, needs_garden } = animal;
  const matchColor = getMatchColor(match_score);
  const SpeciesIcon = species === "DOG" ? Dog : Cat;

  return (
    <Card hover padding="p-0" className="group overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={photo} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute top-3 left-3">
          <Badge className={`${matchColor} backdrop-blur-sm shadow-sm`}>{match_score}% — {getMatchLabel(match_score)}</Badge>
        </div>
        <button onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${liked ? "bg-ambre-400 text-white shadow-md" : "bg-white/80 backdrop-blur-sm text-taupe-400 hover:text-ambre-400 shadow-sm"}`}>
          <Heart size={16} strokeWidth={1.5} fill={liked ? "currentColor" : "none"} />
        </button>
        <div className="absolute bottom-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
          <SpeciesIcon size={16} strokeWidth={1.5} className="text-taupe-600" />
        </div>
      </div>
      <div className="p-6">
        <div className="mb-4"><h3 className="text-lg font-bold text-taupe-900">{name}</h3><p className="text-sm text-taupe-400">{race}</p></div>
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge className="bg-beige-100 text-taupe-600">{AGE_LABELS[age_category]} · {age} ans</Badge>
          <Badge className="bg-beige-100 text-taupe-600">{SIZE_LABELS[taille]}</Badge>
          {kid_friendly && <Badge className="bg-canard-50 text-canard-700">Enfants OK</Badge>}
          {!needs_garden && <Badge className="bg-beige-50 text-taupe-700">Appart OK</Badge>}
        </div>
        <div className="flex items-center gap-2 text-xs text-taupe-400 mb-6"><MapPin size={12} strokeWidth={1.5} />{refuge_name}</div>
        <button onClick={() => onSelect(animal)}
          className="w-full flex items-center justify-center gap-2 bg-canard-50 text-canard-700 hover:bg-canard-100 rounded-xl py-3 px-4 text-sm font-semibold transition-all duration-200 cursor-pointer group-hover:bg-canard-600 group-hover:text-white">
          Découvrir son histoire <ArrowRight size={16} strokeWidth={1.5} />
        </button>
      </div>
    </Card>
  );
}
