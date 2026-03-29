import React from "react";
import { ArrowLeft, MapPin, Dog, Cat, Zap, Users, Baby, TreePine, Mail } from "lucide-react";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import Card from "../ui/Card";
import { getMatchColor, getMatchLabel, SPECIES_LABELS, SIZE_LABELS, AGE_LABELS } from "../../utils/constants";
import { useAuth } from "../../context/AuthContext";

export default function AnimalProfile({ animal, onBack, onLoginRequired }) {
  if (!animal) return null;
  const { isLoggedIn } = useAuth();
  const { name, species, race, age, age_category, taille, energy_need, social_compatibility, kid_friendly, needs_garden, description, match_score, photo, refuge_name } = animal;
  const SpeciesIcon = species === "DOG" ? Dog : Cat;
  const matchColor = getMatchColor(match_score);

  const traits = [
    { icon: Zap, label: "Énergie", value: energy_need > 6 ? "Élevée" : energy_need > 3 ? "Modérée" : "Calme" },
    { icon: Users, label: "Sociabilité", value: social_compatibility ? "Sociable" : "Indépendant" },
    { icon: Baby, label: "Enfants", value: kid_friendly ? "Compatible" : "Adultes uniquement" },
    { icon: TreePine, label: "Jardin", value: needs_garden ? "Recommandé" : "Non requis" },
  ];

  return (
    <div className="min-h-screen bg-beige-50 pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-taupe-600 hover:text-taupe-900 transition-colors mb-12 cursor-pointer">
          <ArrowLeft size={18} strokeWidth={1.5} /> Retour aux résultats
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="rounded-[var(--radius-bento)] overflow-hidden shadow-[var(--shadow-card)]">
              <img src={photo} alt={name} className="w-full aspect-[4/3] object-cover" />
            </div>
          </div>
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card padding="p-8">
              <div className="flex items-start justify-between mb-6">
                <div><h1 className="text-2xl font-bold text-taupe-900">{name}</h1><p className="text-taupe-400 mt-0.5">{race} · {SPECIES_LABELS[species]}</p></div>
                <div className="w-10 h-10 bg-canard-50 rounded-xl flex items-center justify-center"><SpeciesIcon size={22} strokeWidth={1.5} className="text-canard-600" /></div>
              </div>
              <div className="flex flex-wrap gap-3 mb-8">
                <Badge className="bg-beige-100 text-taupe-600">{AGE_LABELS[age_category]} · {age} ans</Badge>
                <Badge className="bg-beige-100 text-taupe-600">Taille {SIZE_LABELS[taille]}</Badge>
              </div>
              {match_score && (
                <div className={`${matchColor} rounded-xl px-6 py-4 text-center`}>
                  <p className="text-2xl font-bold">{match_score}%</p>
                  <p className="text-xs font-medium opacity-80">{getMatchLabel(match_score)}</p>
                </div>
              )}
            </Card>
            <Card padding="p-8">
              <h3 className="text-sm font-semibold text-taupe-400 uppercase tracking-wider mb-8">Caractéristiques</h3>
              <div className="space-y-4">
                {traits.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3"><Icon size={16} strokeWidth={1.5} className="text-taupe-500" /><span className="text-sm text-taupe-600">{label}</span></div>
                    <span className="text-sm font-semibold text-taupe-900">{value}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card padding="p-8">
              <div className="flex items-center gap-3 mb-6"><MapPin size={16} strokeWidth={1.5} className="text-ambre-400" /><span className="text-sm font-semibold text-taupe-900">{refuge_name}</span></div>
              {isLoggedIn ? (
                <Button variant="secondary" size="md" icon={Mail} className="w-full">Contacter le refuge</Button>
              ) : (
                <Button variant="outline" size="md" className="w-full" onClick={onLoginRequired}>Connectez-vous pour contacter le refuge</Button>
              )}
            </Card>
          </div>
        </div>
        <Card className="mt-12" padding="p-8">
          <h3 className="text-sm font-semibold text-taupe-400 uppercase tracking-wider mb-6">Son histoire</h3>
          <p className="text-taupe-900 leading-relaxed">{description}</p>
        </Card>
      </div>
    </div>
  );
}
