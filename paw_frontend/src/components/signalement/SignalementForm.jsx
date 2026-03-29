import React, { useState } from "react";
import { Search, MapPin, Camera, AlertCircle, Heart, Dog, Cat, HelpCircle, CheckCircle, Stethoscope, Home as HomeIcon } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { api } from "../../api/client";
import { mockRefuges } from "../../data/mockData";

export default function SignalementForm({ onSuccess }) {
  const [step, setStep] = useState("type"); // type → form → local_help → success
  const [type, setType] = useState(null); // FOUND or ABANDON
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
      // Fallback mock
      console.warn("API indispo, simulation:", err.message);
      setStep("local_help");
    } finally {
      setSubmitting(false);
    }
  };

  if (step === "success") {
    return (
      <div className="flex flex-col items-center text-center py-12">
        <div className="w-16 h-16 bg-canard-50 rounded-2xl flex items-center justify-center mb-6">
          <CheckCircle size={32} strokeWidth={1.5} className="text-canard-600" />
        </div>
        <h2 className="text-2xl font-bold text-taupe-900 mb-2">Merci pour votre signalement</h2>
        <p className="text-taupe-600 max-w-md mb-8">Votre signalement a été enregistré de manière anonyme. Les refuges et associations de la zone seront notifiés.</p>
        <Button onClick={onSuccess}>Retour à l'accueil</Button>
      </div>
    );
  }

  if (step === "local_help") {
    return (
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-canard-50 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <CheckCircle size={32} strokeWidth={1.5} className="text-canard-600" />
          </div>
          <h2 className="text-2xl font-bold text-taupe-900 mb-2">Signalement enregistré !</h2>
          <p className="text-taupe-600">Voici les structures locales qui peuvent aider :</p>
        </div>
        <div className="space-y-4 mb-12">
          {mockRefuges.map((r) => (
            <Card key={r.id} hover padding="p-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-canard-50 rounded-xl flex items-center justify-center shrink-0">
                  <HomeIcon size={18} strokeWidth={1.5} className="text-canard-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-taupe-900">{r.name}</p>
                  <p className="text-xs text-taupe-400 truncate">{r.address}, {r.city}</p>
                </div>
                <Badge className="bg-canard-50 text-canard-700 shrink-0">Refuge</Badge>
              </div>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <Button onClick={() => { setStep("success"); }}>Compris, merci</Button>
        </div>
      </div>
    );
  }

  if (step === "type") {
    return (
      <div className="max-w-3xl mx-auto text-center">
        <div className="w-18 h-18 bg-ambre-50 rounded-2xl flex items-center justify-center mb-12 mx-auto">
          <AlertCircle size={40} strokeWidth={1.5} className="text-ambre-500" />
        </div>
        <h2 className="text-4xl font-bold text-taupe-900 mb-6">Signaler un animal</h2>
        <p className="text-taupe-600 mb-20 text-lg">Ce formulaire est accessible sans compte. Votre signalement est anonyme.</p>
        <div className="space-y-5">
          {typeOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <button key={opt.value} onClick={() => { setType(opt.value); setStep("form"); }}
                className={`w-full flex items-center gap-6 p-8 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer hover:shadow-sm ${opt.color}`}>
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                  <Icon size={28} strokeWidth={1.5} className="text-taupe-900" />
                </div>
                <div>
                  <p className="text-lg font-bold text-taupe-900">{opt.label}</p>
                  <p className="text-base text-taupe-400 mt-1">{opt.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // step === "form"
  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => setStep("type")} className="text-base text-taupe-400 hover:text-taupe-600 mb-12 cursor-pointer">← Changer de type</button>
      <Badge className={`mb-8 text-base py-2 px-4 ${type === "FOUND" ? "bg-ambre-100 text-ambre-700" : "bg-canard-100 text-canard-700"}`}>
        {type === "FOUND" ? "Animal trouvé" : "Abandon responsable"}
      </Badge>
      <h2 className="text-3xl font-bold text-taupe-900 mb-16">Décrivez la situation</h2>

      <div className="space-y-10">
        {/* Species */}
        <div>
          <label className="block text-sm font-semibold text-taupe-900 mb-2">Espèce *</label>
          <div className="grid grid-cols-3 gap-2">
            {speciesOptions.map((s) => {
              const Icon = s.icon;
              const selected = form.species === s.value;
              return (
                <button key={s.value} onClick={() => setForm({ ...form, species: s.value })}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${selected ? "border-canard-600 bg-canard-50" : "border-beige-200 bg-white hover:border-beige-300"}`}>
                  <Icon size={20} strokeWidth={1.5} className={selected ? "text-canard-600" : "text-taupe-400"} />
                  <span className={`text-xs font-semibold ${selected ? "text-canard-700" : "text-taupe-600"}`}>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Race */}
        <div>
          <label className="block text-sm font-semibold text-taupe-900 mb-1.5">Race (si connue)</label>
          <input type="text" value={form.race} onChange={(e) => setForm({ ...form, race: e.target.value })} placeholder="Ex: Labrador, Siamois…" className="w-full px-4 py-3 bg-beige-50 border border-beige-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-canard-200 focus:border-canard-400 transition-all" />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-taupe-900 mb-1.5">Description / État de santé *</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Décrivez l'animal, son état, le contexte…" className="w-full px-4 py-3 bg-beige-50 border border-beige-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-canard-200 focus:border-canard-400 transition-all resize-none" />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-taupe-900 mb-1.5">Ville *</label>
          <div className="relative">
            <MapPin size={16} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-taupe-400" />
            <input type="text" value={form.ville} onChange={(e) => setForm({ ...form, ville: e.target.value })} placeholder="Ex: Paris, Lyon…" className="w-full pl-10 pr-4 py-3 bg-beige-50 border border-beige-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-canard-200 focus:border-canard-400 transition-all" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-taupe-900 mb-1.5">Adresse approximative</label>
          <input type="text" value={form.adresse_approximative} onChange={(e) => setForm({ ...form, adresse_approximative: e.target.value })} placeholder="Rue, quartier, parc…" className="w-full px-4 py-3 bg-beige-50 border border-beige-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-canard-200 focus:border-canard-400 transition-all" />
        </div>

        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

        <Button size="lg" className="w-full" disabled={submitting} onClick={handleSubmit}>
          {submitting ? "Envoi en cours…" : "Envoyer le signalement"}
        </Button>
      </div>
    </div>
  );
}
