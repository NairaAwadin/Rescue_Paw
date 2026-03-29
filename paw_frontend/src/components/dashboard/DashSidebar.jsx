import React from "react";
import { LayoutDashboard, Map, BarChart3, FileText, LogOut, PawPrint, Download } from "lucide-react";

const navItems = [
  { id: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
  { id: "map", label: "Carte", icon: Map },
  { id: "stats", label: "Statistiques", icon: BarChart3 },
  { id: "reports", label: "Signalements", icon: FileText },
];

export default function DashSidebar({ activeTab, onTabChange, onLogout }) {
  return (
    <aside className="w-64 bg-white border-r border-beige-200 flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-beige-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-canard-600 rounded-xl flex items-center justify-center">
            <PawPrint size={20} strokeWidth={1.5} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-taupe-900">
              Rescue<span className="text-canard-600">Paw</span>
            </p>
            <p className="text-[10px] text-taupe-400 font-medium">Observatoire</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === id
                  ? "bg-canard-50 text-canard-700"
                  : "text-taupe-600 hover:bg-beige-50"
              }`}
            >
              <Icon size={18} strokeWidth={1.5} />{label}
            </button>
          ))}
        </div>
      </nav>

      {/* Footer actions */}
      <div className="p-4 border-t border-beige-200 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-taupe-600 hover:bg-beige-50 transition-all cursor-pointer">
          <Download size={18} strokeWidth={1.5} />Export données
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-taupe-600 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
        >
          <LogOut size={18} strokeWidth={1.5} />Déconnexion
        </button>
      </div>
    </aside>
  );
}
