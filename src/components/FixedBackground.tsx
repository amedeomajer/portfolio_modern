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
      lineColor="rgba(255, 255, 255, 0.15)"
      backgroundColor="#0a0a0a"
      waveSpeedX={0.02}
      waveSpeedY={0.01}
      waveAmpX={40}
      waveAmpY={20}
      xGap={12}
      yGap={36}
      friction={0.9}
      tension={0.01}
      maxCursorMove={120}
    />
  ),
  aurora: (
    <Aurora
      colorStops={["#0a0a0a", "#1a1a2e", "#16213e"]}
      amplitude={1.2}
      blend={0.6}
    />
  ),
  liquidChrome: (
    <LiquidChrome
      baseColor={[0.05, 0.05, 0.05]}
      speed={0.15}
      amplitude={0.4}
      interactive={true}
    />
  ),
  lightRays: (
    <LightRays
      raysColor="#ffffff"
      raysOrigin="top-center"
      raysSpeed={0.5}
      lightSpread={1.2}
      rayLength={500}
      fadeDistance={0.8}
    />
  ),
  gradientBlinds: (
    <GradientBlinds
      gradientColors={["#a3a3a3", "#080029"]}
      angle={0}
      noise={0.5}
      blindCount={16}
      blindMinWidth={60}
      spotlightRadius={0.5}
      spotlightSoftness={1}
      spotlightOpacity={0.6}
      mouseDampening={0.15}
      distortAmount={0}
      shineDirection="left"
      mixBlendMode="lighten"
    />
  ),
};

const FixedBackground = () => {
  const { background, accessibilityMode } = useBackground();

  if (accessibilityMode) {
    return null;
  }

  return <div className="fixed inset-0 z-0">{backgrounds[background]}</div>;
};

export default FixedBackground;
