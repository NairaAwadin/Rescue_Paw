import React from 'react';
import { ArrowLeft, MapPin, Heart, Info, Phone, Mail, ShieldCheck, Sparkles } from 'lucide-react';

export default function AnimalProfile({ animal, onBack }) {
  // Si aucun animal n'est sélectionné par erreur, on ne plante pas
  if (!animal) return null;

  return (
    <div className="min-h-screen bg-cream font-sans pb-20 selection:bg-accent selection:text-secondary">
      
      {/* HEADER SIMPLE */}
      <header className="p-6 md:px-12 flex justify-between items-center bg-white shadow-sm sticky top-0 z-50">
        <button 
          onClick={onBack}
          className="text-secondary font-bold uppercase tracking-wide flex items-center gap-2 hover:text-primary transition-colors"
        >
          <ArrowLeft size={20} /> Retour aux résultats
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-10 md:pt-16">
        
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden flex flex-col lg:flex-row border border-secondary/10">
          
          {/* COLONNE GAUCHE : IMAGE */}
          <div className="lg:w-1/2 relative">
            <img 
              src={animal.image} 
              alt={animal.name} 
              className="w-full h-[400px] lg:h-full object-cover"
            />
            {/* Badge Match sur l'image */}
            <div className="absolute top-6 left-6 bg-accent text-secondary font-black text-xl px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2 border-4 border-white">
              <Sparkles size={24} /> {animal.matchScore}% Match
            </div>
          </div>

          {/* COLONNE DROITE : INFOS */}
          <div className="lg:w-1/2 p-8 md:p-12 flex flex-col">
            
            {/* Titre et infos de base */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-5xl font-black text-primary font-poppins">{animal.name}</h1>
                <span className="text-secondary font-black text-2xl">{animal.age}</span>
              </div>
              <p className="text-secondary/80 font-bold text-lg flex items-center gap-2 uppercase tracking-wide">
                <Info size={20} /> {animal.breed}
              </p>
            </div>

            {/* Tags de personnalité */}
            <div className="flex flex-wrap gap-3 mb-8">
              {animal.tags.map(tag => (
                <span key={tag} className="bg-surface text-secondary font-black text-sm uppercase tracking-wider px-4 py-2 rounded-lg border border-secondary/5">
                  {tag}
                </span>
              ))}
            </div>

            {/* Histoire / Description */}
            <div className="mb-10 flex-1">
              <h3 className="text-secondary font-black uppercase tracking-widest text-sm mb-4 border-b-2 border-surface pb-2">
                À propos de {animal.name}
              </h3>
              <p className="text-secondary/90 leading-relaxed text-lg font-medium">
                {animal.name} est un adorable {animal.breed.toLowerCase()} qui attend patiemment sa famille pour la vie. 
                Grâce à vos réponses au quiz, notre IA a déterminé que son niveau d'énergie et ses besoins correspondent parfaitement à votre style de vie. 
                Il est vacciné, pucé et prêt à vous rencontrer !
              </p>
            </div>

            {/* Infos Refuge & Boutons d'action */}
            <div className="bg-cream rounded-2xl p-6 border-2 border-surface">
              <h3 className="text-primary font-black uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
                <ShieldCheck size={18} /> Géré par un refuge partenaire
              </h3>
              
              <div className="flex items-center gap-3 text-secondary font-bold mb-6">
                <div className="bg-surface p-3 rounded-full">
                  <MapPin size={24} className="text-secondary" />
                </div>
                <div>
                  <p className="text-lg">{animal.refuge}</p>
                  <p className="text-sm opacity-70 font-medium">Ouvert aujourd'hui jusqu'à 18h00</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 bg-primary text-white font-black uppercase tracking-wider py-4 rounded-xl shadow-[0_6px_0_#93441A] hover:shadow-[0_3px_0_#93441A] hover:translate-y-[3px] transition-all flex justify-center items-center gap-2">
                  <Heart size={20} /> Adopter {animal.name}
                </button>
                <button className="sm:w-16 flex justify-center items-center bg-white text-secondary border-2 border-surface rounded-xl hover:bg-surface transition-colors" aria-label="Appeler le refuge">
                  <Phone size={24} />
                </button>
                <button className="sm:w-16 flex justify-center items-center bg-white text-secondary border-2 border-surface rounded-xl hover:bg-surface transition-colors" aria-label="Envoyer un email">
                  <Mail size={24} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}