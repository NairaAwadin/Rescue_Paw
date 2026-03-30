import React from "react";
import SignalementForm from "../components/signalement/SignalementForm";

export default function SignalementPage({ onExit }) {
  return (
    <div className="min-h-screen bg-beige-50 flex items-center justify-center pt-24 pb-16 px-6">
      <SignalementForm onSuccess={onExit} />
    </div>
  );
}
