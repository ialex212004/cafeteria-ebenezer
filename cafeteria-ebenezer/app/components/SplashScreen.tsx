'use client';

import { useEffect, useState } from 'react';

const MIN_VISIBLE_MS = 2200;
const EXIT_DURATION_MS = 1050;

const SPLASH_CSS = `
  .spl {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, #080603 0%, #0c0905 100%);
    will-change: opacity, transform, filter;
    backface-visibility: hidden;
  }

  .spl::before,
  .spl::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }
  .spl::before {
    width: 620px;
    height: 620px;
    top: -230px;
    left: -230px;
    background: radial-gradient(circle, rgba(201,169,110,.17) 0%, transparent 60%);
    animation: spl-drift 16s ease-in-out infinite alternate;
  }
  .spl::after {
    width: 560px;
    height: 560px;
    bottom: -210px;
    right: -210px;
    background: radial-gradient(circle, rgba(180,92,50,.13) 0%, transparent 60%);
    animation: spl-drift 20s ease-in-out infinite alternate-reverse;
  }

  .spl--exit {
    opacity: 0;
    transform: scale(1.08);
    filter: blur(14px);
    pointer-events: none;
    transition: opacity 1.05s ease-out, transform 1.45s ease-out, filter 1.05s ease-out;
  }
  .spl--exit .spl__inner {
    opacity: 0;
    transform: translateY(-24px) scale(0.94);
    transition: opacity 0.45s ease-out, transform 0.65s ease-out;
  }

  .spl__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.45rem;
    text-align: center;
    padding: 2rem;
    position: relative;
    z-index: 10;
  }

  .spl__eyebrow {
    font-family: 'Italiana', serif;
    font-size: 0.75rem;
    letter-spacing: 0.68em;
    text-transform: uppercase;
    color: #c9a96e;
    opacity: 0;
    animation: spl-rise 1.1s 0.08s forwards ease-out;
  }

  .spl__title {
    font-family: 'Italiana', serif;
    font-size: clamp(3.8rem, 9.5vw, 7.4rem);
    color: #ffffff;
    line-height: 0.92;
    display: flex;
    flex-direction: column;
    gap: 0.08em;
  }
  .spl__title-line {
    display: flex;
    gap: 0.01em;
  }
  .spl__title span {
    display: inline-block;
    opacity: 0;
    transform: translateY(52px) rotate(5deg);
    animation: spl-char 1.05s forwards ease-out;
  }

  .spl__rule {
    width: 160px;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, #c9a96e 50%, transparent 100%);
    opacity: 0;
    animation: spl-rise 1.35s 0.48s forwards ease-out;
  }

  .spl__tagline {
    font-family: sans-serif;
    font-size: 0.66rem;
    letter-spacing: 0.46em;
    text-transform: uppercase;
    color: #b4a284;
    opacity: 0;
    animation: spl-rise 1s 0.84s forwards ease-out;
  }
  .spl__tagline b {
    color: #c9a96e;
    font-weight: 400;
  }

  .spl__stars {
    display: flex;
    gap: 0.5rem;
    opacity: 0;
    animation: spl-rise 0.9s 1.02s forwards ease-out;
  }
  .spl__stars span {
    color: #c9a96e;
    font-size: 0.55rem;
  }

  .spl__verse {
    font-family: serif;
    font-style: italic;
    font-size: 0.8rem;
    color: rgba(201, 169, 110, 0.55);
    line-height: 1.7;
    max-width: 34ch;
    opacity: 0;
    animation: spl-rise 1s 1.18s forwards ease-out;
  }

  @keyframes spl-rise {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes spl-char {
    to { opacity: 1; transform: translateY(0) rotate(0deg); }
  }
  @keyframes spl-drift {
    0% { transform: translate(0, 0); }
    100% { transform: translate(52px, 36px); }
  }

  @media (prefers-reduced-motion: reduce) {
    .spl::before, .spl::after { animation: none; }
    .spl__title span, .spl__eyebrow, .spl__tagline, .spl__stars, .spl__verse, .spl__rule {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
    .spl--exit { transition: opacity 0.3s linear; filter: none; transform: none; }
    .spl--exit .spl__inner { transition: opacity 0.2s linear; transform: none; }
  }
`;

const LINE1 = Array.from('CAFETERIA');
const LINE2 = Array.from('EBENEZER');

export default function SplashScreen() {
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const mountedAt = Date.now();
    let timeouts: ReturnType<typeof setTimeout>[] = [];

    const startExit = () => {
      const elapsed = Date.now() - mountedAt;
      const wait = Math.max(MIN_VISIBLE_MS - elapsed, 0);

      timeouts.push(
        setTimeout(() => {
          setExiting(true);
          timeouts.push(
            setTimeout(() => setGone(true), EXIT_DURATION_MS)
          );
        }, wait)
      );
    };

    // Trigger on load event
    if (document.readyState === 'complete') {
      startExit();
    } else {
      window.addEventListener('load', startExit, { once: true });
    }

    // Fallback: if nothing happened after 3.5s, force exit
    const fallback = setTimeout(() => {
      if (!exiting && !gone) {
        setExiting(true);
        setTimeout(() => setGone(true), EXIT_DURATION_MS);
      }
    }, 3500);
    timeouts.push(fallback);

    return () => {
      window.removeEventListener('load', startExit);
      timeouts.forEach(clearTimeout);
    };
  }, [exiting, gone]);

  if (gone) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SPLASH_CSS }} />
      <div className={`spl${exiting ? ' spl--exit' : ''}`} aria-hidden="true" role="presentation">
        <div className="spl__inner">
          <p className="spl__eyebrow">BIENVENID@</p>
          <h1 className="spl__title" aria-label="Cafetería Ébenezer">
            <div className="spl__title-line">
              {LINE1.map((ch, i) => (
                <span key={`l1-${i}`} style={{ animationDelay: `${0.20 + i * 0.062}s` }}>
                  {ch}
                </span>
              ))}
            </div>
            <div className="spl__title-line">
              {LINE2.map((ch, i) => (
                <span key={`l2-${i}`} style={{ animationDelay: `${0.20 + (LINE1.length + 1 + i) * 0.062}s` }}>
                  {ch}
                </span>
              ))}
            </div>
          </h1>
          <div className="spl__rule" aria-hidden="true" />
          <p className="spl__tagline">Café de <b>día</b>&nbsp;·&nbsp;Pizza de <b>noche</b></p>
          <div className="spl__stars" aria-hidden="true">
            {Array.from({ length: 5 }, (_, i) => <span key={i}>★</span>)}
          </div>
          <p className="spl__verse">&ldquo;Hasta aquí nos ha traído el Señor&rdquo;</p>
        </div>
      </div>
    </>
  );
}
