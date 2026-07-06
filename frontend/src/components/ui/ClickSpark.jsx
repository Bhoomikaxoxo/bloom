import React, { useRef, useEffect } from 'react';

const ClickSpark = ({
  sparkColor = '#EC4899',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = 'ease-out',
  extraScale = 1,
  children
}) => {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);
  const animRef = useRef(null);

  // Easing function calculations
  const easeFunc = (t) => {
    switch (easing) {
      case 'linear':
        return t;
      case 'ease-in':
        return t * t;
      case 'ease-in-out':
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      case 'ease-out':
      default:
        return 1 - Math.pow(1 - t, 3); // Cubic ease-out
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = performance.now();
      const activeSparks = sparksRef.current.filter(
        (s) => now - s.startTime < duration
      );
      sparksRef.current = activeSparks;

      if (activeSparks.length === 0) {
        animRef.current = null;
        return;
      }

      activeSparks.forEach((spark) => {
        const elapsed = now - spark.startTime;
        const p = Math.min(1, elapsed / duration);
        const progress = easeFunc(p);

        // Calculate travel distance from origin click coordinate
        const currentRadius = progress * sparkRadius * extraScale;

        ctx.strokeStyle = sparkColor;
        ctx.lineCap = 'round';

        for (let i = 0; i < sparkCount; i++) {
          const angle = (i * 2 * Math.PI) / sparkCount;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);

          const startX = spark.x + cos * currentRadius;
          const startY = spark.y + sin * currentRadius;
          // Scale down line length as the spark ages
          const lineLength = sparkSize * (1 - p);
          const endX = startX + cos * lineLength;
          const endY = startY + sin * lineLength;

          ctx.beginPath();
          ctx.lineWidth = Math.max(1, 2.5 * (1 - p));
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }
      });

      animRef.current = requestAnimationFrame(draw);
    };

    const handleClick = (e) => {
      sparksRef.current.push({
        x: e.clientX,
        y: e.clientY,
        startTime: performance.now(),
      });

      if (!animRef.current) {
        animRef.current = requestAnimationFrame(draw);
      }
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration, easing, extraScale]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none w-full h-full"
        style={{ zIndex: 99999 }}
      />
      {children}
    </>
  );
};

export default ClickSpark;
