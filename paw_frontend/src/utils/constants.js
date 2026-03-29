export const SCORE_CONFIG = {
  A: { color: "bg-canard-600", text: "text-canard-800", label: "Excellent" },
  B: { color: "bg-canard-400", text: "text-canard-600", label: "Bon" },
  C: { color: "bg-ambre-400", text: "text-ambre-600", label: "Moyen" },
  D: { color: "bg-ambre-600", text: "text-ambre-800", label: "Faible" },
  E: { color: "bg-red-500", text: "text-red-600", label: "Critique" },
};

export const STATUS_CONFIG = {
  SIGNALED: { color: "bg-taupe-50 text-taupe-600", label: "Signalé" },
  RESCUED: { color: "bg-ambre-50 text-ambre-800", label: "Pris en charge" },
  ADOPTABLE: { color: "bg-canard-50 text-canard-800", label: "Adoptable" },
};

export const SPECIES_LABELS = { DOG: "Chien", CAT: "Chat", OTHER: "Autre" };
export const SIZE_LABELS = { S: "Petit", M: "Moyen", L: "Grand" };
export const AGE_LABELS = { puppy: "Junior", adult: "Adulte", senior: "Senior" };

export function getMatchColor(score) {
  if (score >= 90) return "text-canard-800 bg-canard-50";
  if (score >= 75) return "text-canard-600 bg-canard-100";
  if (score >= 60) return "text-ambre-800 bg-ambre-50";
  return "text-taupe-600 bg-taupe-100";
}

export function getMatchLabel(score) {
  if (score >= 90) return "Excellent match";
  if (score >= 75) return "Très compatible";
  if (score >= 60) return "Compatible";
  return "À explorer";
}

export const MAP_TILE_URL = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
export const MAP_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>';
