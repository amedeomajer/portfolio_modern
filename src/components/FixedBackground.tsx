'use client';

import LiquidChrome from './ui/LiquidChrome';

const FixedBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      <LiquidChrome
        baseColor={[0.05, 0.05, 0.05]}
        speed={0.15}
        amplitude={0.4}
        frequencyX={2.5}
        frequencyY={2.5}
        interactive={true}
      />
    </div>
  );
};

export default FixedBackground;
