import React, { useState } from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";
import MatchingPage from "./pages/MatchingPage";
import SignalementPage from "./pages/SignalementPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const [currentView, setCurrentView] = useState("home");
  const [quizAnswers, setQuizAnswers] = useState(null);
  const { isLoggedIn, isObservateur, logout } = useAuth();

  const navigate = (view) => {
    // Guard dashboard for observateurs only
    if (view === "dashboard" && !isObservateur) {
      setCurrentView("login");
      return;
    }
    // Guard profile for logged in users
    if (view === "profile" && !isLoggedIn) {
      setCurrentView("login");
      return;
    }
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const handleQuizComplete = (answers) => {
    setQuizAnswers(answers);
    navigate("matching");
  };

  // Full-screen views (no navbar/footer)
  const fullScreenViews = ["quiz", "dashboard", "login", "register"];
  const isFullScreen = fullScreenViews.includes(currentView);

  return (
    <div className="min-h-screen bg-beige-50 flex flex-col">
      {!isFullScreen && <Navbar currentView={currentView} onNavigate={navigate} />}

      {currentView === "home" && (
        <>
          <HomePage onNavigate={navigate} />
          <Footer />
        </>
      )}

      {currentView === "quiz" && (
        <QuizPage onComplete={handleQuizComplete} onExit={() => navigate("home")} />
      )}

      {currentView === "matching" && (
        <>
          <MatchingPage
            answers={quizAnswers}
            onRestart={() => navigate("quiz")}
            onExit={() => navigate("home")}
            onLoginRequired={() => navigate("login")}
          />
          <Footer />
        </>
      )}

      {currentView === "signalement" && (
        <>
          <SignalementPage onExit={() => navigate("home")} />
          <Footer />
        </>
      )}

      {currentView === "dashboard" && (
        <DashboardPage onLogout={logout} onNavigate={navigate} />
      )}

      {currentView === "login" && (
        <LoginPage
          onSuccess={() => navigate("home")}
          onSwitchToRegister={() => navigate("register")}
          onExit={() => navigate("home")}
        />
      )}

      {currentView === "register" && (
        <RegisterPage
          onSuccess={() => navigate("home")}
          onSwitchToLogin={() => navigate("login")}
          onExit={() => navigate("home")}
        />
      )}

      {currentView === "profile" && (
        <>
          <ProfilePage onNavigate={navigate} />
          <Footer />
        </>
      )}
    </div>
  );
}
