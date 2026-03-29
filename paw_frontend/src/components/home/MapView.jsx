import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import WellbeingCard from "./WellbeingCard";
import { MAP_TILE_URL, MAP_ATTRIBUTION } from "../../utils/constants";

const createIcon = (score) => {
  const colors = { A:"#2d6a4f", B:"#788565", C:"#f18d46", D:"#df5c17", E:"#ef4444" };
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="width:36px;height:36px;background:${colors[score]||colors.C};border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.15);border:3px solid white"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="4" r="2"/><circle cx="4.5" cy="9" r="2"/><circle cx="17.5" cy="9" r="2"/><path d="M12 19c-2.5 0-5-2.5-5-5 0-1.5.5-3 2-4s3.5-1.5 3-1.5 1.5.5 3 1.5 2 2.5 2 4c0 2.5-2.5 5-5 5z"/></svg></div>`,
    iconSize: [36, 36], iconAnchor: [18, 18], popupAnchor: [0, -22],
  });
};

export default function MapView({ territoire = null }) {
  // Si pas de territoire, ne pas afficher la carte
  if (!territoire) return null;
  
  const mapCenter = [territoire.latitude, territoire.longitude];
  const mapZoom = 9;

  return (
    <div className="rounded-[var(--radius-bento)] overflow-hidden shadow-[var(--shadow-bento)] border border-border-light">
      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        scrollWheelZoom 
        style={{ height: "450px", width: "100%" }} 
        className="z-0"
      >
        <TileLayer url={MAP_TILE_URL} attribution={MAP_ATTRIBUTION} />
        <Marker position={[territoire.latitude, territoire.longitude]} icon={createIcon(territoire.well_being_score)}>
          <Popup maxWidth={360} autoClose={false}><WellbeingCard territoire={territoire} /></Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
