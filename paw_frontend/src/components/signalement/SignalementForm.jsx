import React, { useState } from "react";
import { Search, MapPin, Camera, AlertCircle, Heart, Dog, Cat, HelpCircle, CheckCircle, Home as HomeIcon } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { api } from "../../api/client";
import { mockRefuges } from "../../data/mockData";

export default function SignalementForm({ onSuccess }) {
  const [step, setStep] = useState("type");
  const [type, setType] = useState(null);
  const [form, setForm] = useState({ species: "", race: "", description: "", adresse_approximative: "", ville: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const typeOptions = [
    { value: "FOUND", label: "J'ai trouvé un animal", desc: "Animal errant, perdu ou en danger", icon: Search, color: "border-ambre-400 bg-ambre-50" },
    { value: "ABANDON", label: "Je ne peux plus garder mon animal", desc: "Vous cherchez une solution responsable", icon: Heart, color: "border-canard-400 bg-canard-50" },
  ];

  const speciesOptions = [
    { value: "DOG", label: "Chien", icon: Dog },
    { value: "CAT", label: "Chat", icon: Cat },
    { value: "OTHER", label: "Autre", icon: HelpCircle },
  ];

  const handleSubmit = async () => {
    if (!form.species || !form.description || !form.ville) {
      setError("Veuillez remplir les champs obligatoires (espèce, description, ville).");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await api.createSignalement({ ...form, type_signalement: type });
      setStep("local_help");
    } catch (err) {
      console.warn("API indispo, simulation:", err.message);
      setStep("local_help");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── SUCCESS ── */
  if (step === "success") {
    return (
      <div className="flex flex-col items-center text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-canard-50 rounded-2xl flex items-center justify-center">
          <CheckCircle size={32} strokeWidth={1.5} className="text-canard-600" />
        </div>
        <div className="h-6"></div>
        <h2 className="text-2xl font-bold text-taupe-900">Merci pour votre signalement</h2>
        <div className="h-4"></div>
        <p className="text-taupe-600 max-w-sm leading-relaxed">
          Votre signalement a été enregistré de manière anonyme. Les refuges et associations de la zone seront notifiés
        </p>
        <div className="h-8"></div>
        <Button onClick={onSuccess}>Retour à l'accueil</Button>
      </div>
    );
  }

  /* ── LOCAL HELP ── */
  if (step === "local_help") {
    return (
      <div className="flex flex-col items-center max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-canard-50 rounded-2xl flex items-center justify-center">
          <CheckCircle size={32} strokeWidth={1.5} className="text-canard-600" />
        </div>
        <div className="h-6"></div>
        <h2 className="text-2xl font-bold text-taupe-900">Signalement enregistré !</h2>
        <div className="h-4"></div>
        <p className="text-taupe-600">Voici les structures locales qui peuvent aider :</p>

        <div className="h-8"></div>

        <div className="space-y-3 w-full">
          {mockRefuges.map((r) => (
            <Card key={r.id} hover padding="p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-canard-50 rounded-xl flex items-center justify-center shrink-0">
                  <HomeIcon size={18} strokeWidth={1.5} className="text-canard-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-taupe-900">{r.name}</p>
                  <p className="text-xs text-taupe-400 truncate mt-0.5">{r.address}, {r.city}</p>
                </div>
                <Badge className="bg-canard-50 text-canard-700 shrink-0">Refuge</Badge>
              </div>
            </Card>
          ))}
        </div>

        <div className="h-8"></div>

        <Button onClick={() => setStep("success")}>Compris, merci</Button>
      </div>
    );
  }

  /* ── TYPE SELECTION ── */
  if (step === "type") {
    return (
      <div className="flex flex-col items-center text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-ambre-50 rounded-2xl flex items-center justify-center">
          <AlertCircle size={32} strokeWidth={1.5} className="text-ambre-500" />
        </div>
        <div className="h-6"></div>
        <h2 className="text-2xl font-bold text-taupe-900">Signaler un animal</h2>
        <div className="h-4"></div>
        <p className="text-taupe-600">Ce formulaire est accessible sans compte. Votre signalement est anonyme</p>
        <div className="h-10"></div>

        <div className="w-full space-y-0">
          {typeOptions.map((opt, idx) => {
            const Icon = opt.icon;
            return (
              <div key={opt.value}>
                <button
                  onClick={() => { setType(opt.value); setStep("form"); }}
                  className={`w-full flex items-center gap-5 p-6 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer hover:shadow-sm ${opt.color}`}
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <Icon size={24} strokeWidth={1.5} className="text-taupe-900" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-taupe-900">{opt.label}</p>
                    <p className="text-sm text-taupe-400 mt-1">{opt.desc}</p>
                  </div>
                </button>
                {idx < typeOptions.length - 1 && <div className="h-6"></div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── FORM ── */
  return (
    <div className="flex flex-col items-start max-w-md mx-auto w-full">
      <button
        onClick={() => setStep("type")}
        className="text-sm text-taupe-400 hover:text-taupe-600 cursor-pointer"
      >
        ← Changer de type
      </button>

      <div className="h-4"></div>

      <div className="flex justify-center w-full">
        <Badge className={`${type === "FOUND" ? "bg-ambre-100 text-ambre-700" : "bg-canard-100 text-canard-700"}`}>
          {type === "FOUND" ? "Animal trouvé" : "Abandon responsable"}
        </Badge>
      </div>

      <div className="h-6"></div>

      <h2 className="text-2xl font-bold text-taupe-900 text-center w-full">Décrivez la situation</h2>

      <div className="h-8"></div>

      <div className="space-y-6 w-full">
        {/* Species */}
        <div>
          <label className="block text-sm font-semibold text-taupe-900 mb-3">Espèce *</label>
          <div className="grid grid-cols-3 gap-3">
            {speciesOptions.map((s) => {
              const Icon = s.icon;
              const selected = form.species === s.value;
              return (
                <button
                  key={s.value}
                  onClick={() => setForm({ ...form, species: s.value })}
                  className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    selected
                      ? "border-canard-600 bg-canard-50"
                      : "border-beige-200 bg-white hover:border-beige-300"
                  }`}
                >
                  <Icon size={20} strokeWidth={1.5} className={selected ? "text-canard-600" : "text-taupe-400"} />
                  <span className={`text-xs font-semibold ${selected ? "text-canard-700" : "text-taupe-600"}`}>
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-4"></div>

        {/* Race */}
        <div>
          <label className="block text-sm font-semibold text-taupe-900 mb-2">Race (si connue)</label>
          <input
            type="text"
            value={form.race}
            onChange={(e) => setForm({ ...form, race: e.target.value })}
            placeholder="Ex: Labrador, Siamois…"
            className="w-full px-4 py-3.5 bg-beige-50 border border-beige-200 rounded-xl text-sm transition-all"
          />
        </div>

        <div className="h-4"></div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-taupe-900 mb-2">Description / État de santé *</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            placeholder="Décrivez l'animal, son état, le contexte…"
            className="w-full px-4 py-3.5 bg-beige-50 border border-beige-200 rounded-xl text-sm transition-all resize-none"
          />
        </div>

        <div className="h-4"></div>

        {/* Ville */}
        <div>
          <label className="block text-sm font-semibold text-taupe-900 mb-2">Ville *</label>
          <div className="relative">
            <MapPin size={16} strokeWidth={1.5} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-taupe-400" />
            <input
              type="text"
              value={form.ville}
              onChange={(e) => setForm({ ...form, ville: e.target.value })}
              placeholder="Ex: Paris, Lyon…"
              className="w-full pl-4 pr-10 py-3.5 bg-beige-50 border border-beige-200 rounded-xl text-sm transition-all"
            />
          </div>
        </div>

        <div className="h-4"></div>

        {/* Adresse */}
        <div>
          <label className="block text-sm font-semibold text-taupe-900 mb-2">Adresse approximative</label>
          <input
            type="text"
            value={form.adresse_approximative}
            onChange={(e) => setForm({ ...form, adresse_approximative: e.target.value })}
            placeholder="Rue, quartier, parc…"
            className="w-full px-4 py-3.5 bg-beige-50 border border-beige-200 rounded-xl text-sm transition-all"
          />
        </div>

        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

        <div className="h-4"></div>

        <Button size="lg" className="w-full" disabled={submitting} onClick={handleSubmit}>
          {submitting ? "Envoi en cours…" : "Envoyer le signalement"}
        </Button>
      </div>
    </div>
  );
}
