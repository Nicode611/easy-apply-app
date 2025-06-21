'use client';

import { ReactNode } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-in-up' | 'fade-in-left' | 'fade-in-right' | 'scale-in' | 'slide-in-up';
  delay?: number;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export default function ScrollAnimation({
  children,
  className = '',
  animation = 'fade-in-up',
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
}: ScrollAnimationProps) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce,
  });

  const getAnimationClass = () => {
    if (!isIntersecting) return 'opacity-0';
    
    const baseClasses = 'opacity-100 transition-all duration-700 ease-out';
    const delayClass = delay > 0 ? `animation-delay-${Math.round(delay * 1000)}` : '';
    
    switch (animation) {
      case 'fade-in-up':
        return `${baseClasses} ${delayClass} animate-fade-in-up`;
      case 'fade-in-left':
        return `${baseClasses} ${delayClass} animate-fade-in-left`;
      case 'fade-in-right':
        return `${baseClasses} ${delayClass} animate-fade-in-right`;
      case 'scale-in':
        return `${baseClasses} ${delayClass} animate-scale-in`;
      case 'slide-in-up':
        return `${baseClasses} ${delayClass} animate-slide-in-up`;
      default:
        return `${baseClasses} ${delayClass} animate-fade-in-up`;
    }
  };

  return (
    <div
      ref={ref}
      className={`${getAnimationClass()} ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
} 