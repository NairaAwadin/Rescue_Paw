import React from 'react';
import { ArrowLeft, Heart, Sparkles, MapPin, Info } from 'lucide-react';

// Base de données simulée pour le MVP 
const MATCHING_DATA = [
  {
    id: 1,
    name: "Max",
    breed: "Golden Retriever",
    age: "2 ans",
    matchScore: 98,
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800",
    tags: ["Sociable", "Maison idéale", "Ok Enfants"],
    refuge: "Refuge de l'Espoir (33)"
  },
  {
    id: 2,
    name: "Luna",
    breed: "Chat de Gouttière (Type Chartreux)",
    age: "4 ans",
    matchScore: 92,
    image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=800",
    tags: ["Calme", "Appartement Ok", "Indépendante"],
    refuge: "SPA locale (33)"
  },
  {
    id: 3,
    name: "Rocky",
    breed: "Beagle",
    age: "1 an",
    matchScore: 85,
    image: "beagle.jpeg", // Image locale dans le dossier public
    tags: ["Joueur", "Besoin d'espace", "Énergique"],
    refuge: "Asso' Pattes (33)"
  }
];

export default function MatchingResults({ onRestart, onSelectAnimal }) {
  return (
    <div className="min-h-screen bg-cream font-sans flex flex-col pb-20">
      
      {/* HEADER SIMPLE */}
      <header className="p-6 md:px-12 flex justify-between items-center bg-white shadow-sm sticky top-0 z-50">
        <button 
          onClick={onRestart}
          className="text-secondary font-bold uppercase tracking-wide flex items-center gap-2 hover:text-primary transition-colors"
        >
          <ArrowLeft size={20} /> Refaire le quiz
        </button>
        <div className="text-secondary font-black text-xl uppercase tracking-tighter">
          Rescue<span className="text-primary">Paw</span>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 pt-12">
        
        {/* TITRE & RÉSUMÉ */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 bg-accent/20 text-[#7a5e17] font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <Sparkles size={18} /> Analyse IA terminée
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-primary font-poppins mb-6">
            Voici vos <span className="text-secondary">meilleurs matchs</span>
          </h1>
          <p className="text-secondary/80 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Notre algorithme a analysé votre style de vie. Voici les compagnons qui s'épanouiront le mieux à vos côtés.
          </p>
        </div>

        {/* GRILLE DE CARDS INTÉRACTIVES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MATCHING_DATA.map((animal) => (
            
            // LA CARD (Avec effet de survol global : hover:-translate-y-2)
            <article 
              key={animal.id} 
              className="group relative bg-white rounded-[2rem] shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-primary/20 flex flex-col cursor-pointer"
            >
              
              {/* IMAGE & BADGE DE MATCH */}
              <div className="relative h-72 overflow-hidden">
                {/* L'image zoome légèrement au survol (group-hover:scale-105) */}
                <img 
                  src={animal.image} 
                  alt={animal.breed} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-accent text-secondary font-black text-lg px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border-2 border-white">
                  {animal.matchScore}% Match
                </div>
              </div>

              {/* CONTENU DE LA CARD */}
              <div className="p-6 md:p-8 flex flex-col flex-1">
                
                <div className="flex justify-between items-end mb-2">
                  <h2 className="text-3xl font-black text-secondary font-poppins">{animal.name}</h2>
                  <span className="text-primary font-bold text-lg">{animal.age}</span>
                </div>
                
                <p className="text-secondary/70 font-bold uppercase tracking-wide text-sm mb-6 flex items-center gap-2">
                  <Info size={16} /> {animal.breed}
                </p>

                {/* TAGS (Traits de caractère) */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {animal.tags.map(tag => (
                    <span key={tag} className="bg-surface text-secondary font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* BOUTON D'ACTION (Poussé vers le bas grâce à mt-auto) */}
                <div className="mt-auto">
                  <div className="flex items-center gap-2 text-secondary/60 text-sm font-bold mb-4 uppercase tracking-wider">
                    <MapPin size={16} /> {animal.refuge}
                  </div>
                  <button onClick={() => onSelectAnimal(animal)} className="w-full bg-surface text-secondary font-black uppercase py-4 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm flex justify-center items-center gap-2">
                    Découvrir {animal.name} <Heart size={18} className="group-hover:fill-current" />
                  </button>
                </div>

              </div>
            </article>

          ))}
        </div>

      </main>
    </div>
  );
}