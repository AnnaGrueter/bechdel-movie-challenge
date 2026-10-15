'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface EnhancedButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'success' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Enhanced button component that matches your indigo/zinc design system
 * but adds trivia-style animations and polish
 */
export function EnhancedButton({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false, 
  className 
}: EnhancedButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl',
    ghost: 'bg-gradient-to-br from-blue-500/80 to-indigo-600/80 hover:from-blue-600/90 hover:to-indigo-700/90 text-white font-medium shadow-lg hover:shadow-xl border border-blue-400/30 hover:border-blue-300/50 backdrop-blur-sm',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl',
    gradient: 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white font-semibold shadow-xl hover:shadow-2xl',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm font-medium rounded-xl',
    md: 'px-6 py-3 text-base rounded-2xl',
    lg: 'px-8 py-4 text-lg rounded-2xl',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]',
        'focus:outline-none focus:ring-4 focus:ring-white/30',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </button>
  );
}