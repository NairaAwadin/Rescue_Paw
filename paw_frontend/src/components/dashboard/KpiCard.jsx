import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import Card from "../ui/Card";

export default function KpiCard({ label, value, variation, icon: Icon, suffix = "" }) {
  const isPositive = variation >= 0;
  return (
    <Card padding="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 bg-canard-50 rounded-xl flex items-center justify-center"><Icon size={20} strokeWidth={1.5} className="text-canard-600" /></div>
        {variation !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${isPositive ? "bg-canard-50 text-canard-600" : "bg-ambre-50 text-ambre-600"}`}>
            {isPositive ? <TrendingUp size={12} strokeWidth={2} /> : <TrendingDown size={12} strokeWidth={2} />}{Math.abs(variation)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-taupe-900">{value}{suffix && <span className="text-base font-semibold text-taupe-400">{suffix}</span>}</p>
      <p className="text-xs text-taupe-400 mt-1 font-medium">{label}</p>
    </Card>
  );
}
