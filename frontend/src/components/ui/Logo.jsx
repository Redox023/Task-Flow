import React from 'react';

export function TeamFlowLogo({ size = 24, className = '', style = {} }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      {/* Magnifying Glass Handle */}
      <path d="M70 145 C 75 140, 85 130, 90 120 L 105 130 C 100 140, 90 155, 80 160 Z" fill="#003366" />
      <path d="M70 145 C 70 150, 75 155, 80 160 C 85 160, 85 155, 85 150 C 85 145, 75 140, 70 145 Z" fill="#001F3F" />
      
      {/* Magnifying Glass Rim */}
      <ellipse cx="100" cy="100" rx="60" ry="25" stroke="#003366" strokeWidth="12" fill="none" transform="rotate(-15 100 100)" />
      <path d="M45 100 C 65 125, 135 125, 155 100" stroke="#004080" strokeWidth="8" fill="none" transform="rotate(-15 100 100)" />
      
      {/* Red Bar (Left) */}
      <rect x="70" y="30" width="16" height="70" fill="#FF0000" />
      <rect x="70" y="20" width="6" height="6" fill="#FF0000" />
      <rect x="78" y="24" width="4" height="4" fill="#FF0000" />
      <rect x="84" y="20" width="4" height="4" fill="#FF0000" />
      <rect x="70" y="10" width="4" height="4" fill="#FF0000" />
      
      {/* Yellow Bar (Middle) */}
      <rect x="95" y="55" width="16" height="55" fill="#FFCC00" />
      <rect x="95" y="45" width="6" height="6" fill="#FFCC00" />
      <rect x="103" y="49" width="4" height="4" fill="#FFCC00" />
      <rect x="105" y="40" width="4" height="4" fill="#FFCC00" />
      
      {/* Green Bar (Right) */}
      <rect x="120" y="70" width="16" height="50" fill="#33CC33" />
      <rect x="120" y="60" width="6" height="6" fill="#33CC33" />
      <rect x="128" y="64" width="4" height="4" fill="#33CC33" />
      <rect x="130" y="55" width="4" height="4" fill="#33CC33" />
    </svg>
  );
}
