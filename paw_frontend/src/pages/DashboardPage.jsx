import React, { useState } from "react";
import { AlertTriangle, Activity, Heart, Clock } from "lucide-react";
import DashSidebar from "../components/dashboard/DashSidebar";
import KpiCard from "../components/dashboard/KpiCard";
import MonthlyChart from "../components/dashboard/MonthlyChart";
import SpeciesChart from "../components/dashboard/SpeciesChart";
import SignalementsTable from "../components/dashboard/SignalementsTable";
import SignalementsMap from "../components/dashboard/SignalementsMap";
import { mockKpis, mockMonthlyStats, mockSpeciesBreakdown, mockSignalements } from "../data/mockData";

export default function DashboardPage({ onLogout, onNavigate }) {
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = () => {
    onLogout();
    onNavigate("home");
  };

  return (
    <div className="flex h-screen bg-beige-50 overflow-hidden">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <DashSidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 lg:p-10">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-taupe-900">Observatoire</h1>
            <p className="text-sm text-taupe-400 mt-2">Vue d'ensemble du bien-être animal — lecture seule</p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <KpiCard label="Signalements cette semaine" value={mockKpis.signalements_semaine} variation={mockKpis.signalements_variation} icon={AlertTriangle} />
            <KpiCard label="Taux de prise en charge" value={mockKpis.taux_prise_en_charge} suffix="%" variation={mockKpis.taux_variation} icon={Activity} />
            <KpiCard label="Adoptions ce mois" value={mockKpis.adoptions_mois} variation={mockKpis.adoptions_variation} icon={Heart} />
            <KpiCard label="En attente de placement" value={mockKpis.animaux_en_attente} icon={Clock} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
            <div className="lg:col-span-2">
              <MonthlyChart stats={mockMonthlyStats} />
            </div>
            <SpeciesChart breakdown={mockSpeciesBreakdown} />
          </div>

          {/* Map + Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <SignalementsMap signalements={mockSignalements} />
            <SignalementsTable signalements={mockSignalements} />
          </div>
        </div>
      </main>
    </div>
  );
}
