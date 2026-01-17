"use client";

import Waves from "./ui/Waves";

const FixedBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
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
    </div>
  );
};

export default FixedBackground;
