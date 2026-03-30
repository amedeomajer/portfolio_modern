'use client';

import { useState, useEffect } from 'react';

interface DeviceCapability {
  hasWebGL: boolean;
  isMobile: boolean;
  prefersReducedMotion: boolean;
  isLoading: boolean;
}

/**
 * Hook to detect device capabilities for 3D rendering
 * - WebGL support
 * - Mobile device detection
 * - Reduced motion preference
 */
export const useDeviceCapability = (): DeviceCapability => {
  const [capability, setCapability] = useState<DeviceCapability>({
    hasWebGL: true, // Assume true until checked
    isMobile: false,
    prefersReducedMotion: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check WebGL support
    const checkWebGL = (): boolean => {
      try {
        const canvas = document.createElement('canvas');
        const gl =
          canvas.getContext('webgl') ||
          canvas.getContext('experimental-webgl');
        return !!gl;
      } catch {
        return false;
      }
    };

    // Check if mobile device
    const checkMobile = (): boolean => {
      return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
        window.innerWidth < 768;
    };

    // Check reduced motion preference
    const checkReducedMotion = (): boolean => {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    };

    setCapability({
      hasWebGL: checkWebGL(),
      isMobile: checkMobile(),
      prefersReducedMotion: checkReducedMotion(),
      isLoading: false,
    });
  }, []);

  return capability;
};

export default useDeviceCapability;
