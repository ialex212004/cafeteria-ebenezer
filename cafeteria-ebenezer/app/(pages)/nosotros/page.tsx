'use client';

import Image from 'next/image';
import { useEffect } from 'react';

export default function NosotrosPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style jsx global>{`
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
          --font-display: 'Poppins', sans-serif;
          --font-body: 'Libre Baskerville', Georgia, serif;
          --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
        }

        body {
          background: var(--bg);
          color: var(--fg);
        }

        .section {
          padding: 7rem 2rem;
          margin-top: 70px;
        }
        .section-dark {
          background: var(--bg2);
          background-image: radial-gradient(ellipse 80% 60% at 10% 20%, rgba(212, 168, 83, 0.04) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 90% 80%, rgba(168, 50, 40, 0.05) 0%, transparent 70%);
        }
        .container {
          max-width: 1180px;
          margin: 0 auto;
        }
        .eyebrow {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 500;
          margin-bottom: 1.25rem;
        }
        .eyebrow::before {
          content: '';
          width: 28px;
          height: 1px;
          background: var(--gold);
        }
        .section-title {
          font-family: var(--font-display);
          font-size: clamp(1.8rem, 3.5vw, 2.8rem);
          font-weight: 600;
          line-height: 1.15;
          color: var(--fg);
        }
        .section-title em {
          font-style: italic;
          color: var(--gold);
        }

        .about-grid {
          display: grid;
          grid-template-columns: 5fr 7fr;
          gap: 5rem;
          align-items: center;
        }
        .about-img-wrap {
          position: relative;
        }
        .about-img-frame {
          position: relative;
          overflow: hidden;
          border: 1px solid var(--border);
          min-height: 520px;
        }
        .about-img-frame img {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
          display: block;
          filter: brightness(0.85) saturate(0.9);
          transition: transform 0.8s var(--ease-smooth), filter 0.5s;
        }
        .about-img-frame:hover img {
          transform: scale(1.04);
          filter: brightness(0.9) saturate(1);
        }
        .about-img-accent {
          position: absolute;
          bottom: -1.5rem;
          right: -1.5rem;
          width: 8rem;
          height: 8rem;
          border: 1px solid var(--gold);
          z-index: -1;
        }
        .about-text .section-title {
          margin-bottom: 1.75rem;
        }
        .about-text p {
          color: var(--fg2);
          font-size: 0.95rem;
          line-height: 1.85;
          margin-bottom: 1.25rem;
        }
        .timeline {
          display: flex;
          margin-top: 3rem;
          border-top: 1px solid var(--border);
        }
        .timeline-item {
          flex: 1;
          padding: 1.5rem 1.5rem 0 0;
          border-right: 1px solid var(--border);
        }
        .timeline-item:first-child {
          padding-left: 0;
        }
        .timeline-item:last-child {
          border-right: none;
          padding-right: 0;
        }
        .timeline-item:not(:first-child) {
          padding-left: 1.5rem;
        }
        .t-time {
          font-family: var(--font-display);
          font-size: 1.8rem;
          font-weight: 600;
          color: var(--gold);
          display: block;
          margin-bottom: 0.3rem;
        }
        .t-label {
          font-size: 0.72rem;
          color: var(--fg3);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .reveal {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.7s var(--ease-smooth), transform 0.7s var(--ease-smooth);
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal-delay-1 {
          transition-delay: 0.1s;
        }
        .reveal-delay-2 {
          transition-delay: 0.2s;
        }
        .reveal-delay-3 {
          transition-delay: 0.3s;
        }

        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .about-img-accent {
            display: none;
          }
          .section {
            padding: 5rem 1.25rem;
          }
          .timeline {
            flex-direction: column;
            gap: 1rem;
          }
          .timeline-item,
          .timeline-item:not(:first-child) {
            border-right: none;
            padding-left: 0;
            padding-right: 0;
          }
        }
      `}</style>

      <section className="section section-dark">
        <div className="container">
          <div className="about-grid">
            <div className="about-img-wrap reveal">
              <div className="about-img-frame">
                <Image
                  src="https://images.unsplash.com/photo-1559496417-e7f25cb247f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Interior Cafetería Ébenezer"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
              <div className="about-img-accent" />
            </div>
            <div className="about-text">
              <div className="eyebrow reveal">Nuestra historia</div>
              <h1 className="section-title reveal reveal-delay-1">
                De la mañana a la noche,
                <br />
                <em>una misma pasión</em>
              </h1>
              <p className="reveal reveal-delay-2">
                En Cafetería Ébenezer creemos que los mejores momentos del día merecen ser acompañados con lo mejor. Por las mañanas, nuestro café de especialidad despierta los sentidos con aromas que llenan el espacio.
              </p>
              <p className="reveal reveal-delay-2">
                Al caer la tarde, el horno cobra vida y nuestras pizzas artesanales se convierten en el centro de la mesa. Dos experiencias, un solo lugar donde la calidad es la constante.
              </p>
              <div className="timeline reveal reveal-delay-3">
                <div className="timeline-item">
                  <span className="t-time">08:00</span>
                  <span className="t-label">Apertura Cafetería</span>
                </div>
                <div className="timeline-item">
                  <span className="t-time">16:00</span>
                  <span className="t-label">Apertura Pizzería</span>
                </div>
                <div className="timeline-item">
                  <span className="t-time">23:00</span>
                  <span className="t-label">Cierre</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
