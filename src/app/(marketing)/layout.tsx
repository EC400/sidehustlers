// app/(marketing)/layout.tsx
"use client";

import { useEffect, useState } from 'react';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Animated gradient background that follows mouse */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute w-[800px] h-[800px] rounded-full blur-[120px] opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%)',
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.3s ease-out',
          }}
        />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[100px] opacity-10 bg-purple-500" />
        <div className="absolute bottom-0 left-0 w-[700px] h-[700px] rounded-full blur-[100px] opacity-10 bg-teal-500" />
      </div>

      {/* Noise texture overlay */}
      <div className="fixed inset-0 -z-10 opacity-[0.015]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Grid pattern */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/5 to-transparent"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px),
                             linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {children}
    </div>
  );
}