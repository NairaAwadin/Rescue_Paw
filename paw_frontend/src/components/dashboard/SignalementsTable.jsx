import React from "react";
import { MapPin, Dog, Cat, HelpCircle } from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { STATUS_CONFIG } from "../../utils/constants";

export default function SignalementsTable({ signalements }) {
  const speciesIcons = { DOG: Dog, CAT: Cat, OTHER: HelpCircle };
  return (
    <Card padding="p-0">
      <div className="px-6 py-6 border-b border-beige-200">
        <h3 className="text-sm font-bold text-taupe-900">Derniers signalements</h3>
        <p className="text-xs text-taupe-400 mt-1">{signalements.length} signalements récents</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-beige-200">
              <th className="text-left px-6 py-4 text-[11px] font-semibold text-taupe-400 uppercase tracking-wider">Type</th>
              <th className="text-left px-6 py-4 text-[11px] font-semibold text-taupe-400 uppercase tracking-wider">Localisation</th>
              <th className="text-left px-6 py-4 text-[11px] font-semibold text-taupe-400 uppercase tracking-wider">Date</th>
              <th className="text-left px-6 py-4 text-[11px] font-semibold text-taupe-400 uppercase tracking-wider">Statut</th>
            </tr>
          </thead>
          <tbody>
            {signalements.map((s) => {
              const statusConf = STATUS_CONFIG[s.status] || STATUS_CONFIG.SIGNALED;
              const Icon = speciesIcons[s.species] || HelpCircle;
              const typeLabel = s.type_signalement === "FOUND" ? "Trouvé" : "Abandon";
              return (
                <tr key={s.id} className="border-b border-beige-200 last:border-0 hover:bg-beige-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-beige-100 rounded-lg flex items-center justify-center"><Icon size={16} strokeWidth={1.5} className="text-taupe-600" /></div>
                      <div>
                        <span className="text-sm font-medium text-taupe-900 block">{typeLabel}</span>
                        {s.race && <span className="text-[11px] text-taupe-400">{s.race}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-taupe-600"><MapPin size={13} strokeWidth={1.5} />{s.territoire_name || s.adresse_approximative}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-taupe-400">{new Date(s.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</td>
                  <td className="px-6 py-4"><Badge className={statusConf.color}>{statusConf.label}</Badge></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
