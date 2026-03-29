import React, { useState } from "react";
import { PawPrint, Menu, X, User, LogOut } from "lucide-react";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({ currentView, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isLoggedIn, isObservateur, logout } = useAuth();

  const links = [
    { id: "home", label: "Accueil" },
    { id: "quiz", label: "Adopter" },
    { id: "signalement", label: "Signaler" },
    ...(isObservateur ? [{ id: "dashboard", label: "Observatoire" }] : []),
  ];

  const handleLogout = () => {
    logout();
    onNavigate("home");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-beige-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => onNavigate("home")} className="flex items-center gap-2.5 cursor-pointer">
            <img src="/logo.png" alt="RescuePaw" className="h-14 w-auto" />
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${currentView === link.id ? "bg-canard-50 text-canard-800" : "text-taupe-600 hover:text-taupe-800 hover:bg-beige-50"}`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Auth actions */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate("profile")}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-taupe-600 hover:bg-beige-50 transition-all cursor-pointer"
                >
                  <User size={16} strokeWidth={1.5} />
                  {user?.username}
                </button>
                <button onClick={handleLogout} className="p-2 rounded-xl text-taupe-400 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer">
                  <LogOut size={16} strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => onNavigate("login")}>
                  Connexion
                </Button>
                <Button variant="secondary" size="sm" onClick={() => onNavigate("register")}>
                  Créer un compte
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-xl hover:bg-beige-50 transition-colors cursor-pointer">
            {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-beige-200/40">
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <button key={link.id} onClick={() => { onNavigate(link.id); setMenuOpen(false); }} className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all cursor-pointer ${currentView === link.id ? "bg-canard-50 text-canard-800" : "text-taupe-600 hover:bg-beige-50"}`}>
                  {link.label}
                </button>
              ))}
              <div className="pt-2 px-4 space-y-2">
                {isLoggedIn ? (
                  <>
                    <Button variant="outline" size="md" className="w-full" onClick={() => { onNavigate("profile"); setMenuOpen(false); }}>Mon profil</Button>
                    <Button variant="ghost" size="md" className="w-full" onClick={() => { handleLogout(); setMenuOpen(false); }}>Déconnexion</Button>
                  </>
                ) : (
                  <>
                    <Button variant="secondary" size="md" className="w-full" onClick={() => { onNavigate("login"); setMenuOpen(false); }}>Connexion</Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
