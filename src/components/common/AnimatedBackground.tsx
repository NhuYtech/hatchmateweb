"use client";

import React, { useEffect, useRef } from "react";

interface AnimatedBackgroundProps {
  className?: string;
}

export default function AnimatedBackground({ className = "" }: AnimatedBackgroundProps) {
  const interactiveBlobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!interactiveBlobRef.current) return;

      const { clientX, clientY } = event;
      // Centering the 400px blob on the cursor (subtract 200px from X and Y)
      const x = clientX - 200;
      const y = clientY - 200;

      // Direct style update for high performance
      interactiveBlobRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none ${className}`}>
      {/* Base background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FCF8EC] via-[#FFF5DC] to-[#E7A124] opacity-90" />
      
      {/* Floating Blobs using current theme colors */}
      {/* Blob 1: Warm light yellow/cream */}
      <div 
        className="absolute w-[450px] h-[450px] sm:w-[600px] sm:h-[600px] rounded-full bg-[#FFF8E8] blur-[90px] opacity-70"
        style={{
          top: "-15%",
          left: "-10%",
          animation: "float-blob-1 25s infinite ease-in-out",
        }}
      />
      
      {/* Blob 2: Soft yellow/amber */}
      <div 
        className="absolute w-[400px] h-[400px] sm:w-[550px] sm:h-[550px] rounded-full bg-[#FFD56B] blur-[100px] opacity-60"
        style={{
          bottom: "5%",
          right: "-10%",
          animation: "float-blob-2 30s infinite ease-in-out",
        }}
      />

      {/* Blob 3: Vibrant orange/amber */}
      <div 
        className="absolute w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] rounded-full bg-[#E7A124] blur-[110px] opacity-45"
        style={{
          top: "25%",
          right: "15%",
          animation: "float-blob-3 20s infinite ease-in-out",
        }}
      />

      {/* Blob 4: Soft warm background cream */}
      <div 
        className="absolute w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] rounded-full bg-[#FCF8EC] blur-[80px] opacity-80"
        style={{
          bottom: "-5%",
          left: "20%",
          animation: "float-blob-4 22s infinite ease-in-out",
        }}
      />

      {/* Interactive Cursor-following Blob: Soft vibrant amber glow */}
      <div 
        ref={interactiveBlobRef}
        className="absolute w-[400px] h-[400px] rounded-full bg-[#FFD56B] blur-[80px] opacity-50 pointer-events-none transition-transform duration-500 ease-out will-change-transform"
        style={{
          left: 0,
          top: 0,
          transform: "translate3d(-500px, -500px, 0)", // Initially offscreen
        }}
      />
    </div>
  );
}
