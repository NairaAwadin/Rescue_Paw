import React from "react";
import {
  ArrowLeft,
  MapPin,
  Dog,
  Cat,
  Zap,
  Users,
  Baby,
  TreePine,
  Mail,
  Heart,
  Sparkles,
} from "lucide-react";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import Card from "../ui/Card";
import {
  getMatchColor,
  getMatchLabel,
  SPECIES_LABELS,
  SIZE_LABELS,
  AGE_LABELS,
} from "../../utils/constants";
import { useAuth } from "../../context/AuthContext";

export default function AnimalProfile({ animal, onBack, onLoginRequired }) {
  if (!animal) return null;
  const { isLoggedIn } = useAuth();

  const {
    name,
    species,
    race,
    age,
    age_category,
    taille,
    energy_need,
    social_compatibility,
    kid_friendly,
    needs_garden,
    description,
    match_score,
    photo,
    refuge_name,
  } = animal;

  const SpeciesIcon = species === "DOG" ? Dog : Cat;
  const matchColor = getMatchColor(match_score);

  const traits = [
    {
      icon: Zap,
      label: "Énergie",
      value:
        energy_need > 6 ? "Élevée" : energy_need > 3 ? "Modérée" : "Calme",
      color:
        energy_need > 6
          ? "text-ambre-600"
          : energy_need > 3
          ? "text-canard-600"
          : "text-taupe-500",
    },
    {
      icon: Users,
      label: "Sociabilité",
      value: social_compatibility ? "Sociable" : "Indépendant",
      color: social_compatibility ? "text-canard-600" : "text-taupe-500",
    },
    {
      icon: Baby,
      label: "Enfants",
      value: kid_friendly ? "Compatible" : "Adultes uniquement",
      color: kid_friendly ? "text-canard-600" : "text-ambre-600",
    },
    {
      icon: TreePine,
      label: "Jardin",
      value: needs_garden ? "Recommandé" : "Non requis",
      color: needs_garden ? "text-ambre-600" : "text-canard-600",
    },
  ];

  return (
    <div className="min-h-screen bg-beige-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-taupe-500 hover:text-taupe-800 transition-colors duration-200 mb-6 cursor-pointer"
        >
          <ArrowLeft size={18} strokeWidth={1.5} />
          Retour aux résultats
        </button>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Photo Column */}
          <div className="lg:col-span-3">
            <div className="relative rounded-[var(--radius-bento)] overflow-hidden shadow-[var(--shadow-bento)]">
              <img
                src={photo}
                alt={name}
                className="w-full aspect-[4/3] object-cover"
              />
              {/* Subtle gradient for immersion */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
            </div>
          </div>

          {/* Info Column */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Identity Card */}
            <Card padding="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-taupe-900 leading-tight">
                    {name}
                  </h1>
                  <p className="text-taupe-400 mt-1 text-sm">
                    {race} · {SPECIES_LABELS[species]}
                  </p>
                </div>
                <div className="w-11 h-11 bg-canard-50 rounded-xl flex items-center justify-center shrink-0">
                  <SpeciesIcon
                    size={22}
                    strokeWidth={1.5}
                    className="text-canard-600"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                <Badge className="bg-beige-100 text-taupe-600">
                  {AGE_LABELS[age_category]} · {age} an{age > 1 ? "s" : ""}
                </Badge>
                <Badge className="bg-beige-100 text-taupe-600">
                  Taille {SIZE_LABELS[taille]}
                </Badge>
              </div>

              {/* Match Score — Hero element */}
              {match_score && (
                <div
                  className={`${matchColor} rounded-2xl px-5 py-4 text-center`}
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Sparkles size={16} strokeWidth={2} />
                    <span className="text-3xl font-extrabold">{match_score}%</span>
                  </div>
                  <p className="text-xs font-semibold opacity-75">
                    {getMatchLabel(match_score)}
                  </p>
                </div>
              )}
            </Card>

            {/* Traits Card */}
            <Card padding="p-6">
              <h3 className="text-xs font-bold text-taupe-400 uppercase tracking-widest mb-4">
                Caractéristiques
              </h3>
              <div className="space-y-3.5">
                {traits.map(({ icon: Icon, label, value, color }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-beige-50 rounded-lg flex items-center justify-center">
                        <Icon
                          size={15}
                          strokeWidth={1.5}
                          className="text-taupe-500"
                        />
                      </div>
                      <span className="text-sm text-taupe-600">{label}</span>
                    </div>
                    <span className={`text-sm font-bold ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Refuge + Contact Card */}
            <Card padding="p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-ambre-50 rounded-lg flex items-center justify-center">
                  <MapPin
                    size={15}
                    strokeWidth={1.5}
                    className="text-ambre-500"
                  />
                </div>
                <span className="text-sm font-bold text-taupe-900">
                  {refuge_name}
                </span>
              </div>
              {isLoggedIn ? (
                <Button
                  variant="secondary"
                  size="md"
                  icon={Mail}
                  className="w-full"
                >
                  Contacter le refuge
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="md"
                  className="w-full"
                  onClick={onLoginRequired}
                >
                  Connectez-vous pour contacter le refuge
                </Button>
              )}
            </Card>
          </div>
        </div>

        {/* ── Story Section ── */}
        <Card className="mt-5" padding="p-0">
          <div className="p-6 pb-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-canard-50 rounded-lg flex items-center justify-center">
                <Heart size={15} strokeWidth={1.5} className="text-canard-600" />
              </div>
              <h3 className="text-xs font-bold text-taupe-400 uppercase tracking-widest">
                Son histoire
              </h3>
            </div>
          </div>
          <div className="px-6 pb-6">
            <p className="text-taupe-800 leading-relaxed text-[15px]">
              {description}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}