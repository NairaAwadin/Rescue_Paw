import React, { useState } from 'react';
import LandingPage from './landingPage';
import Quiz from './Quiz';
import MatchingResults from './matchingResults';
import AnimalProfile from './animalProfil';
import AdminDashboard from './adminDashboard'; // <-- Import du Dashboard

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [userAnswers, setUserAnswers] = useState(null);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const finishQuiz = (answers) => {
    setUserAnswers(answers);
    setCurrentView('matching');
  };

  const viewAnimalProfile = (animal) => {
    setSelectedAnimal(animal);
    setCurrentView('profile');
  };

  return (
    <div className="min-h-screen bg-cream selection:bg-accent selection:text-secondary">
      {currentView === 'landing' && (
        <LandingPage 
          onStartQuiz={() => setCurrentView('quiz')} 
          onLoginAdmin={() => setCurrentView('admin')} // <-- Lien vers l'admin
        />
      )}
      
      {currentView === 'quiz' && (
        <Quiz 
          onExit={() => setCurrentView('landing')} 
          onComplete={finishQuiz} 
        />
      )}

      {currentView === 'matching' && (
        <MatchingResults 
          onRestart={() => setCurrentView('landing')} 
          onSelectAnimal={viewAnimalProfile} 
        />
      )}

      {currentView === 'profile' && (
        <AnimalProfile 
          animal={selectedAnimal} 
          onBack={() => setCurrentView('matching')} 
        />
      )}

      {currentView === 'admin' && (
        <AdminDashboard 
          onLogout={() => setCurrentView('landing')} // <-- Retour à l'accueil
        />
      )}
    </div>
  );
}