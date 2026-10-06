import React, { useState, useEffect } from 'react';

interface InitialLoaderProps {
  onComplete: () => void;
}

export const InitialLoader: React.FC<InitialLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Smooth, rapid preloader progression (matching ~2.2s reference video)
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 2;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setFadeOut(true), 200);
          setTimeout(() => onComplete(), 750);
          return 100;
        }
        return next;
      });
    }, 35);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-[#080A0F] flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ease-out select-none ${
        fadeOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* 1. Volumetric Warm Orange/Red Radial Core (Matching KTM Video Reference) */}
      <div className="absolute w-[500px] h-[300px] bg-gradient-to-r from-orange-600/25 via-red-600/30 to-amber-500/20 rounded-full blur-[130px] pointer-events-none" />

      {/* 2. Main EKG Heartbeat & Glowing Logo Stage */}
      <div className="relative z-10 flex flex-col items-center max-w-xl w-full px-6">
        
        {/* Animated SVG: Heartbeat EKG Pulse into Glowing Outline Brand */}
        <div className="w-full relative flex items-center justify-center py-6">
          <svg
            viewBox="0 0 1000 180"
            className="w-full h-auto overflow-visible select-none"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Intense Neon Orange/Red Glow Filter */}
              <filter id="ktmNeonGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="4" result="blur1" />
                <feGaussianBlur stdDeviation="12" result="blur2" />
                <feGaussianBlur stdDeviation="24" result="blur3" />
                <feMerge>
                  <feMergeNode in="blur3" />
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Glowing KTM Gradient (Orange-Red) */}
              <linearGradient id="ktmGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF3800" />
                <stop offset="45%" stopColor="#FF6200" />
                <stop offset="60%" stopColor="#FF8500" />
                <stop offset="100%" stopColor="#FF3800" />
              </linearGradient>

              {/* Heartbeat Pulse Head Spark */}
              <radialGradient id="sparkHead">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#FFA500" />
                <stop offset="100%" stopColor="#FF3800" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Glowing EKG Left Thunder Line (Stops 100px BEFORE text, zero overlap) */}
            <path
              d="M 30,92 L 120,92 L 135,92 L 150,55 L 165,130 L 180,35 L 195,120 L 210,92 L 250,92"
              fill="none"
              stroke="url(#ktmGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#ktmNeonGlow)"
              className="ktm-ekg-path"
            />

            {/* Glowing Outline NEXORA Letterforms (Pure Glowing Borders, Pristine Clearance) */}
            <text
              x="500"
              y="94"
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="'Bebas Neue', sans-serif"
              fontSize="76"
              letterSpacing="0.28em"
              fill="none"
              stroke="url(#ktmGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#ktmNeonGlow)"
              className="ktm-neon-text"
            >
              NEXORA
            </text>

            {/* Trailing EKG Right Thunder Line (Starts 100px AFTER text, zero overlap) */}
            <path
              d="M 750,92 L 790,92 L 805,65 L 820,120 L 835,35 L 850,130 L 865,92 L 970,92"
              fill="none"
              stroke="url(#ktmGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#ktmNeonGlow)"
              className="ktm-ekg-path"
            />
          </svg>
        </div>

        {/* Minimalist Razor-Thin Glowing Progress Bar (Below the Name) */}
        <div className="w-56 sm:w-72 h-[2.5px] bg-white/10 rounded-full overflow-hidden mt-2 relative">
          <div
            className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-red-500 transition-all duration-75 relative shadow-[0_0_14px_rgba(255,98,0,1)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Subtle Minimalist Percentage */}
        <div className="mt-3 text-[11px] font-mono font-bold tracking-widest text-orange-400/90">
          {progress}%
        </div>

      </div>
    </div>
  );
};
