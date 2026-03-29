import React from "react";
import { SCORE_CONFIG } from "../../utils/constants";

export default function ScoreGauge({ score = "C", size = 80 }) {
  const config = SCORE_CONFIG[score] || SCORE_CONFIG.C;
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const scoreValues = { A: 95, B: 75, C: 55, D: 35, E: 15 };
  const percent = scoreValues[score] || 50;
  const offset = circumference - (percent / 100) * circumference;
  const colorMap = { A: "#2B6B4F", B: "#6B9E82", C: "#E8AA4C", D: "#C47A1E", E: "#C0392B" };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#f5f5f4" strokeWidth="6" />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={colorMap[score]||colorMap.C} strokeWidth="6" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-700 ease-out" />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-xl font-bold ${config.text}`}>{score}</span>
        <span className="text-[10px] font-medium text-taupe-400">{config.label}</span>
      </div>
    </div>
  );
}
