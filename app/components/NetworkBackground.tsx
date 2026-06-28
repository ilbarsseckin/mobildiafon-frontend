"use client";
import { useEffect, useRef } from "react";

export default function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const context = cv.getContext("2d");
    if (!context) return;
    const canvas: HTMLCanvasElement = cv;
    const ctx: CanvasRenderingContext2D = context;

    // Hareket hassasiyeti: animasyonu calistirma
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    const mouse = { x: -9999, y: -9999 };

    type P = { x: number; y: number; vx: number; vy: number };
    let points: P[] = [];

    function resize() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Nokta sayisi: ekran alanina gore, mobilde az
      const isMobile = w < 768;
      const density = isMobile ? 9000 : 13000;
      const count = Math.min(isMobile ? 38 : 90, Math.floor((w * h) / density));
      points = [];
      for (let i = 0; i < count; i++) {
        points.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
        });
      }
    }

    const LINK_DIST = 130;

    function draw() {
      ctx.clearRect(0, 0, w, h);

      // Noktalari hareket ettir
      for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        // Fareye hafif kacma/cekim
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          p.x += (dx / dist) * 0.6;
          p.y += (dy / dist) * 0.6;
        }
      }

      // Baglanti cizgileri
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i], b = points[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK_DIST) {
            const op = (1 - d / LINK_DIST) * 0.5;
            ctx.strokeStyle = `rgba(230, 57, 70, ${op * 0.55})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Noktalar
      for (const p of points) {
        ctx.fillStyle = "rgba(20, 33, 61, 0.55)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    function onMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    function onLeave() { mouse.x = -9999; mouse.y = -9999; }

    resize();
    window.addEventListener("resize", resize);
    if (!reduced) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseout", onLeave);
      draw();
    } else {
      // Statik tek kare ciz
      draw();
      cancelAnimationFrame(raf);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="md-network-bg" aria-hidden="true" />;
}
