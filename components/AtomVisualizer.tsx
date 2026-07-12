
import React, { useEffect, useState, useMemo } from 'react';
import { AtomState } from '../types';

interface AtomVisualizerProps {
  state: AtomState;
}

const AtomVisualizer: React.FC<AtomVisualizerProps> = ({ state }) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      setRotation(prev => (prev + 0.5) % 360);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const { protons, neutrons, electrons } = state;

  const K_SHELL_RADIUS = 55;
  const SHELL_SPACING = 35;

  const shells = useMemo(() => {
    const s: number[] = [];
    let remaining = electrons;
    const capacities = [2, 8, 18, 32];
    for (const cap of capacities) {
      if (remaining > 0) {
        const count = Math.min(remaining, cap);
        s.push(count);
        remaining -= count;
      } else {
        break;
      }
    }
    return s;
  }, [electrons]);

  const nucleusParticles = useMemo(() => {
    const particles = [];
    const total = protons + neutrons;
    const maxNucleusRadius = 40; 
    
    for (let i = 0; i < total; i++) {
      const type = i < protons ? 'proton' : 'neutron';
      const angle = i * Math.PI * (3 - Math.sqrt(5));
      const basePacking = total > 40 ? 3.0 : 5.0;
      let r = Math.sqrt(i + 0.5) * basePacking;
      
      if (r > maxNucleusRadius - 5) {
        r = maxNucleusRadius - 5 + (5 * (1 - Math.exp(-(r - (maxNucleusRadius - 5)) / 5)));
      }

      particles.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
        type
      });
    }
    return particles;
  }, [protons, neutrons]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="-200 -200 400 400" className="w-full h-full">
        <defs>
          <radialGradient id="protonGradient">
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="100%" stopColor="#e63946" />
          </radialGradient>
          <radialGradient id="neutronGradient">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </radialGradient>
          <radialGradient id="electronGradient">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563eb" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {shells.map((_, idx) => (
          <circle
            key={`orbit-${idx}`}
            cx="0"
            cy="0"
            r={K_SHELL_RADIUS + idx * SHELL_SPACING}
            fill="none"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth="1.2"
            strokeDasharray="5 5"
          />
        ))}

        <g filter="url(#glow)">
          {nucleusParticles.map((p, i) => (
            <g key={`nucleus-p-${i}`} transform={`translate(${p.x}, ${p.y})`}>
              <circle
                r="6"
                fill={p.type === 'proton' ? 'url(#protonGradient)' : 'url(#neutronGradient)'}
                stroke="white"
                strokeWidth="0.6"
              />
              {p.type === 'proton' && (
                <text
                  y="0.5"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fill="white"
                  fontSize="8"
                  fontWeight="black"
                  className="select-none pointer-events-none"
                >
                  +
                </text>
              )}
            </g>
          ))}
        </g>

        {shells.map((count, sIdx) => {
          const radius = K_SHELL_RADIUS + sIdx * SHELL_SPACING;
          const speedMultiplier = 1 / (sIdx + 1);
          return (
            <g key={`shell-electrons-${sIdx}`}>
              {Array.from({ length: count }).map((_, eIdx) => {
                const orbitAngle = (eIdx / count) * 360 + rotation * speedMultiplier * (sIdx % 2 === 0 ? 1 : -1);
                const x = Math.cos((orbitAngle * Math.PI) / 180) * radius;
                const y = Math.sin((orbitAngle * Math.PI) / 180) * radius;

                return (
                  <g key={`electron-${sIdx}-${eIdx}`} transform={`translate(${x}, ${y})`}>
                    <circle
                      r="5"
                      fill="url(#electronGradient)"
                      filter="url(#glow)"
                      stroke="white"
                      strokeWidth="1.2"
                    />
                    <text
                      y="0"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      fill="white"
                      fontSize="9"
                      fontWeight="black"
                      className="select-none pointer-events-none"
                    >
                      -
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>

      <div className="absolute top-6 left-6 flex flex-col gap-2.5 pointer-events-none">
        <div className="flex items-center gap-3 bg-white/90 backdrop-blur shadow-md px-4 py-2 rounded-2xl border border-red-100 text-xs font-black text-red-600">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm" />
          <span>PROTONS: {protons}</span>
        </div>
        <div className="flex items-center gap-3 bg-white/90 backdrop-blur shadow-md px-4 py-2 rounded-2xl border border-slate-200 text-xs font-black text-slate-500">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-400 shadow-sm" />
          <span>NEUTRONS: {neutrons}</span>
        </div>
        <div className="flex items-center gap-3 bg-white/90 backdrop-blur shadow-md px-4 py-2 rounded-2xl border border-blue-100 text-xs font-black text-blue-600">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          <span>ELECTRONS: {electrons}</span>
        </div>
      </div>
    </div>
  );
};

export default AtomVisualizer;
