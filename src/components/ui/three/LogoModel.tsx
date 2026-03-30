'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export interface LogoModelProps {
  path: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
  enableHover?: boolean;
  enableFloat?: boolean;
  scale?: number;
  position?: [number, number, number];
}

export const LogoModel = ({
  path,
  autoRotate = true,
  rotationSpeed = 0.005,
  enableHover = true,
  enableFloat = true,
  scale = 1,
  position = [0, 0, 0],
}: LogoModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Load GLB model
  const { scene } = useGLTF(path);

  // Clone the scene to avoid issues with reusing the same geometry
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  // Animation loop - runs every frame
  useFrame((state) => {
    if (!groupRef.current) return;

    // Auto-rotation (faster when hovered)
    if (autoRotate) {
      const speed = hovered ? rotationSpeed * 3 : rotationSpeed;
      groupRef.current.rotation.y += speed;
    }

    // Gentle floating effect
    if (enableFloat) {
      const floatOffset = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
      groupRef.current.position.y = position[1] + floatOffset;
    }
  });

  // Smooth scale transition
  const targetScale = hovered && enableHover ? scale * 1.1 : scale;

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={targetScale}
      onPointerOver={(e) => {
        if (enableHover) {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => {
        if (enableHover) {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }
      }}
    >
      <primitive object={clonedScene} />
    </group>
  );
};

// Preload both logo models for better performance
useGLTF.preload('/am_logo_1.glb');
useGLTF.preload('/am_logo_2.glb');

export default LogoModel;
