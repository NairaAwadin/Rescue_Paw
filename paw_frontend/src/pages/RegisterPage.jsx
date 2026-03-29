import React, { useState } from "react";
import { Eye, EyeOff, Heart, Building2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage({ onSuccess, onSwitchToLogin, onExit }) {
  const { register, loading } = useAuth();
  const [step, setStep] = useState("role"); // role → form
  const [role, setRole] = useState(null);
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const roles = [
    { value: "ADOPTANT", label: "Adoptant", desc: "Trouver un compagnon idéal", icon: Heart },
    { value: "OBSERVATEUR", label: "Observateur", desc: "Accès à l'observatoire", icon: Building2 },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) { setError("Veuillez remplir tous les champs."); return; }
    if (form.password !== form.confirm) { setError("Les mots de passe ne correspondent pas."); return; }
    if (form.password.length < 6) { setError("Le mot de passe doit faire au moins 6 caractères."); return; }
    setError("");
    try {
      await register({ username: form.username, email: form.email, password: form.password, user_type: role });
      onSuccess();
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription");
    }
  };

  if (step === "role") {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center px-6 py-32">
        <div className="w-full max-w-md">
          <div className="text-center mb-20">
            <button onClick={onExit} className="flex items-center gap-3 justify-center mx-auto mb-16">
              <img src="/logo.png" alt="RescuePaw" className="h-14 w-auto" />
            </button>
            <h1 className="text-4xl font-extrabold text-taupe-900 mb-4">S'inscrire</h1>
            <p className="text-taupe-600 text-base">Choisissez votre profil</p>
          </div>

          <div className="space-y-4 mb-20">
            {roles.map((r) => {
              const Icon = r.icon;
              return (
                <button 
                  key={r.value} 
                  onClick={() => { setRole(r.value); setStep("form"); }}
                  className="w-full flex items-center gap-4 p-5 bg-white border border-beige-300 rounded-2xl hover:shadow-md transition-all text-left cursor-pointer"
                >
                  <div className="flex-shrink-0">
                    <Icon size={24} className="text-ambre-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-taupe-900">{r.label}</p>
                    <p className="text-xs text-taupe-600 mt-0.5">{r.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-center text-sm text-taupe-600">
            Déjà un compte ? <button onClick={onSwitchToLogin} className="text-canard-600 font-semibold hover:text-canard-800 cursor-pointer">Se connecter</button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-50 flex items-center justify-center px-6 py-32">
      <div className="w-full max-w-md">
        <div className="text-center mb-20">
          <button onClick={onExit} className="flex items-center gap-3 justify-center mx-auto mb-16">
            <img src="/logo.png" alt="RescuePaw" className="h-14 w-auto" />
          </button>
          <h1 className="text-4xl font-bold text-taupe-900 mb-4">Inscription</h1>
          <p className="text-base text-taupe-600 mb-6">{role === "ADOPTANT" ? "Adoptant" : "Observateur"}</p>
          <button onClick={() => setStep("role")} className="text-sm text-canard-600 font-medium hover:text-canard-700 cursor-pointer">← Changer de profil</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-taupe-900 mb-2">Nom d'utilisateur</label>
            <input 
              type="text" 
              value={form.username} 
              onChange={(e) => setForm({ ...form, username: e.target.value })} 
              placeholder="votre_pseudo" 
              className="w-full px-4 py-3 bg-white border border-beige-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-canard-500 focus:border-canard-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-taupe-900 mb-2">Email {role === "OBSERVATEUR" ? "professionnel" : ""}</label>
            <input 
              type="email" 
              value={form.email} 
              onChange={(e) => setForm({ ...form, email: e.target.value })} 
              placeholder={role === "OBSERVATEUR" ? "vous@structure.org" : "vous@exemple.fr"} 
              className="w-full px-4 py-3 bg-white border border-beige-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-canard-500 focus:border-canard-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-taupe-900 mb-2">Mot de passe</label>
            <div className="relative">
              <input 
                type={showPw ? "text" : "password"} 
                value={form.password} 
                onChange={(e) => setForm({ ...form, password: e.target.value })} 
                placeholder="Min. 6 caractères" 
                className="w-full px-4 py-3 bg-white border border-beige-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-canard-500 focus:border-canard-500 transition-all"
              />
              <button 
                type="button" 
                onClick={() => setShowPw(!showPw)} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-taupe-400 hover:text-taupe-600 cursor-pointer"
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-taupe-900 mb-2">Confirmer le mot de passe</label>
            <input 
              type="password" 
              value={form.confirm} 
              onChange={(e) => setForm({ ...form, confirm: e.target.value })} 
              placeholder="••••••••" 
              className="w-full px-4 py-3 bg-white border border-beige-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-canard-500 focus:border-canard-500 transition-all"
            />
          </div>

          {error && <p className="text-sm text-red-500 font-medium bg-red-50 rounded-lg p-4 mt-6">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-canard-600 hover:bg-canard-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Création…" : "Créer mon compte"}
          </button>
        </form>

        <p className="text-center text-sm text-taupe-600 mt-10">
          Déjà un compte ? <button onClick={onSwitchToLogin} className="text-canard-600 font-semibold hover:text-canard-800 cursor-pointer">Se connecter</button>
        </p>
      </div>
    </div>
  );
}
