import React from "react";
import { CheckCircle, Loader2 } from "lucide-react"; // déjà dispo avec shadcn

interface SpinnerProps {
  status?: "idle" | "loading" | "success";
}

export const Spinner: React.FC<SpinnerProps> = ({ status = "idle" }) => {
  switch (status) {
    case "loading":
      return <Loader2 className="animate-spin text-blue-500 w-5 h-5" />;
    case "success":
      return <CheckCircle className="text-green-500 w-5 h-5" />;
    default:
      return <div className="w-5 h-5" />; // espace réservé
  }
};
