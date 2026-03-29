import React from "react";
import { SCORE_CONFIG } from "../../utils/constants";

export default function ScoreGauge({ score = "C", size = 80 }) {
  const config = SCORE_CONFIG[score] || SCORE_CONFIG.C;
  const strokeWidth = 5;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  const scoreValues = { A: 95, B: 75, C: 55, D: 35, E: 15 };
  const percent = scoreValues[score] || 50;
  const offset = circumference - (percent / 100) * circumference;

  const colorMap = {
    A: "#2B6B4F",
    B: "#6B9E82",
    C: "#E8AA4C",
    D: "#C47A1E",
    E: "#C0392B",
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F0E8DA"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colorMap[score] || colorMap.C}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-xl font-extrabold ${config.text}`}>{score}</span>
        <span className="text-[9px] font-semibold text-taupe-400 uppercase tracking-wider">
          {config.label}
        </span>
      </div>
    </div>
  );
}