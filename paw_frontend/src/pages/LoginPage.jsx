import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

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
    <div className="min-h-screen bg-beige-50 flex items-center justify-center px-6 py-32">
      <div className="w-full max-w-md">
        <div className="text-center mb-20">
          <button onClick={onExit} className="flex items-center gap-3 justify-center mx-auto mb-16">
            <img src="/logo.png" alt="RescuePaw" className="h-14 w-auto" />
          </button>
          <h1 className="text-4xl font-extrabold text-taupe-900 mb-4">Connexion</h1>
          <p className="text-taupe-600 text-base">Accédez à votre espace personnel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-semibold text-taupe-900 mb-2">Nom d'utilisateur</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="votre_pseudo" 
              className="w-full px-4 py-3 bg-white border border-beige-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-canard-500 focus:border-canard-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-taupe-900 mb-2">Mot de passe</label>
            <div className="relative">
              <input 
                type={showPw ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                className="w-full px-4 py-3 bg-white border border-beige-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-canard-500 focus:border-canard-500 transition-all"
              />
              <button 
                type="button" 
                onClick={() => setShowPw(!showPw)} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-taupe-400 hover:text-taupe-600 transition-colors cursor-pointer"
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-500 font-medium bg-red-50 rounded-lg p-4 mt-6">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-canard-600 hover:bg-canard-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-sm text-taupe-600 mt-10">
          Pas encore de compte ? <button onClick={onSwitchToRegister} className="text-canard-600 font-semibold hover:text-canard-800 cursor-pointer">S'inscrire</button>
        </p>
      </div>
    </div>
  );
}
