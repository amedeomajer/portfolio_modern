"use client";

import { MotionValue } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUniversalAccess } from "@fortawesome/free-solid-svg-icons";
import { useBackground } from "@/context/BackgroundContext";

interface AccessibilityToggleProps {
  isHovered?: MotionValue<number>;
}

const AccessibilityToggle = ({ isHovered: _isHovered }: AccessibilityToggleProps) => {
  const { accessibilityMode, toggleAccessibilityMode } = useBackground();

  return (
    <button
      onClick={toggleAccessibilityMode}
      className={`flex items-center justify-center w-full h-full transition-colors ${
        accessibilityMode ? "text-green-400" : "text-white"
      }`}
      aria-label={accessibilityMode ? "Disable accessibility mode" : "Enable accessibility mode"}
      aria-pressed={accessibilityMode}
    >
      <FontAwesomeIcon icon={faUniversalAccess} className="w-5 h-5" />
    </button>
  );
};

export default AccessibilityToggle;
