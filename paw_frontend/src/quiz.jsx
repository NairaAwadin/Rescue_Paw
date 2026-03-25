import React, { useState } from 'react';
import { 
  Building2, Home, Tent, Baby, Users, User, Dog, Cat, Bird, Ban, 
  Smile, ShieldCheck, HeartHandshake, Ghost, Clock, Hourglass, 
  Ruler, Maximize, Minimize, ArrowLeft, ArrowRight 
} from 'lucide-react';

// --- BASE DE DONNÉES DU QUIZ ---
const QUIZ_QUESTIONS = [
  {
    id: 'habitat',
    question: "Où votre animal habitera-t-il ?",
    tip: "Si vous vivez en appartement, nous privilégierons des animaux plus calmes.",
    options: [
      { value: 'appartement', label: 'Appartement', icon: Building2, summary: "Je vis en appartement" },
      { value: 'maison', label: 'Maison', icon: Home, summary: "Je vis dans une maison" },
      { value: 'autre', label: 'Autre', icon: Tent, summary: "Je vis dans un habitat atypique" },
    ]
  },
  {
    id: 'children',
    question: "Avez-vous des enfants ?",
    tip: "Certains animaux sont très patients, d'autres préfèrent le calme.",
    options: [
      { value: 'non', label: 'Non', icon: User, summary: "sans enfant" },
      { value: 'bas_age', label: 'Oui, en bas âge', icon: Baby, summary: "avec des enfants en bas âge" },
      { value: 'grands', label: 'Oui, des ados', icon: Users, summary: "avec des grands enfants" },
    ]
  },
  {
    id: 'experience',
    question: "Avez-vous déjà eu un animal de compagnie ?",
    options: [
      { value: 'chien', label: 'Chiens', icon: Dog, summary: "J'ai de l'expérience avec les chiens" },
      { value: 'chat', label: 'Chats', icon: Cat, summary: "J'ai de l'expérience avec les chats" },
      { value: 'autre', label: 'Autres', icon: Bird, summary: "J'ai eu d'autres types d'animaux" },
      { value: 'aucune', label: 'Jamais', icon: Ban, summary: "Ce sera mon premier animal" },
    ]
  },
  {
    id: 'current_pets',
    question: "Avez-vous actuellement un animal ?",
    options: [
      { value: 'chien', label: 'Oui, un chien', icon: Dog, summary: "J'ai actuellement un chien" },
      { value: 'chat', label: 'Oui, un chat', icon: Cat, summary: "J'ai actuellement un chat" },
      { value: 'aucun', label: 'Aucun', icon: Ban, summary: "Je n'ai pas d'autres animaux actuellement" },
    ]
  },
  {
    id: 'personality',
    question: "Quelle personnalité recherchez-vous ?",
    options: [
      { value: 'joyeux', label: 'Joyeux & Joueur', icon: Smile, summary: "Je cherche un compagnon très joueur" },
      { value: 'protecteur', label: 'Protecteur', icon: ShieldCheck, summary: "Je cherche un animal protecteur" },
      { value: 'sociable', label: 'Très sociable', icon: HeartHandshake, summary: "Je veux un animal qui aime tout le monde" },
      { value: 'timide', label: 'Calme & Indépendant', icon: Ghost, summary: "Je préfère un animal calme et indépendant" },
    ]
  },
  {
    id: 'time_alone',
    question: "Combien de temps sera-t-il seul par jour ?",
    tip: "Soyez honnête, c'est crucial pour le bien-être de l'animal.",
    options: [
      { value: 'jamais', label: 'Presque jamais', icon: Home, summary: "qui sera rarement seul" },
      { value: '4h', label: 'Environ 4 heures', icon: Hourglass, summary: "qui peut rester seul 4h par jour" },
      { value: '8h', label: 'Jusqu\'à 8 heures', icon: Clock, summary: "qui supporte la solitude pendant mes journées de travail" },
    ]
  },
  {
    id: 'size',
    question: "Quelle est la taille idéale ?",
    options: [
      { value: 'petit', label: 'Petit', icon: Minimize, summary: "De petite taille." },
      { value: 'moyen', label: 'Moyen', icon: Ruler, summary: "De taille moyenne." },
      { value: 'grand', label: 'Grand', icon: Maximize, summary: "De grande taille." },
    ]
  }
];

