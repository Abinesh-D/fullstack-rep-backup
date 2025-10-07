import React, { useEffect, useRef } from 'react';
import './AnimatedHeader.css';
import { gsap } from 'gsap';

const AnimatedHeader = () => {
  const canvasRef = useRef(null);
  const headerRef = useRef(null);
  const pointsRef = useRef([]);
  const ctxRef = useRef(null);
  const targetRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const animateHeaderRef = useRef(true);
  const animationFrameRef = useRef();

  useEffect(() => {
    let width = window.innerWidth;
    let height = window.innerHeight;
    const canvas = canvasRef.current;
    const header = headerRef.current;
    const ctx = canvas.getContext('2d');
    ctxRef.current = ctx;

    header.style.height = `${height}px`;
    canvas.width = width;
    canvas.height = height;

    const points = [];

    for (let x = 0; x < width; x += width / 20) {
      for (let y = 0; y < height; y += height / 20) {
        const px = x + Math.random() * (width / 20);
        const py = y + Math.random() * (height / 20);
        const p = { x: px, y: py, originX: px, originY: py };
        points.push(p);
      }
    }

    // find 5 closest neighbors
    for (let i = 0; i < points.length; i++) {
      let closest = [];
      for (let j = 0; j < points.length; j++) {
        if (i !== j) {
          const placed = closest.length < 5;
          if (placed) {
            closest.push(points[j]);
          } else {
            const farthestIndex = closest.reduce((maxIdx, p, idx) => {
              return getDistance(points[i], p) > getDistance(points[i], closest[maxIdx]) ? idx : maxIdx;
            }, 0);
            if (getDistance(points[i], points[j]) < getDistance(points[i], closest[farthestIndex])) {
              closest[farthestIndex] = points[j];
            }
          }
        }
      }
      points[i].closest = closest;
    }

    points.forEach((p) => {
      p.circle = new Circle(p, 2 + Math.random() * 2);
    });

    pointsRef.current = points;

    // Animate
    points.forEach(shiftPoint);
    animate();

    // Event listeners
    const handleMouseMove = (e) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      header.style.height = `${height}px`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function animate() {
    const ctx = ctxRef.current;
    const points = pointsRef.current;
    const target = targetRef.current;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const dist = getDistance(target, p);

      if (dist < 4000) {
        p.active = 0.3;
        p.circle.active = 0.6;
      } else if (dist < 20000) {
        p.active = 0.1;
        p.circle.active = 0.3;
      } else if (dist < 40000) {
        p.active = 0.02;
        p.circle.active = 0.1;
      } else {
        p.active = 0;
        p.circle.active = 0;
      }

      drawLines(p);
      p.circle.draw();
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  }

  function shiftPoint(p) {
    gsap.to(p, {
      duration: 1 + Math.random(),
      x: p.originX - 50 + Math.random() * 100,
      y: p.originY - 50 + Math.random() * 100,
      ease: 'circ.inOut',
      onComplete: () => shiftPoint(p),
    });
  }

  function drawLines(p) {
    if (!p.active) return;
    const ctx = ctxRef.current;
    p.closest.forEach((cp) => {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(cp.x, cp.y);
      ctx.strokeStyle = `rgba(156,217,249,${p.active})`;
      ctx.stroke();
    });
  }

  class Circle {
    constructor(pos, radius) {
      this.pos = pos;
      this.radius = radius;
      this.active = 0;
    }

    draw() {
      if (!this.active) return;
      const ctx = ctxRef.current;
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(156,217,249,${this.active})`;
      ctx.fill();
    }
  }

  function getDistance(p1, p2) {
    return (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
  }

  return (
    <>
     <div 
    
    id="large-header" 
    className="large-header"
    
    ref={headerRef}>
      <canvas id="demo-canvas" ref={canvasRef}></canvas>
    </div>
    
    </>
   
  );
};

export default AnimatedHeader;
