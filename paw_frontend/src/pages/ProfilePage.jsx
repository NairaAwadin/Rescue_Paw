import React, { useState } from "react";
import { User, Mail, MapPin, Shield, Trash2, ArrowLeft, LogOut } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage({ onNavigate }) {
  const { user, isAdoptant, isObservateur, logout } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    // api.deleteProfil(user.id) — quand backend prêt
    logout();
    onNavigate("home");
  };

  return (
    <div className="min-h-screen bg-beige-50 pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <button onClick={() => onNavigate("home")} className="flex items-center gap-2 text-sm font-medium text-taupe-600 hover:text-taupe-900 transition-colors mb-12 cursor-pointer">
          <ArrowLeft size={18} strokeWidth={1.5} /> Retour
        </button>

        <h1 className="text-3xl font-bold text-taupe-900 mb-12">Mon profil</h1>

        {/* User info */}
        <Card padding="p-8" className="mb-8">
          <div className="flex items-center gap-8 mb-8">
            <div className="w-16 h-16 bg-canard-50 rounded-2xl flex items-center justify-center">
              <User size={32} strokeWidth={1.5} className="text-canard-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-taupe-900">{user?.username || "Utilisateur"}</h2>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={isAdoptant ? "bg-ambre-50 text-ambre-800" : "bg-canard-50 text-canard-800"}>
                  {isAdoptant ? "Adoptant" : "Observateur"}
                </Badge>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="flex items-center gap-4 text-base">
              <Mail size={18} strokeWidth={1.5} className="text-taupe-400" />
              <span className="text-taupe-600">{user?.email || "email@exemple.fr"}</span>
            </div>
          </div>
        </Card>

        {/* Quick actions */}
        {isAdoptant && (
          <Card padding="p-8" className="mb-8">
            <h3 className="text-sm font-semibold text-taupe-400 uppercase tracking-wider mb-8">Actions rapides</h3>
            <div className="space-y-4">
              <Button variant="outline" size="md" className="w-full justify-start" onClick={() => onNavigate("quiz")}>
                Refaire le quiz d'adoption
              </Button>
              <Button variant="outline" size="md" className="w-full justify-start" onClick={() => onNavigate("signalement")}>
                Signaler un animal
              </Button>
            </div>
          </Card>
        )}

        {isObservateur && (
          <Card padding="p-8" className="mb-8">
            <h3 className="text-sm font-semibold text-taupe-400 uppercase tracking-wider mb-8">Accès observatoire</h3>
            <Button variant="primary" size="md" className="w-full" onClick={() => onNavigate("dashboard")}>
              Accéder au dashboard
            </Button>
          </Card>
        )}

        {/* RGPD Section */}
        <Card padding="p-8" className="mb-8">
          <div className="flex items-center gap-4 mb-8">
            <Shield size={18} strokeWidth={1.5} className="text-canard-600" />
            <h3 className="text-sm font-semibold text-taupe-900">Vie privée & RGPD</h3>
          </div>
          <p className="text-sm text-taupe-600 mb-8">
            Conformément au RGPD, vous pouvez supprimer votre profil et toutes vos données à tout moment. Cette action est irréversible.
          </p>
          {!showDeleteConfirm ? (
            <Button variant="ghost" size="sm" icon={Trash2} className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => setShowDeleteConfirm(true)}>
              Supprimer mon profil
            </Button>
          ) : (
            <div className="bg-red-50 rounded-xl p-6">
              <p className="text-sm font-semibold text-red-700 mb-6">Êtes-vous sûr ? Cette action est irréversible.</p>
              <div className="flex gap-4">
                <Button variant="danger" size="sm" onClick={handleDelete}>Oui, supprimer</Button>
                <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(false)}>Annuler</Button>
              </div>
            </div>
          )}
        </Card>

        {/* Logout */}
        <Button variant="ghost" size="md" icon={LogOut} className="w-full text-taupe-400 mb-12" onClick={() => { logout(); onNavigate("home"); }}>
          Se déconnecter
        </Button>
      </div>
    </div>
  );
}
