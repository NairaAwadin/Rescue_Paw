import React from "react";
import SignalementForm from "../components/signalement/SignalementForm";

export default function SignalementPage({ onExit }) {
  return (
    <div className="min-h-screen bg-beige-50 pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        <SignalementForm onSuccess={onExit} />
      </div>
    </div>
  );
}
