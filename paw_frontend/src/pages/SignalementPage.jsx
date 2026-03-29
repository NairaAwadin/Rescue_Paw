import React from "react";
import SignalementForm from "../components/signalement/SignalementForm";

export default function SignalementPage({ onExit }) {
  return (
    <div className="min-h-screen bg-beige-50 pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <SignalementForm onSuccess={onExit} />
      </div>
    </div>
  );
}
