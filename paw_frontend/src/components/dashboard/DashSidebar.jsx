import React from "react";
import { LayoutDashboard, Map, BarChart3, FileText, Settings, LogOut, PawPrint, Download } from "lucide-react";

const navItems = [
  { id: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
  { id: "map", label: "Carte", icon: Map },
  { id: "stats", label: "Statistiques", icon: BarChart3 },
  { id: "reports", label: "Signalements", icon: FileText },
];

export default function DashSidebar({ activeTab, onTabChange, onLogout }) {
  return (
    <aside className="w-64 bg-white border-r border-beige-200 flex flex-col h-full shrink-0">
      <div className="p-5 border-b border-beige-200">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-canard-600 rounded-xl flex items-center justify-center"><PawPrint size={20} strokeWidth={1.5} className="text-white" /></div>
          <div><p className="text-sm font-bold text-taupe-900">Rescue<span className="text-canard-600">Paw</span></p><p className="text-[10px] text-taupe-400 font-medium">Observatoire</p></div>
        </div>
      </div>
      <nav className="flex-1 p-3">
        <div className="space-y-0.5">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => onTabChange(id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${activeTab === id ? "bg-canard-50 text-canard-700" : "text-taupe-600 hover:bg-beige-50"}`}>
              <Icon size={18} strokeWidth={1.5} />{label}
            </button>
          ))}
        </div>
      </nav>
      <div className="p-3 border-t border-beige-200 space-y-0.5">
        <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-taupe-600 hover:bg-beige-50 transition-all cursor-pointer">
          <Download size={18} strokeWidth={1.5} />Export données
        </button>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-taupe-600 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer">
          <LogOut size={18} strokeWidth={1.5} />Déconnexion
        </button>
      </div>
    </aside>
  );
}
