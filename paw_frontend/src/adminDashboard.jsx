import React, { useState } from 'react';
import { 
  LayoutDashboard, PawPrint, MessageSquare, Settings, 
  Plus, Edit, Trash2, Search, LogOut, X, TrendingUp 
} from 'lucide-react';

// Base de données simulée du refuge
const INITIAL_ANIMALS = [
  { id: 1, name: "Max", breed: "Golden Retriever", age: "2 ans", status: "Disponible" },
  { id: 2, name: "Luna", breed: "Chat de Gouttière", age: "4 ans", status: "En cours d'adoption" },
  { id: 3, name: "Rocky", breed: "Beagle", age: "1 an", status: "Disponible" }
];

export default function AdminDashboard({ onLogout }) {
  const [animals, setAnimals] = useState(INITIAL_ANIMALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtrer les animaux avec la barre de recherche
  const filteredAnimals = animals.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.breed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fonction pour supprimer visuellement un animal
  const handleDelete = (id) => {
    setAnimals(animals.filter(a => a.id !== id));
  };

  return (
    <div className="flex h-screen bg-surface font-sans selection:bg-accent selection:text-secondary overflow-hidden">
      
      {/* MENU LATÉRAL (SIDEBAR) - Caché sur mobile pour l'instant */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-secondary/10">
        <div className="p-6 border-b border-secondary/10">
          <div className="text-secondary font-black text-2xl uppercase tracking-tighter flex items-center gap-2">
            <PawPrint size={28} strokeWidth={2.5} className="text-primary" />
            <span>Admin<span className="text-primary">Paw</span></span>
          </div>
          <p className="text-secondary/60 text-xs font-bold uppercase mt-2 tracking-wider">Refuge de l'Espoir</p>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2">
          <button className="flex items-center gap-3 w-full p-3 rounded-xl bg-primary/10 text-primary font-bold transition-colors">
            <LayoutDashboard size={20} /> Vue d'ensemble
          </button>
          <button className="flex items-center gap-3 w-full p-3 rounded-xl text-secondary/70 font-bold hover:bg-surface transition-colors">
            <PawPrint size={20} /> Nos Animaux
          </button>
          <button className="flex items-center gap-3 w-full p-3 rounded-xl text-secondary/70 font-bold hover:bg-surface transition-colors">
            <MessageSquare size={20} /> Demandes (3)
          </button>
          <button className="flex items-center gap-3 w-full p-3 rounded-xl text-secondary/70 font-bold hover:bg-surface transition-colors">
            <Settings size={20} /> Paramètres
          </button>
        </nav>

        <div className="p-4 border-t border-secondary/10">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 w-full p-3 rounded-xl text-secondary/70 font-bold hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* En-tête Mobile & Top bar */}
        <header className="bg-white p-6 border-b border-secondary/10 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-black text-secondary font-poppins">Bonjour Yane 👋</h1>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="hidden md:flex bg-primary text-white font-bold uppercase text-sm py-2.5 px-5 rounded-lg hover:bg-[#93441A] transition-colors shadow-sm items-center gap-2"
          >
            <Plus size={18} /> Ajouter un animal
          </button>
        </header>

        <div className="p-6 md:p-10 max-w-6xl mx-auto w-full">
          
          {/* STATISTIQUES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-secondary/5 flex flex-col">
              <span className="text-secondary/60 font-bold uppercase tracking-wider text-sm mb-2">Total Animaux</span>
              <span className="text-4xl font-black text-secondary">{animals.length}</span>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-secondary/5 flex flex-col">
              <span className="text-secondary/60 font-bold uppercase tracking-wider text-sm mb-2">Adoptions du mois</span>
              <span className="text-4xl font-black text-primary flex items-center gap-2">0 <TrendingUp size={24} className="text-accent" /></span>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-secondary/5 flex flex-col">
              <span className="text-secondary/60 font-bold uppercase tracking-wider text-sm mb-2">Demandes en attente</span>
              <span className="text-4xl font-black text-secondary">3</span>
            </div>
          </div>

          {/* LISTE DES ANIMAUX */}
          <div className="bg-white rounded-2xl shadow-sm border border-secondary/5 overflow-hidden">
            
            {/* Barre de recherche du tableau */}
            <div className="p-6 border-b border-secondary/10 flex justify-between items-center gap-4 flex-wrap">
              <h2 className="text-xl font-black text-secondary">Nos pensionnaires</h2>
              <div className="relative w-full md:w-64">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-surface rounded-lg font-medium text-secondary outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            {/* Tableau */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface/50 text-secondary/60 uppercase text-xs font-black tracking-wider">
                    <th className="p-4 pl-6">Nom</th>
                    <th className="p-4">Race</th>
                    <th className="p-4">Âge</th>
                    <th className="p-4">Statut</th>
                    <th className="p-4 text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary/5">
                  {filteredAnimals.map(animal => (
                    <tr key={animal.id} className="hover:bg-surface/30 transition-colors">
                      <td className="p-4 pl-6 font-bold text-secondary">{animal.name}</td>
                      <td className="p-4 text-secondary/80 font-medium">{animal.breed}</td>
                      <td className="p-4 text-secondary/80 font-medium">{animal.age}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          animal.status === 'Disponible' 
                            ? 'bg-accent/20 text-[#7a5e17]' 
                            : 'bg-primary/10 text-primary'
                        }`}>
                          {animal.status}
                        </span>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <button className="p-2 text-secondary/40 hover:text-primary transition-colors" aria-label="Modifier">
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(animal.id)}
                          className="p-2 text-secondary/40 hover:text-red-500 transition-colors" 
                          aria-label="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredAnimals.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-secondary/50 font-bold">
                        Aucun animal trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

      {/* MODALE D'AJOUT (Fenêtre pop-up) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-secondary/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-secondary/40 hover:text-secondary"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-black text-secondary font-poppins mb-6">Ajouter un animal</h2>
            
            <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
              <div>
                <label className="block text-secondary font-bold text-sm mb-1">Nom</label>
                <input type="text" placeholder="Ex: Rex" className="w-full p-3 bg-surface rounded-xl outline-none font-medium text-secondary" />
              </div>
              <div>
                <label className="block text-secondary font-bold text-sm mb-1">Race</label>
                <input type="text" placeholder="Ex: Berger Australien" className="w-full p-3 bg-surface rounded-xl outline-none font-medium text-secondary" />
              </div>
              <button type="submit" className="mt-4 w-full bg-primary text-white font-black uppercase py-4 rounded-xl hover:bg-[#93441A] transition-colors shadow-sm">
                Enregistrer
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}