export default function Quiz({ onExit, onComplete }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const currentQuestion = QUIZ_QUESTIONS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === QUIZ_QUESTIONS.length - 1;
  const currentAnswer = answers[currentQuestion.id];

  // Gérer la sélection d'une réponse
  const handleSelect = (value) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  // Navigation
 const handleNext = () => {
    if (currentAnswer && !isLastStep) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else if (isLastStep) {
      // Au lieu du simple console.log, on valide le quiz et on envoie les réponses !
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else {
      onExit(); // Retour à la landing page
    }
  };

  // Générer le texte récapitulatif
  const generateSummary = () => {
    const parts = [];
    QUIZ_QUESTIONS.forEach(q => {
      const answerValue = answers[q.id];
      if (answerValue) {
        const option = q.options.find(o => o.value === answerValue);
        if (option) parts.push(option.summary);
      }
    });
    return parts.length > 0 ? parts.join(', ') + '.' : "Vos réponses s'afficheront ici...";
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col font-sans border-[12px] border-primary pb-10">
      
      {/* Header du Quiz */}
      <header className="p-6">
        <button 
          onClick={onExit}
          className="text-secondary font-bold uppercase tracking-wide flex items-center gap-2 hover:text-primary transition-colors"
        >
          <ArrowLeft size={20} /> Retour à l'accueil
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 max-w-5xl mx-auto w-full">
        
        {/* Titre et Tip */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-primary font-poppins mb-4">
            {currentQuestion.question}
          </h2>
          {currentQuestion.tip && (
            <p className="text-secondary/80 font-medium italic text-lg">
              ( Conseil : {currentQuestion.tip} )
            </p>
          )}
        </div>

        {/* Grille d'Options Circulaires (Style de la capture) */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-16">
          {currentQuestion.options.map((option) => {
            const isSelected = currentAnswer === option.value;
            const Icon = option.icon;

            return (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`flex flex-col items-center gap-4 w-32 md:w-40 transition-all ${
                  isSelected ? 'scale-105' : 'hover:scale-105 opacity-70 hover:opacity-100'
                }`}
              >
                <div className={`
                  w-24 h-24 md:w-32 md:h-32 rounded-full border-4 flex items-center justify-center bg-white shadow-sm transition-colors
                  ${isSelected ? 'border-primary text-primary shadow-primary/20' : 'border-secondary/30 text-secondary'}
                `}>
                  <Icon size={48} strokeWidth={isSelected ? 2.5 : 1.5} />
                </div>
                <span className={`font-black text-sm md:text-base text-center uppercase tracking-wide leading-snug ${
                  isSelected ? 'text-primary' : 'text-secondary'
                }`}>
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Boutons de Navigation Suivant/Précédent */}
        <div className="flex gap-6 w-full max-w-md mb-12">
          <button 
            onClick={handleBack}
            className="flex-1 bg-primary text-white font-bold uppercase py-4 rounded-xl shadow-[0_6px_0_#93441A] hover:shadow-[0_3px_0_#93441A] hover:translate-y-[3px] transition-all"
          >
            Précédent
          </button>
          <button 
            onClick={handleNext}
            disabled={!currentAnswer}
            className={`flex-1 font-bold uppercase py-4 rounded-xl transition-all ${
              currentAnswer 
                ? 'bg-primary text-white shadow-[0_6px_0_#93441A] hover:shadow-[0_3px_0_#93441A] hover:translate-y-[3px]' 
                : 'bg-surface text-secondary/40 cursor-not-allowed'
            }`}
          >
            {isLastStep ? 'Voir le Match' : 'Suivant'}
          </button>
        </div>

        {/* Indicateur de Progression (Question X sur Y) */}
        <div className="text-primary font-black uppercase tracking-widest text-sm mb-4">
          Question {currentStepIndex + 1} sur {QUIZ_QUESTIONS.length}
        </div>

        {/* Barre de Progression (Tirets) */}
        <div className="flex gap-2 mb-12">
          {QUIZ_QUESTIONS.map((_, index) => (
            <div 
              key={index} 
              className={`h-2 w-8 md:w-12 rounded-full transition-colors ${
                index <= currentStepIndex ? 'bg-primary' : 'bg-surface'
              }`}
            />
          ))}
        </div>

        {/* Résumé Dynamique */}
        <div className="text-center max-w-3xl">
          <p className="text-primary font-black uppercase tracking-widest text-sm mb-4">
            --- Votre profil jusqu'à présent ---
          </p>
          <p className="text-secondary font-bold uppercase tracking-wider leading-relaxed md:text-lg">
            {generateSummary()}
          </p>
        </div>

      </main>
    </div>
  );
}