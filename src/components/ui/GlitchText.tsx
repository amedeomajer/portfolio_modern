"use client";

import { CSSProperties } from "react";

interface GlitchTextProps {
  children: any;
  speed?: number;
  enableShadows?: boolean;
  enableOnHover?: boolean;
  className?: string;
}

const GlitchText = ({
  children,
  speed = 1,
  enableShadows = true,
  enableOnHover = true,
  className = "",
}: GlitchTextProps) => {
  const inlineStyles: CSSProperties & { [key: string]: string } = {
    "--after-duration": `${speed * 3}s`,
    "--before-duration": `${speed * 2}s`,
    "--after-shadow": enableShadows
      ? "-3px 0 rgba(255, 255, 255, 0.3)"
      : "none",
    "--before-shadow": enableShadows
      ? "3px 0 rgba(255, 255, 255, 0.3)"
      : "none",
  };

  const hoverClass = enableOnHover ? "enable-on-hover" : "";

  return (
    <div
      className={`glitch ${hoverClass} ${className}`}
      style={inlineStyles}
      data-text={children}
    >
      {children}
    </div>
  );
};

export default GlitchText;
