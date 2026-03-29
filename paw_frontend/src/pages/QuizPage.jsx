import React, { useState } from "react";
import { X } from "lucide-react";
import ConsentStep from "../components/quiz/ConsentStep";
import QuestionStep from "../components/quiz/QuestionStep";
import { quizQuestions } from "../data/mockData";

export default function QuizPage({ onComplete, onExit }) {
  const [consented, setConsented] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleAnswer = (value) => setAnswers(prev => ({ ...prev, [quizQuestions[step].id]: value }));
  const handleNext = () => { if (step < quizQuestions.length - 1) setStep(step + 1); else onComplete(answers); };
  const handlePrev = () => { if (step > 0) setStep(step - 1); };

  return (
    <div className="min-h-screen bg-beige-50 flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-beige-200/40">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-sm font-bold text-taupe-900">Quiz d'adoption</span>
          <button onClick={onExit} className="w-8 h-8 rounded-lg hover:bg-beige-100 flex items-center justify-center transition-colors cursor-pointer">
            <X size={18} strokeWidth={1.5} className="text-taupe-400" />
          </button>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 pt-32 pb-24">
        {!consented ? (
          <ConsentStep onAccept={() => setConsented(true)} />
        ) : (
          <QuestionStep question={quizQuestions[step]} currentAnswer={answers[quizQuestions[step].id]} onAnswer={handleAnswer} onNext={handleNext} onPrev={handlePrev} stepIndex={step} totalSteps={quizQuestions.length} />
        )}
      </div>
    </div>
  );
}
