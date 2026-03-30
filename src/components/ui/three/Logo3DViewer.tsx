"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { cn } from "@/lib/utils";
import { LogoModel } from "./LogoModel";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";

export interface Logo3DViewerProps {
  modelPath?: "/am_logo_1.glb" | "/am_logo_2.glb";
  autoRotate?: boolean;
  rotationSpeed?: number;
  enableDrag?: boolean;
  enableHover?: boolean;
  enableFloat?: boolean;
  className?: string;
  scale?: number;
}

export const Logo3DViewer = ({
  modelPath = "/am_logo_1.glb",
  autoRotate = true,
  rotationSpeed = 0.005,
  enableDrag = false,
  enableHover = true,
  enableFloat = true,
  className = "",
  scale = 1,
}: Logo3DViewerProps) => {
  const { hasWebGL, isMobile, isLoading } = useDeviceCapability();

  // Show nothing while checking capabilities
  if (isLoading) {
    return (
      <div className={cn("three-canvas-container", className)}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-pulse bg-white/5 rounded-lg w-32 h-32" />
        </div>
      </div>
    );
  }

  // Fallback if WebGL not supported
  if (!hasWebGL) {
    return (
      <div className={cn("three-canvas-container", className)}>
        <div className="w-full h-full flex items-center justify-center text-muted">
          3D not supported
        </div>
      </div>
    );
  }

  // Adjust settings for mobile
  const mobileAdjustedScale = isMobile ? scale * 0.8 : scale;
  const dpr: [number, number] = isMobile ? [1, 1.5] : [1, 2];

  return (
    <div className={cn("three-canvas-container", className)}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={dpr}
        gl={{
          antialias: true,
          alpha: true, // Transparent background
          powerPreference: isMobile ? "low-power" : "high-performance",
        }}
      >
        {/* Lighting Setup */}
        {/* Base ambient light - prevents pure black shadows */}
        <ambientLight intensity={0.5} color="#ffffff" />

        {/* Key light - main illumination from top-right */}
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.2}
          color="#ffffff"
        />

        {/* Fill light - soften shadows from bottom-left */}
        <pointLight position={[-10, -10, -5]} intensity={0.4} color="#a0a0a0" />

        {/* Rim light - edge highlight for depth */}
        <pointLight position={[0, 5, -10]} intensity={0.3} color="#ffffff" />

        {/* Optional: OrbitControls for drag interaction */}
        {enableDrag && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={autoRotate}
            autoRotateSpeed={rotationSpeed * 100}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
          />
        )}

        {/* Model with Suspense for loading */}
        <Suspense fallback={null}>
          <LogoModel
            path={modelPath}
            autoRotate={!enableDrag && autoRotate}
            rotationSpeed={rotationSpeed}
            enableHover={enableHover}
            enableFloat={enableFloat}
            scale={mobileAdjustedScale}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Logo3DViewer;
