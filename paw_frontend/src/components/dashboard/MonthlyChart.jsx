import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from "chart.js";
import Card from "../ui/Card";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

export default function MonthlyChart({ stats }) {
  const data = {
    labels: stats.labels,
    datasets: [
      { label: "Signalements", data: stats.signalements, borderColor: "#E8AA4C", backgroundColor: "rgba(232,170,76,0.08)", fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: "#E8AA4C", pointBorderColor: "#fff", pointBorderWidth: 2, borderWidth: 2.5 },
      { label: "Adoptions", data: stats.adoptions, borderColor: "#2B6B4F", backgroundColor: "rgba(43,107,79,0.06)", fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: "#2B6B4F", pointBorderColor: "#fff", pointBorderWidth: 2, borderWidth: 2.5 },
    ],
  };
  const options = {
    responsive: true, maintainAspectRatio: false, interaction: { intersect: false, mode: "index" },
    plugins: { tooltip: { backgroundColor: "rgba(78,70,62,0.9)", titleFont: { family: "Plus Jakarta Sans", size: 12, weight: "600" }, bodyFont: { family: "Plus Jakarta Sans", size: 11 }, padding: 12, cornerRadius: 12, displayColors: true, boxPadding: 4 } },
    scales: { x: { grid: { display: false }, border: { display: false }, ticks: { color: "#A89A8B", font: { family: "Plus Jakarta Sans", size: 11, weight: "500" } } }, y: { grid: { color: "rgba(0,0,0,0.03)" }, border: { display: false }, ticks: { color: "#A89A8B", font: { family: "Plus Jakarta Sans", size: 11 } } } },
  };
  return (
    <Card padding="p-5">
      <div className="flex items-center justify-between mb-5">
        <div><h3 className="text-sm font-bold text-taupe-900">Évolution mensuelle</h3><p className="text-xs text-taupe-400 mt-0.5">Signalements vs adoptions</p></div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-ambre-400" /><span className="text-[11px] text-taupe-400 font-medium">Signalements</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-canard-600" /><span className="text-[11px] text-taupe-400 font-medium">Adoptions</span></div>
        </div>
      </div>
      <div className="h-56"><Line data={data} options={options} /></div>
    </Card>
  );
}
