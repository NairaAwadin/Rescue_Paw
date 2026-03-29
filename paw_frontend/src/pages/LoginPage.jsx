import React, { useState } from "react";
import { Eye, EyeOff, PawPrint } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function LogoFallback({ onClick }) {
  const [imgError, setImgError] = useState(false);
  if (imgError) {
    return (
      <button onClick={onClick} className="flex items-center gap-2.5 justify-center mx-auto mb-10 cursor-pointer">
        <div className="w-10 h-10 bg-canard-600 rounded-xl flex items-center justify-center">
          <PawPrint size={22} strokeWidth={1.5} className="text-white" />
        </div>
        <span className="text-lg font-extrabold text-taupe-900">Rescue<span className="text-canard-600">Paw</span></span>
      </button>
    );
  }
  return (
    <button onClick={onClick} className="flex items-center gap-3 justify-center mx-auto mb-10 cursor-pointer">
      <img src="/logo.png" alt="RescuePaw" className="h-14 w-auto" onError={() => setImgError(true)} />
    </button>
  );
}

export default function LoginPage({ onSuccess, onSwitchToRegister, onExit }) {
  const { login, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) { setError("Veuillez remplir tous les champs."); return; }
    setError("");
    try {
      await login(username, password);
      onSuccess();
    } catch (err) {
      setError(err.message || "Identifiants incorrects");
    }
  };

  return (
    <div className="min-h-screen bg-beige-50 flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <LogoFallback onClick={onExit} />
          <h1 className="text-3xl font-extrabold text-taupe-900 mb-2">Connexion</h1>
          <p className="text-taupe-500 text-sm">Accédez à votre espace personnel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-taupe-900 mb-2">Nom d'utilisateur</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="votre_pseudo" className="w-full px-4 py-3 bg-white border border-beige-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-canard-400 focus:border-transparent transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-taupe-900 mb-2">Mot de passe</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 bg-white border border-beige-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-canard-400 focus:border-transparent transition-all" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-taupe-400 hover:text-taupe-600 transition-colors cursor-pointer">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-500 font-medium bg-red-50 rounded-xl p-4">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-canard-600 hover:bg-canard-700 text-white py-3 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 cursor-pointer">
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-sm text-taupe-500 mt-8">
          Pas encore de compte ?{" "}
          <button onClick={onSwitchToRegister} className="text-canard-600 font-semibold hover:text-canard-800 cursor-pointer">S'inscrire</button>
        </p>
      </div>
    </div>
  );
}