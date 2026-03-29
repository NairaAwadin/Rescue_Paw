import React, { useState } from "react";
import { ShieldCheck, Lock, Trash2 } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";

export default function ConsentStep({ onAccept }) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="flex flex-col items-center max-w-md mx-auto">

      <div className="w-16 h-16 bg-canard-50 rounded-2xl flex items-center justify-center mb-8">
        <ShieldCheck size={32} strokeWidth={1.5} className="text-canard-600" />
      </div>

      <h2 className="text-2xl font-bold text-taupe-900 mb-3 text-center">
        Vos données, notre engagement
      </h2>
      <p className="text-taupe-600 text-center max-w-sm mb-10 leading-relaxed">
        Avant de commencer, voici comment nous utilisons vos réponses pour vous recommander le compagnon idéal.
      </p>

      <Card className="w-full mb-10" padding="p-7">
        <div className="space-y-6">
          <div className="flex gap-4">
            <Lock size={18} strokeWidth={1.5} className="text-canard-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-taupe-900">Données traitées localement</p>
              <p className="text-xs text-taupe-400 mt-1 leading-relaxed">
                Vos réponses sont analysées par notre algorithme de matching et ne sont jamais partagées avec des tiers.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Trash2 size={18} strokeWidth={1.5} className="text-canard-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-taupe-900">Droit à l'oubli</p>
              <p className="text-xs text-taupe-400 mt-1 leading-relaxed">
                Vous pouvez demander la suppression de votre profil et de toutes vos données à tout moment.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <label className="flex items-start gap-3 w-full mb-8 cursor-pointer">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-0.5 w-5 h-5 rounded-md border-2 border-beige-300 accent-[#2B6B4F] cursor-pointer"
        />
        <span className="text-sm text-taupe-600 leading-relaxed">
          J'accepte que mes réponses soient utilisées pour générer des recommandations personnalisées, conformément à la{" "}
          <span className="text-canard-600 font-medium">politique de confidentialité</span>.
        </span>
      </label>

      <Button size="lg" disabled={!accepted} onClick={onAccept}>
        Commencer le quiz
      </Button>
    </div>
  );
}
