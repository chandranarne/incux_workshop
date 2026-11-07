import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const ballRef = useRef(null);
  const pulseRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Only enable on desktop/laptops with fine cursor pointing
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ballX = -100;
    let ballY = -100;
    let rafId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Detect clickable elements for interactive hover effect
      const target = e.target;
      if (target && target.closest) {
        const clickable = target.closest('a, button, input, textarea, select, [role="button"], [data-cursor="pointer"]');
        setIsHovering(!!clickable);
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Ultra-smooth requestAnimationFrame animation loop
    const animate = () => {
      // 0.65 interpolation factor keeps the ball right at the tip while giving a fluid animated glide
      ballX += (mouseX - ballX) * 0.65;
      ballY += (mouseY - ballY) * 0.65;

      if (ballRef.current) {
        ballRef.current.style.transform = `translate3d(${ballX}px, ${ballY}px, 0) translate(-50%, -50%)`;
      }
      if (pulseRef.current) {
        pulseRef.current.style.transform = `translate3d(${ballX}px, ${ballY}px, 0) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, [isVisible]);

  // Don't render on server
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999999] overflow-hidden select-none">
      {/* Subtle outer pulsing yellow halo at cursor tip */}
      <div
        ref={pulseRef}
        className={`fixed top-0 left-0 w-6 h-6 rounded-full bg-[#FACC15]/25 blur-xs pointer-events-none transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${isHovering ? 'scale-150 bg-[#FACC15]/40' : 'scale-100'}`}
        style={{
          willChange: 'transform',
          transform: 'translate3d(-100px, -100px, 0)'
        }}
      />

      {/* Small Yellow Ball at the tip of the cursor */}
      <div
        ref={ballRef}
        className={`fixed top-0 left-0 rounded-full bg-[#FACC15] shadow-[0_0_10px_rgba(250,204,21,0.9),0_0_20px_rgba(250,204,21,0.5)] border border-amber-300 pointer-events-none transition-transform duration-100 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${
          isClicking
            ? 'w-2 h-2 scale-75'
            : isHovering
            ? 'w-3.5 h-3.5 scale-125 bg-[#FEF08A] shadow-[0_0_15px_rgba(250,204,21,1)]'
            : 'w-2.5 h-2.5'
        }`}
        style={{
          willChange: 'transform',
          transform: 'translate3d(-100px, -100px, 0)'
        }}
      />
    </div>
  );
}
