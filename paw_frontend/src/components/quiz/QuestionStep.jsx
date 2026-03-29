import React from "react";
import * as Icons from "lucide-react";
import Button from "../ui/Button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function QuestionStep({ question, currentAnswer, onAnswer, onNext, onPrev, stepIndex, totalSteps }) {
  const { question: text, description, type, options } = question;
  const isMulti = type === "multi";

  const isSelected = (value) =>
    isMulti
      ? Array.isArray(currentAnswer) && currentAnswer.includes(value)
      : currentAnswer === value;

  const handleSelect = (value) => {
    if (isMulti) {
      let next = Array.isArray(currentAnswer) ? [...currentAnswer] : [];
      if (value === "none") {
        next = ["none"];
      } else {
        next = next.filter((v) => v !== "none");
        next = next.includes(value) ? next.filter((v) => v !== value) : [...next, value];
      }
      onAnswer(next.length > 0 ? next : undefined);
    } else {
      onAnswer(value);
    }
  };

  const canProceed = isMulti
    ? Array.isArray(currentAnswer) && currentAnswer.length > 0
    : currentAnswer !== undefined;
  const progress = ((stepIndex + 1) / totalSteps) * 100;

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto w-full">

      {/* Progress bar */}
      <div className="w-full mb-12">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-taupe-400">
            Question {stepIndex + 1}/{totalSteps}
          </span>
          <span className="text-xs font-semibold text-canard-600">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-1.5 bg-beige-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-canard-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question text — centered */}
      <h2 className="text-2xl sm:text-3xl font-bold text-taupe-900 mb-3 text-center leading-tight">
        {text}
      </h2>
      <p className="text-taupe-600 text-center mb-12 max-w-md leading-relaxed">
        {description}
      </p>

      {/* Options grid — centered */}
      <div
        className={`grid gap-3 w-full mb-12 ${
          options.length <= 2
            ? "grid-cols-2 max-w-xs mx-auto"
            : options.length === 3
            ? "grid-cols-3 max-w-md mx-auto"
            : "grid-cols-2 sm:grid-cols-3 max-w-md mx-auto"
        }`}
      >
        {options.map((opt) => {
          const IconComponent = Icons[opt.icon] || Icons.Circle;
          const selected = isSelected(opt.value);
          return (
            <button
              key={String(opt.value)}
              onClick={() => handleSelect(opt.value)}
              className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                selected
                  ? "border-canard-600 bg-canard-50 shadow-sm"
                  : "border-beige-200 bg-white hover:border-beige-300 hover:bg-beige-50/50"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  selected ? "bg-canard-600" : "bg-beige-100"
                }`}
              >
                <IconComponent
                  size={24}
                  strokeWidth={1.5}
                  className={selected ? "text-white" : "text-taupe-600"}
                />
              </div>
              <span
                className={`text-sm font-semibold text-center ${
                  selected ? "text-canard-800" : "text-taupe-800"
                }`}
              >
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Navigation — centered */}
      <div className="flex items-center gap-3">
        {stepIndex > 0 && (
          <Button variant="outline" onClick={onPrev} icon={ArrowLeft}>
            Retour
          </Button>
        )}
        <Button disabled={!canProceed} onClick={onNext} iconRight={ArrowRight}>
          {stepIndex === totalSteps - 1 ? "Voir mes résultats" : "Suivant"}
        </Button>
      </div>
    </div>
  );
}
