import React from "react";
import { Stethoscope, TreePine, Home } from "lucide-react";
import Card from "../ui/Card";
import ScoreGauge from "../ui/ScoreGauge";

export default function WellbeingCard({ territoire }) {
  if (!territoire) return null;
  const { ville, zip_code, well_being_score, osm_details = {}, score_factors = [] } = territoire;

  const infraItems = [
    { icon: Stethoscope, label: "Vétérinaires", count: osm_details.vets || 0 },
    { icon: TreePine, label: "Parcs", count: osm_details.parks || 0 },
    { icon: Home, label: "Refuges", count: osm_details.shelters || 0 },
    { icon: TreePine, label: "Forêts", count: osm_details.forests || 0 },
  ];

  return (
    <Card className="w-full max-w-md mx-auto" padding="p-0">
      {/* Header */}
      <div className="p-6 pb-5 border-b border-beige-200/40">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-taupe-900">{ville}</h3>
            <p className="text-sm text-taupe-400 mt-1">{zip_code}</p>
          </div>
          <ScoreGauge score={well_being_score} size={72} />
        </div>
      </div>

      {/* Infra */}
      <div className="p-6 pb-5">
        <p className="text-[11px] font-semibold text-taupe-400 uppercase tracking-wider mb-4">Infrastructures</p>
        <div className="grid grid-cols-2 gap-3">
          {infraItems.map(({ icon: Icon, label, count }) => (
            <div key={label} className="flex flex-col items-center gap-2 bg-beige-100 rounded-xl px-3 py-4 text-center">
              <Icon size={18} strokeWidth={1.5} className="text-canard-600" />
              <p className="text-base font-bold text-taupe-800">{count}</p>
              <p className="text-[11px] text-taupe-600">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Factors */}
      {score_factors.length > 0 && (
        <div className="px-6 pb-6">
          <p className="text-[11px] font-semibold text-taupe-400 uppercase tracking-wider mb-3">Facteurs clés</p>
          <div className="flex flex-wrap gap-2">
            {score_factors.map((f, i) => (
              <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-beige-100 text-taupe-600">
                {f}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
