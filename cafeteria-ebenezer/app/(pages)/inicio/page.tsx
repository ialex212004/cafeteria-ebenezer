'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import SplashScreen from '../../components/SplashScreen';

export default function InicioPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0,
      H = 0,
      af = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const palette = ['rgba(212,168,83,', 'rgba(168,50,40,', 'rgba(242,236,224,'];
    const particleCount = window.innerWidth < 768 ? 28 : 45;
    const pts = Array.from({ length: particleCount }, () => ({
      x: Math.random() * 1920,
      y: Math.random() * 1080,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -Math.random() * 0.22 - 0.05,
      a: Math.random() * 0.45 + 0.1,
      c: palette[Math.floor(Math.random() * palette.length)],
    }));

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -5) {
          p.y = H + 5;
          p.x = Math.random() * W;
        }
        if (p.x < -5) p.x = W + 5;
        if (p.x > W + 5) p.x = -5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.c}${p.a})`;
        ctx.fill();
      });
      af = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(af);
    };
  }, []);

  return (
    <>
      <SplashScreen />
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
        }
        :root {
          --bg: #0e0b08;
          --bg2: #131009;
          --bg3: #18140d;
          --surface: #201a11;
          --border: rgba(210, 185, 140, 0.08);
          --border2: rgba(210, 185, 140, 0.16);
          --fg: #f2ece0;
          --fg2: #a89880;
          --fg3: #5c5040;
          --gold: #d4a853;
          --gold2: #edc97a;
          --gold-dim: rgba(212, 168, 83, 0.12);
          --red: #a83228;
          --red2: #d4503f;
          --red-dim: rgba(168, 50, 40, 0.14);
          --font-display: 'Poppins', sans-serif;
          --font-body: 'Libre Baskerville', Georgia, serif;
          --ease: cubic-bezier(0.34, 1.56, 0.64, 1);
          --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
        }
        body {
          font-family: var(--font-body);
          background: var(--bg);
          color: var(--fg);
          overflow-x: hidden;
          font-size: 0.9rem;
          line-height: 1.8;
        }
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: var(--font-display);
          letter-spacing: -0.01em;
        }
        a {
          color: inherit;
          text-decoration: none;
        }
        button {
          font: inherit;
          cursor: pointer;
        }

        /* ── HERO ── */
        #inicio {
          height: 100vh;
          min-height: 600px;
          display: flex;
          overflow: hidden;
          margin-top: 70px;
        }
        .hero-panel {
          position: relative;
          flex: 1;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          transition: flex 0.6s cubic-bezier(0.25, 1, 0.5, 1);
          min-width: 0;
          cursor: pointer;
        }
        .hero-panel:hover {
          flex: 1.25;
        }
        .hero-panel img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s var(--ease-smooth), filter 0.8s var(--ease-smooth);
          filter: brightness(0.45) saturate(0.8);
          will-change: transform;
        }
        .hero-panel:hover img {
          transform: scale(1.06);
          filter: brightness(0.5) saturate(0.9);
        }
        .hero-grad {
          position: absolute;
          inset: 0;
        }
        .hero-panel-day .hero-grad {
          background: linear-gradient(to top, rgba(14, 11, 8, 0.97) 0%, rgba(14, 11, 8, 0.5) 40%, rgba(14, 11, 8, 0.1) 100%),
            linear-gradient(to right, rgba(14, 11, 8, 0.6) 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 30% 80%, rgba(212, 168, 83, 0.08) 0%, transparent 70%);
        }
        .hero-panel-night .hero-grad {
          background: linear-gradient(to top, rgba(14, 11, 8, 0.97) 0%, rgba(14, 11, 8, 0.5) 40%, rgba(14, 11, 8, 0.1) 100%),
            linear-gradient(to left, rgba(14, 11, 8, 0.6) 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 70% 80%, rgba(168, 50, 40, 0.1) 0%, transparent 70%);
        }
        .hero-divider {
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          width: 1px;
          background: linear-gradient(to bottom, transparent 0%, var(--border2) 30%, var(--border2) 70%, transparent 100%);
          z-index: 5;
        }
        .hero-content {
          position: relative;
          z-index: 10;
          padding: 3rem 3.5rem;
          width: 100%;
        }
        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 500;
          margin-bottom: 1.2rem;
          opacity: 0;
          animation: fadeUp 0.8s 0.3s both;
        }
        .hero-tag::before {
          content: '';
          width: 24px;
          height: 1px;
          background: var(--gold);
        }
        .hero-night .hero-tag {
          color: var(--red2);
        }
        .hero-night .hero-tag::before {
          background: var(--red2);
        }
        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 600;
          line-height: 1.1;
          color: var(--fg);
          margin-bottom: 1rem;
          opacity: 0;
          animation: fadeUp 0.8s 0.45s both;
        }
        .hero-title em {
          font-style: italic;
          color: var(--gold);
        }
        .hero-night .hero-title em {
          color: var(--red2);
        }
        .hero-sub {
          font-size: 0.85rem;
          color: var(--fg2);
          line-height: 1.8;
          max-width: 34ch;
          margin-bottom: 2rem;
          font-family: var(--font-body);
          opacity: 0;
          animation: fadeUp 0.8s 0.6s both;
        }
        .hero-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.75rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 500;
          font-family: var(--font-body);
          padding: 0.75rem 1.6rem;
          border: 1px solid;
          transition: all 0.3s;
          opacity: 0;
          animation: fadeUp 0.8s 0.75s both;
        }
        .hero-btn-day {
          border-color: var(--gold);
          color: var(--gold);
        }
        .hero-btn-day:hover {
          background: var(--gold);
          color: var(--bg);
        }
        .hero-btn-night {
          border-color: var(--red2);
          color: var(--red2);
        }
        .hero-btn-night:hover {
          background: var(--red2);
          color: var(--fg);
        }
        .hero-btn svg {
          width: 14px;
          height: 14px;
          transition: transform 0.3s;
        }
        .hero-btn:hover svg {
          transform: translateX(4px);
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ── PARTICLES & AMBIENT ── */
        #particles {
          mix-blend-mode: screen;
        }
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background: radial-gradient(ellipse 40% 30% at 15% 50%, rgba(212, 168, 83, 0.04) 0%, transparent 100%),
            radial-gradient(ellipse 35% 25% at 85% 30%, rgba(168, 50, 40, 0.05) 0%, transparent 100%),
            radial-gradient(ellipse 50% 40% at 50% 90%, rgba(212, 168, 83, 0.03) 0%, transparent 100%);
        }

        @media (max-width: 768px) {
          #inicio {
            flex-direction: column;
            height: auto;
          }
          .hero-panel {
            min-height: 55vh;
          }
          .hero-content {
            padding: 2rem 1.5rem;
          }
          .hero-divider {
            display: none;
          }
        }
      `}</style>

      <canvas ref={canvasRef} id="particles" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, opacity: 0.5 }} />

      <section id="inicio">
        <div className="hero-panel hero-panel-day">
          <Image
            src="https://www.pexels.com/es-es/foto/36892844/"
            alt="Café artesanal"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="hero-grad" />
          <div className="hero-divider" />
          <div className="hero-content">
            <span className="hero-tag">Tus Mañanas en Cafeteria Ébenezer</span>
            <h1 className="hero-title">
              El arte del
              <br />
              <em>buen café</em>
            </h1>
            <p className="hero-sub">Granos seleccionados, preparaciones artesanales. Cada taza cuenta una historia.</p>
            <a href="/menu" className="hero-btn hero-btn-day">
              Ver menú de café
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
        <div className="hero-panel hero-panel-night hero-night">
          <Image
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Pizza artesanal"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="hero-grad" />
          <div className="hero-content">
            <span className="hero-tag">Noches en Ébenezer</span>
            <h2 className="hero-title">
              La noche
              <br />
              <em>pide pizza</em>
            </h2>
            <p className="hero-sub">Ingredientes frescos, horno de piedra. Pizzas artesanales que hablan por sí solas.</p>
            <a href="/menu" className="hero-btn hero-btn-night">
              Ver menú de pizza
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
