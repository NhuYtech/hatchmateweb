"use client";

import React from "react";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      {/* Amber Glow Background */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: "radial-gradient(125% 125% at 50% 90%, #fde68a 20%, #f59e0b 100%)",
          backgroundSize: "100% 100%",
        }}
      />
    </div>
  );
}
