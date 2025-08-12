import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="container mx-auto px-4 py-8">
        <div className={`flex justify-center items-center min-h-[400px]  ${className}`}>
          <div className={`${sizeClasses[size]} animate-spin rounded-full h-12 w-12 border-b-2 border-[#c41c1a]`}></div>
        </div>
      </div>
  );
} 