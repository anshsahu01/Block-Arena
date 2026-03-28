import { useState } from "react";
import { AuthForm } from "../components/AuthForm.jsx";
import { AUTH_MODES } from "../utils/constants.js";

export const AuthPage = ({ onAuth }) => {
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthSubmit = async (mode, payload) => {
    setStatusMessage("");
    setIsLoading(true);

    try {
      await onAuth(mode, payload);
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-on-surface grid place-items-center px-4">
      <AuthForm
        onSubmit={handleAuthSubmit}
        statusMessage={statusMessage}
        isLoading={isLoading}
      />
    </main>
  );
};
