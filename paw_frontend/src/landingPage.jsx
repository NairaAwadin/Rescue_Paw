import React, { useState } from 'react';
import { MapPin, Search, ArrowRight, PawPrint, Menu } from 'lucide-react';

export default function LandingPage({ onStartQuiz, onLoginAdmin }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Recherche du score pour :", searchQuery);
  };

  return (
    <div className="min-h-screen bg-cream font-sans flex flex-col relative overflow-hidden border-[12px] md:border-[16px] border-primary selection:bg-accent selection:text-secondary transition-colors duration-500">
      
      {/* HEADER / NAVIGATION */}
      <header className="flex justify-between items-center p-6 lg:px-12 relative z-20">
        <nav className="hidden md:flex gap-8 text-secondary font-bold uppercase tracking-wide text-sm">
          <a href="#le-projet" className="hover:text-primary transition-colors">Le Projet</a>
          <a href="#refuges" className="hover:text-primary transition-colors">Les Refuges</a>
          <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
        </nav>

        <button aria-label="Ouvrir le menu" className="md:hidden text-secondary">
          <Menu size={28} />
        </button>

        {/* LOGO */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 text-secondary font-black text-2xl md:text-3xl uppercase tracking-tighter">
          <PawPrint size={32} strokeWidth={2.5} className="text-primary" />
          <span>Rescue<span className="text-primary">Paw</span></span>
        </div>

        {/* BOUTONS D'ACTION */}
        <div className="hidden md:flex gap-4 items-center">
          <button 
            aria-label="S'inscrire"
            className="bg-accent text-secondary font-black uppercase text-sm py-3 px-6 rounded-lg hover:bg-[#c99a2e] transition-colors shadow-sm"
          >
            Inscription
          </button>
          <button 
            onClick={onLoginAdmin}
            aria-label="Se connecter"
            className="bg-secondary text-cream font-bold uppercase text-sm py-3 px-6 rounded-lg hover:bg-[#7a3814] transition-colors shadow-sm"
          >
            Connexion
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center text-center px-4 pt-10 md:pt-16 relative z-10">
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-primary uppercase tracking-tighter leading-[0.95] max-w-5xl drop-shadow-sm font-poppins">
          Trouvez votre <br /> 
          <span className="text-secondary">compagnon idéal</span>
        </h1>
        
        <p className="mt-6 text-lg md:text-xl text-secondary/90 font-medium max-w-2xl leading-relaxed">
          L'IA au service du bien-être animal. Prévenez l'abandon et trouvez une famille parfaite pour la vie grâce à notre algorithme de matching.
        </p>

        {/* BARRE DE RECHERCHE */}
        <form onSubmit={handleSearch} className="mt-10 flex w-full max-w-2xl bg-surface rounded-full shadow-md border-4 border-secondary overflow-hidden focus-within:ring-4 focus-within:ring-primary/30 transition-shadow relative">
          <div className="flex items-center pl-5 text-secondary">
            <MapPin size={24} strokeWidth={2.5} />
          </div>
          <input 
            type="text"
            placeholder="Code postal ou Ville"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-4 md:py-5 text-lg font-bold text-secondary placeholder-secondary/50 outline-none bg-transparent"
          />
          <button type="submit" className="bg-secondary text-cream px-6 md:px-10 font-bold uppercase text-sm md:text-base flex items-center gap-2 hover:bg-[#7a3814] transition-colors">
            <span className="hidden md:inline">Vérifier le score</span>
            <Search size={20} strokeWidth={2.5} />
          </button>
        </form>

        {/* CALL TO ACTION */}
        <div className="mt-12 md:mt-16 flex flex-col items-center">
          <button onClick={onStartQuiz} className="group relative bg-primary text-white text-lg md:text-xl font-black uppercase tracking-wider py-5 px-10 rounded-2xl shadow-[0_8px_0_#93441A] hover:shadow-[0_4px_0_#93441A] hover:translate-y-1 transition-all flex items-center gap-3">
            Commencer mon parcours
            <ArrowRight size={24} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
          </button>
          <span className="mt-5 text-sm font-bold text-secondary uppercase tracking-widest bg-surface py-1.5 px-4 rounded-full shadow-sm border border-secondary/10">
            100% Gratuit & Anonyme
          </span>
        </div>
      </main>

      {/* ILLUSTRATION ANIMAUX */}
      <div className="w-full max-w-6xl mx-auto mt-auto relative z-0 flex justify-center px-4 md:px-12 opacity-95">
        <img 
          src="/test_chiens_ban.jpg" 
          alt="Chiens mignons et heureux" 
          className="w-full h-auto object-contain object-bottom drop-shadow-xl"
          style={{ maxHeight: '42vh' }}
        />
      </div>

    </div>
  );
}