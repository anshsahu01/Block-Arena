import { useState } from "react";
import { ColorPicker } from "../components/ColorPicker.jsx";
import { randomHexColor } from "../utils/helpers.js";

export const ColorPage = ({ username, onColorSubmit }) => {
  const [color, setColor] = useState(randomHexColor);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");
    setIsLoading(true);

    try {
      await onColorSubmit(color);
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-on-surface grid place-items-center px-4">
      <ColorPicker
        color={color}
        onColorChange={setColor}
        onSubmit={handleSubmit}
        username={username}
        statusMessage={statusMessage}
        isLoading={isLoading}
      />
    </main>
  );
};
