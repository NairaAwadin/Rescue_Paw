import React from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { MAP_TILE_URL, MAP_ATTRIBUTION, STATUS_CONFIG } from "../../utils/constants";

const statusColors = { SIGNALED: "#A89A8B", RESCUED: "#E8AA4C", ADOPTABLE: "#2B6B4F" };

export default function SignalementsMap({ signalements }) {
  return (
    <Card padding="p-0" className="overflow-hidden">
      <div className="px-6 py-6 border-b border-beige-200 flex items-center justify-between">
        <div><h3 className="text-sm font-bold text-taupe-900">Carte des signalements</h3><p className="text-xs text-taupe-400 mt-1">Répartition géographique</p></div>
        <div className="flex items-center gap-4">
          {Object.entries(STATUS_CONFIG).map(([key, conf]) => (
            <div key={key} className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: statusColors[key] }} /><span className="text-[10px] text-taupe-400 font-medium">{conf.label}</span></div>
          ))}
        </div>
      </div>
      <MapContainer center={[46.603, 2.888]} zoom={6} scrollWheelZoom style={{ height: "360px", width: "100%" }} className="z-0">
        <TileLayer url={MAP_TILE_URL} attribution={MAP_ATTRIBUTION} />
        {signalements.map((s) => (
          s.latitude && s.longitude && (
            <CircleMarker key={s.id} center={[s.latitude, s.longitude]} radius={8}
              pathOptions={{ fillColor: statusColors[s.status] || "#a8a29e", fillOpacity: 0.7, color: "#fff", weight: 2 }}>
              <Popup>
                <div className="p-1">
                  <p className="font-semibold text-sm">{s.type_signalement === "FOUND" ? "Animal trouvé" : "Abandon"}</p>
                  <p className="text-xs text-gray-500">{s.territoire_name || s.adresse_approximative}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_CONFIG[s.status]?.color}`}>{STATUS_CONFIG[s.status]?.label}</span>
                </div>
              </Popup>
            </CircleMarker>
          )
        ))}
      </MapContainer>
    </Card>
  );
}
