'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface EnhancedContainerProps {
  children: ReactNode;
  variant?: 'card' | 'elevated' | 'glass' | 'gradient';
  className?: string;
}

/**
 * Enhanced container component that matches your design system
 * but adds trivia-style visual polish
 */
export function EnhancedContainer({ 
  children, 
  variant = 'card', 
  className 
}: EnhancedContainerProps) {
  const variants = {
    card: 'bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20',
    elevated: 'bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]',
    glass: 'bg-white/10 backdrop-blur-md rounded-3xl shadow-xl border border-white/20',
    gradient: 'bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-3xl shadow-xl text-white',
  };

  return (
    <div className={cn(variants[variant], className)}>
      {children}
    </div>
  );
}