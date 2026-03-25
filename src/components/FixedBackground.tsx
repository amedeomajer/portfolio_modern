"use client";

import { useBackground, BackgroundType } from "@/context/BackgroundContext";
import Waves from "./ui/Waves";
import Aurora from "./ui/Aurora";
import { LiquidChrome } from "./ui/LiquidChrome";
import LightRays from "./ui/LightRays";
import GradientBlinds from "./ui/GradientBlinds";

const backgrounds: Record<BackgroundType, React.ReactNode> = {
  waves: (
    <Waves
      lineColor="rgba(255, 255, 255, 0.08)"
      backgroundColor="#0a0a0a"
      waveSpeedX={0.02}
      waveSpeedY={0.01}
      waveAmpX={28}
      waveAmpY={14}
      xGap={12}
      yGap={36}
      friction={0.9}
      tension={0.01}
      maxCursorMove={90}
    />
  ),
  aurora: (
    <Aurora
      colorStops={["#0a0a0a", "#111726", "#0f1a2d"]}
      amplitude={0.85}
      blend={0.5}
    />
  ),
  liquidChrome: (
    <LiquidChrome
      baseColor={[0.05, 0.05, 0.05]}
      speed={0.1}
      amplitude={0.24}
      interactive={false}
    />
  ),
  lightRays: (
    <LightRays
      raysColor="#ffffff"
      raysOrigin="top-center"
      raysSpeed={0.35}
      lightSpread={1.0}
      rayLength={380}
      fadeDistance={0.62}
      saturation={0.75}
      noiseAmount={0.02}
      mouseInfluence={0.05}
    />
  ),
  gradientBlinds: (
    <GradientBlinds
      gradientColors={["#525252", "#0b1425"]}
      angle={0}
      noise={0.2}
      blindCount={12}
      blindMinWidth={60}
      spotlightRadius={0.5}
      spotlightSoftness={1}
      spotlightOpacity={0.35}
      mouseDampening={0.15}
      distortAmount={0}
      shineDirection="left"
      mixBlendMode="soft-light"
    />
  ),
};

const FixedBackground = () => {
  const { background, accessibilityMode } = useBackground();

  if (accessibilityMode) {
    return null;
  }

  return <div className="fixed inset-0 z-0 opacity-55">{backgrounds[background]}</div>;
};

export default FixedBackground;
