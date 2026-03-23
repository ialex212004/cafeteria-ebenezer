'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function SplashScreen() {
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    let fadeTimer: number | undefined
    let hideTimer: number | undefined
    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    const handleLoad = () => {
      fadeTimer = window.setTimeout(() => {
        setFadeOut(true)
        hideTimer = window.setTimeout(() => {
          setVisible(false)
          document.body.style.overflow = previousOverflow
        }, 650)
      }, 450)
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
    }

    return () => {
      window.removeEventListener('load', handleLoad)
      document.body.style.overflow = previousOverflow

      if (fadeTimer !== undefined) {
        window.clearTimeout(fadeTimer)
      }

      if (hideTimer !== undefined) {
        window.clearTimeout(hideTimer)
      }
    }
  }, [])

  if (!visible) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(circle at top, rgba(212,168,83,0.08), transparent 32%), linear-gradient(180deg, rgba(19,16,9,0.76) 0%, rgba(14,11,8,0.88) 100%)',
        backdropFilter: fadeOut ? 'blur(0px)' : 'blur(18px)',
        WebkitBackdropFilter: fadeOut ? 'blur(0px)' : 'blur(18px)',
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? 'none' : 'all',
        transition: 'opacity 0.7s ease, backdrop-filter 0.7s ease, -webkit-backdrop-filter 0.7s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          width: 'min(92vw, 420px)',
          padding: '2rem 1.75rem',
          borderRadius: '28px',
          border: '1px solid rgba(212,168,83,0.12)',
          background: 'linear-gradient(180deg, rgba(32,26,17,0.74) 0%, rgba(19,16,9,0.58) 100%)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.24), inset 0 1px 0 rgba(242,236,224,0.05)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          transform: fadeOut ? 'translateY(-8px) scale(0.985)' : 'translateY(0) scale(1)',
          opacity: fadeOut ? 0 : 1,
          filter: fadeOut ? 'blur(10px)' : 'blur(0px)',
          transition: 'transform 0.7s ease, opacity 0.55s ease, filter 0.7s ease',
        }}
      >
        <div
          style={{
            width: '84px',
            height: '84px',
            borderRadius: '24px',
            display: 'grid',
            placeItems: 'center',
            border: '1px solid rgba(212,168,83,0.18)',
            background: 'linear-gradient(180deg, rgba(212,168,83,0.12) 0%, rgba(212,168,83,0.04) 100%)',
            boxShadow: '0 12px 28px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.05)',
            overflow: 'hidden',
          }}
        >
          <Image
            src="/favicon.ico"
            alt="Logo de Cafetería Ébenezer"
            width={56}
            height={56}
            unoptimized
            style={{
              width: '56px',
              height: '56px',
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.22))',
            }}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              margin: 0,
              color: '#f2ece0',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '1.3rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Cafetería <span style={{ color: '#d4a853', fontStyle: 'italic', textTransform: 'none' }}>Ébenezer</span>
          </p>
          <p
            style={{
              margin: '0.45rem 0 0',
              color: '#a89880',
              fontFamily: 'Libre Baskerville, serif',
              fontSize: '0.82rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}
          >
            Café de día · Pizza de noche
          </p>
        </div>
      </div>
    </div>
  )
}
