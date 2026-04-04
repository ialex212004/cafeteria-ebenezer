'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

export default function GaleriaPage() {
  const galleryTrackRef = useRef<HTMLDivElement | null>(null);

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

  const scrollGallery = (dir: number) =>
    galleryTrackRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });

  return (
    <>
      <style jsx global>{`
        :root {
          --bg2: #131009;
          --border: rgba(210, 185, 140, 0.08);
          --border2: rgba(210, 185, 140, 0.16);
          --fg: #f2ece0;
          --fg2: #a89880;
          --fg3: #5c5040;
          --gold: #d4a853;
          --font-display: 'Poppins', sans-serif;
          --font-body: 'Libre Baskerville', Georgia, serif;
          --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
        }

        body {
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

        .gallery-header {
          margin-bottom: 3rem;
        }
        .gallery-track-wrap {
          overflow: hidden;
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
        }
        .gallery-track {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          padding: 0 2rem 1rem;
          scrollbar-width: none;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
        }
        .gallery-track::-webkit-scrollbar {
          display: none;
        }
        .gallery-card {
          flex-shrink: 0;
          width: 280px;
          scroll-snap-align: start;
          position: relative;
          overflow: hidden;
          border: 1px solid var(--border);
        }
        .gallery-card img {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
          display: block;
          filter: brightness(0.75) saturate(0.8);
          transition: transform 0.7s var(--ease-smooth), filter 0.5s;
        }
        .gallery-card:hover img {
          transform: scale(1.06);
          filter: brightness(0.9) saturate(1.1);
        }
        .gallery-card-label {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1.5rem 1rem 1rem;
          background: linear-gradient(to top, rgba(10, 10, 15, 0.9) 0%, transparent 100%);
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--fg2);
          transform: translateY(4px);
          transition: transform 0.3s;
        }
        .gallery-card:hover .gallery-card-label {
          transform: translateY(0);
          color: var(--fg);
        }
        .gallery-nav {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 2rem;
        }
        .gallery-nav button {
          width: 2.5rem;
          height: 2.5rem;
          border: 1px solid var(--border2);
          background: transparent;
          color: var(--fg2);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s;
        }
        .gallery-nav button:hover {
          border-color: var(--gold);
          color: var(--gold);
        }
        .gallery-nav button svg {
          width: 16px;
          height: 16px;
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

        @media (max-width: 768px) {
          .section {
            padding: 5rem 1.25rem;
          }
          .gallery-card {
            width: 240px;
          }
        }
      `}</style>

      <section className="section section-dark">
        <div className="container">
          <div className="gallery-header">
            <div className="eyebrow reveal">La experiencia</div>
            <h1 className="section-title reveal reveal-delay-1">
              Momentos que nos <em>definen</em>
            </h1>
          </div>
        </div>
        <div className="gallery-track-wrap">
          <div className="gallery-track" ref={galleryTrackRef}>
            {[
              { src: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', alt: 'Latte art', label: 'Café de especialidad' },
              { src: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', alt: 'Croissant', label: 'Repostería artesanal' },
              { src: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', alt: 'Espresso', label: 'Espresso perfecto' },
              { src: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', alt: 'Pizza', label: 'Pizza margherita' },
              { src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', alt: 'Pizza artesanal', label: 'Horno de piedra' },
              { src: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', alt: 'Ambiente', label: 'Nuestro ambiente' },
            ].map((img) => (
              <div key={img.alt} className="gallery-card">
                <Image src={img.src} alt={img.alt} width={600} height={800} sizes="(max-width: 768px) 240px, 280px" />
                <div className="gallery-card-label">{img.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="gallery-nav">
          <button onClick={() => scrollGallery(-1)} aria-label="Anterior">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={() => scrollGallery(1)} aria-label="Siguiente">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>
    </>
  );
}
