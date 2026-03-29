import React, { useState } from "react";
import { Eye, EyeOff, Heart, Building2, PawPrint } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function LogoFallback({ onClick, size = "h-14" }) {
  const [imgError, setImgError] = useState(false);
  if (imgError) {
    return (
      <button onClick={onClick} className="flex items-center gap-2.5 justify-center mx-auto mb-8 cursor-pointer">
        <div className="w-10 h-10 bg-canard-600 rounded-xl flex items-center justify-center">
          <PawPrint size={22} strokeWidth={1.5} className="text-white" />
        </div>
        <span className="text-lg font-extrabold text-taupe-900">Rescue<span className="text-canard-600">Paw</span></span>
      </button>
    );
  }
  return (
    <button onClick={onClick} className="flex items-center gap-3 justify-center mx-auto mb-8 cursor-pointer">
      <img src="/logo.png" alt="RescuePaw" className={`${size} w-auto`} onError={() => setImgError(true)} />
    </button>
  );
}

export default function RegisterPage({ onSuccess, onSwitchToLogin, onExit }) {
  const { register, loading } = useAuth();
  const [step, setStep] = useState("role");
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

  // ── Role selection ──
  if (step === "role") {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <LogoFallback onClick={onExit} />
            <h1 className="text-3xl font-extrabold text-taupe-900 mb-2">S'inscrire</h1>
            <p className="text-taupe-500 text-sm">Choisissez votre profil</p>
          </div>

          <div className="space-y-3 mb-10">
            {roles.map((r) => {
              const Icon = r.icon;
              return (
                <button
                  key={r.value}
                  onClick={() => { setRole(r.value); setStep("form"); }}
                  className="w-full flex items-center gap-4 p-5 bg-white border border-beige-300 rounded-2xl hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5 transition-all duration-200 text-left cursor-pointer"
                >
                  <div className="w-11 h-11 bg-ambre-50 rounded-xl flex items-center justify-center shrink-0">
                    <Icon size={22} strokeWidth={1.5} className="text-ambre-600" />
                  </div>
                  <div>
                    <p className="font-bold text-taupe-900 text-sm">{r.label}</p>
                    <p className="text-xs text-taupe-500 mt-0.5">{r.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-center text-sm text-taupe-500">
            Déjà un compte ?{" "}
            <button onClick={onSwitchToLogin} className="text-canard-600 font-semibold hover:text-canard-800 cursor-pointer">Se connecter</button>
          </p>
        </div>
      </div>
    );
  }

  // ── Registration form ──
  return (
    <div className="min-h-screen bg-beige-50 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <LogoFallback onClick={onExit} size="h-12" />
          <h1 className="text-2xl font-bold text-taupe-900 mb-1">Inscription</h1>
          <p className="text-sm text-taupe-500 mb-3">{role === "ADOPTANT" ? "Adoptant" : "Observateur"}</p>
          <button onClick={() => setStep("role")} className="text-xs text-canard-600 font-medium hover:text-canard-700 cursor-pointer">← Changer de profil</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-taupe-900 mb-2">Nom d'utilisateur</label>
            <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="votre_pseudo" className="w-full px-4 py-3 bg-white border border-beige-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-canard-400 focus:border-transparent transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-taupe-900 mb-2">Email {role === "OBSERVATEUR" ? "professionnel" : ""}</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={role === "OBSERVATEUR" ? "vous@structure.org" : "vous@exemple.fr"} className="w-full px-4 py-3 bg-white border border-beige-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-canard-400 focus:border-transparent transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-taupe-900 mb-2">Mot de passe</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min. 6 caractères" className="w-full px-4 py-3 bg-white border border-beige-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-canard-400 focus:border-transparent transition-all" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-taupe-400 hover:text-taupe-600 cursor-pointer">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-taupe-900 mb-2">Confirmer le mot de passe</label>
            <input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} placeholder="••••••••" className="w-full px-4 py-3 bg-white border border-beige-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-canard-400 focus:border-transparent transition-all" />
          </div>
          {error && <p className="text-sm text-red-500 font-medium bg-red-50 rounded-xl p-4">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-canard-600 hover:bg-canard-700 text-white py-3 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 cursor-pointer">
            {loading ? "Création…" : "Créer mon compte"}
          </button>
        </form>

        <p className="text-center text-sm text-taupe-500 mt-8">
          Déjà un compte ?{" "}
          <button onClick={onSwitchToLogin} className="text-canard-600 font-semibold hover:text-canard-800 cursor-pointer">Se connecter</button>
        </p>
      </div>
    </div>
  );
}