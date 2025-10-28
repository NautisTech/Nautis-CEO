'use client'

import React from 'react'
import { useTheme } from '@mui/material/styles'
import VuexyLogo from '@core/svg/Logo'

export default function LoadingScreen() {
  const theme = useTheme()

  // Use the orange color directly
  const primary = '#fd7600'
  const primaryLight = '#ff8f33'
  const primaryDark = '#e56900'

  // Create a subtle gradient background using the theme's primary color
  const gradient = `linear-gradient(135deg, ${primary} 0%, ${primaryLight} 50%, ${primaryDark} 100%)`

  return (
    <div
      style={{ background: gradient }}
      className="flex items-center justify-center min-h-screen w-full fixed inset-0 z-[9999]"
    >
      <div className="flex flex-col items-center">
        {/* Pulsating Logo Container */}
        <div className="relative mb-8">
          {/* Outer glow rings */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              background: 'rgba(255, 255, 255, 0.1)',
              filter: 'blur(8px)'
            }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              animationDelay: '1s',
              background: 'rgba(255, 255, 255, 0.1)',
              filter: 'blur(8px)'
            }}
          />

          {/* Main logo container with pulsating effect */}
          <div
            className="relative w-32 h-32 rounded-full flex items-center justify-center bg-white shadow-2xl"
            style={{
              animation: 'pulse-logo 2s ease-in-out infinite',
            }}
          >
            <VuexyLogo
              className="text-primary"
              style={{
                width: '5em',
                height: '3.5em',
                color: primary,
                filter: `drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))`
              }}
            />
          </div>
        </div>

        {/* Bouncing dots */}
        <div className="flex items-end gap-2">
          <span
            className="w-3 h-3 rounded-full bg-white shadow-lg"
            style={{ animation: 'bounce 1.2s infinite', animationDelay: '0ms' }}
          />
          <span
            className="w-3 h-3 rounded-full bg-white shadow-lg"
            style={{ animation: 'bounce 1.2s infinite', animationDelay: '0.2s' }}
          />
          <span
            className="w-3 h-3 rounded-full bg-white shadow-lg"
            style={{ animation: 'bounce 1.2s infinite', animationDelay: '0.4s' }}
          />
        </div>

        {/* Inline styles for animations */}
        <style>{`
          @keyframes bounce {
            0%, 80%, 100% { 
              transform: translateY(0); 
              opacity: 0.7;
            }
            40% { 
              transform: translateY(-12px); 
              opacity: 1;
            }
          }

          @keyframes pulse-logo {
            0%, 100% { 
              transform: scale(1);
            }
            50% { 
              transform: scale(1.05);
            }
          }

          @keyframes pulse-ring {
            0% {
              transform: scale(0.95);
              opacity: 0.8;
            }
            50% {
              transform: scale(1.15);
              opacity: 0;
            }
            100% {
              transform: scale(0.95);
              opacity: 0;
            }
          }

          @keyframes fade-in-out {
            0%, 100% { 
              opacity: 0.8; 
            }
            50% { 
              opacity: 1; 
            }
          }
        `}</style>
      </div>
    </div>
  )
}

