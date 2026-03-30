import React, { useState } from "react";
import { ShieldCheck, Lock, Trash2 } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";

export default function ConsentStep({ onAccept }) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto px-6">

      <div className="w-16 h-16 bg-canard-50 rounded-2xl flex items-center justify-center">
        <ShieldCheck size={32} strokeWidth={1.5} className="text-canard-600" />
      </div>

      <div className="h-6"></div>

      <h2 className="text-2xl font-bold text-taupe-900 text-center">
        Vos données, notre engagement
      </h2>

      <div className="h-4"></div>

      <p className="text-taupe-600 text-center max-w-lg leading-relaxed text-sm">
        Avant de commencer, voici comment nous utilisons vos réponses pour vous recommander le compagnon idéal
      </p>

      <div className="h-8"></div>

      <Card className="w-full" padding="p-8">
        <div className="flex items-start gap-4 mb-8">
          <Lock size={20} strokeWidth={1.5} className="text-canard-600 shrink-0 mt-1" />
          <div>
            <p className="text-sm font-semibold text-taupe-900 mb-2">Données traitées localement</p>
            <p className="text-xs text-taupe-600 leading-relaxed">
              Vos réponses sont analysées par notre algorithme de matching et ne sont jamais partagées avec des tiers
            </p>
          </div>
        </div>

        <div className="h-4"></div>

        <div className="flex items-start gap-4">
          <Trash2 size={20} strokeWidth={1.5} className="text-canard-600 shrink-0 mt-1" />
          <div>
            <p className="text-sm font-semibold text-taupe-900 mb-2">Droit à l'oubli</p>
            <p className="text-xs text-taupe-600 leading-relaxed">
              Vous pouvez demander la suppression de votre profil et de toutes vos données à tout moment
            </p>
          </div>
        </div>
      </Card>

      <div className="h-8"></div>

      <label className="flex items-start gap-3 w-full cursor-pointer max-w-lg">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-1 w-5 h-5 rounded-md border-2 border-beige-300 accent-[#2B6B4F] cursor-pointer shrink-0"
        />
        <span className="text-xs text-taupe-600 leading-relaxed">
          J'accepte que mes réponses soient utilisées pour générer des recommandations personnalisées, conformément à la{" "}
          <span className="text-canard-600 font-medium">politique de confidentialité</span>.
        </span>
      </label>

      <div className="h-6"></div>

      <Button size="lg" disabled={!accepted} onClick={onAccept}>
        Commencer le quiz
      </Button>
    </div>
  );
}
