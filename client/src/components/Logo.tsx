import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showText?: boolean;
}

export default function Logo({ size = 'md', color = '#8A4EFC', showText = true }: LogoProps) {
  const sizes = {
    sm: { width: 32, height: 32 },
    md: { width: 45, height: 45 },
    lg: { width: 65, height: 65 }
  };

  const { width, height } = sizes[size];

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <svg
          width={width}
          height={height}
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-pulse"
          style={{ animationDuration: '3s' }}
        >
          <circle cx="25" cy="25" r="23" fill="white" stroke={color} strokeWidth="4" />
          <path 
            d="M30 18C30 14.8 27.2 12 24 12C20.8 12 18 14.8 18 18C18 21.2 20.8 24 24 24" 
            stroke={color} 
            strokeWidth="4" 
            strokeLinecap="round"
          />
          <path 
            d="M18 32C18 35.2 20.8 38 24 38C27.2 38 30 35.2 30 32C30 28.8 27.2 26 24 26" 
            stroke={color} 
            strokeWidth="4" 
            strokeLinecap="round"
          />
          <path 
            d="M36 20L33 25L30 20" 
            stroke={color} 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full animate-bounce" style={{ animationDuration: '1.5s' }}></div>
      </div>
      {showText && (
        <div className="flex items-center">
          <span className={`font-extrabold ${size === 'sm' ? 'text-xl' : size === 'md' ? 'text-2xl' : 'text-3xl'} text-[${color}]`}>
            CHAMBEA
          </span>
          <span className={`font-extrabold ml-1 ${size === 'sm' ? 'text-xl' : size === 'md' ? 'text-2xl' : 'text-3xl'} text-yellow-500`}>
            YA
          </span>
        </div>
      )}
    </div>
  );
}