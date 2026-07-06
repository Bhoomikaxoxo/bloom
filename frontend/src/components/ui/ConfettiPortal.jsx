import React, { useEffect, useRef } from 'react';
import useSlateStore from '../../store/useSlateStore';

const PASTEL_COLORS = [
  '#fbcfe8', // pink
  '#e9d5ff', // lavender
  '#ccfbf1', // mint
  '#ffedd5', // peach
  '#dbeafe', // blue
  '#fef9c3', // yellow
];

const ConfettiPortal = () => {
  const canvasRef = useRef(null);
  const confettiTrigger = useSlateStore((state) => state.confettiTrigger);
  const particlesRef = useRef([]);
  const animationFrameIdRef = useRef(null);

  // Check if system prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!confettiTrigger) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to full viewport
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const originX = confettiTrigger.x || window.innerWidth / 2;
    const originY = confettiTrigger.y || window.innerHeight / 2;

    const newParticles = [];
    const count = prefersReducedMotion ? 6 : 40; // reduce count if reduced motion active

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = prefersReducedMotion ? Math.random() * 1.5 + 0.5 : Math.random() * 5 + 3;
      const size = Math.random() * 8 + 8;
      const type = Math.random() > 0.5 ? 'star' : 'heart';
      const color = PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];

      newParticles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (prefersReducedMotion ? 1 : 4), // give upward thrust
        size,
        type,
        color,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        alpha: 1.0,
        gravity: prefersReducedMotion ? 0.05 : 0.15,
        friction: 0.98,
      });
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];

    // Canvas drawing helpers
    const drawStar = (c, cx, cy, spikes, outerRadius, innerRadius) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      let step = Math.PI / spikes;

      c.beginPath();
      c.moveTo(cx, cy - outerRadius);
      for (let j = 0; j < spikes; j++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        c.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        c.lineTo(x, y);
        rot += step;
      }
      c.lineTo(cx, cy - outerRadius);
      c.closePath();
    };

    const drawHeart = (c, x, y, size) => {
      c.beginPath();
      c.moveTo(x, y + size / 4);
      c.quadraticCurveTo(x, y, x + size / 4, y);
      c.quadraticCurveTo(x + size / 2, y, x + size / 2, y + size / 4);
      c.quadraticCurveTo(x + size / 2, y, x + (size * 3) / 4, y);
      c.quadraticCurveTo(x + size, y, x + size, y + size / 4);
      c.quadraticCurveTo(x + size, y + size / 2, x + (size * 3) / 4, y + (size * 3) / 4);
      c.lineTo(x + size / 2, y + size);
      c.lineTo(x + size / 4, y + (size * 3) / 4);
      c.quadraticCurveTo(x, y + size / 2, x, y + size / 4);
      c.closePath();
    };

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let j = particles.length - 1; j >= 0; j--) {
        const p = particles[j];
        p.vy += p.gravity;
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.alpha -= prefersReducedMotion ? 0.015 : 0.02; // fade out faster if reduced motion

        if (p.alpha <= 0 || p.y > canvas.height) {
          particles.splice(j, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === 'star') {
          drawStar(ctx, 0, 0, 5, p.size, p.size / 2);
          ctx.fill();
        } else {
          drawHeart(ctx, -p.size / 2, -p.size / 2, p.size);
          ctx.fill();
        }

        ctx.restore();
      }

      if (particles.length > 0) {
        animationFrameIdRef.current = requestAnimationFrame(updateAndDraw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    // Cancel existing frame loop if running
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    animationFrameIdRef.current = requestAnimationFrame(updateAndDraw);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [confettiTrigger, prefersReducedMotion]);

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
};

export default ConfettiPortal;
