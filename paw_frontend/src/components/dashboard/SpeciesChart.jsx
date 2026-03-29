import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import Card from "../ui/Card";

ChartJS.register(ArcElement, Tooltip);

export default function SpeciesChart({ breakdown }) {
  const data = { labels: breakdown.labels, datasets: [{ data: breakdown.data, backgroundColor: ["#2B6B4F","#E8AA4C"], borderColor: ["#fff","#fff"], borderWidth: 3, borderRadius: 4, hoverOffset: 6 }] };
  const options = { responsive: true, maintainAspectRatio: false, cutout: "70%", plugins: { tooltip: { backgroundColor: "rgba(78,70,62,0.9)", titleFont: { family: "Plus Jakarta Sans", size: 12, weight: "600" }, bodyFont: { family: "Plus Jakarta Sans", size: 11 }, padding: 12, cornerRadius: 12 } } };
  const total = breakdown.data.reduce((a, b) => a + b, 0);
  return (
    <Card padding="p-5">
      <h3 className="text-sm font-bold text-taupe-900 mb-1">Répartition par espèce</h3>
      <p className="text-xs text-taupe-400 mb-5">Sur les signalements actifs</p>
      <div className="relative h-44 flex items-center justify-center">
        <Doughnut data={data} options={options} />
        <div className="absolute flex flex-col items-center"><span className="text-2xl font-bold text-taupe-900">{total}%</span><span className="text-[10px] text-taupe-400 font-medium">Total</span></div>
      </div>
      <div className="flex justify-center gap-6 mt-4">
        {breakdown.labels.map((l, i) => (
          <div key={l} className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.datasets[0].backgroundColor[i] }} /><span className="text-xs font-semibold text-taupe-600">{l} ({breakdown.data[i]}%)</span></div>
        ))}
      </div>
    </Card>
  );
}
