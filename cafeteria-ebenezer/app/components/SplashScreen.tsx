'use client'

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
          'radial-gradient(circle at top, rgba(212,168,83,0.09), transparent 35%), linear-gradient(180deg, #131009 0%, #0e0b08 100%)',
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? 'none' : 'all',
        transition: 'opacity 0.65s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          transform: fadeOut ? 'translateY(-10px) scale(0.98)' : 'translateY(0) scale(1)',
          opacity: fadeOut ? 0 : 1,
          transition: 'transform 0.65s ease, opacity 0.45s ease',
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '999px',
            display: 'grid',
            placeItems: 'center',
            border: '1px solid rgba(212,168,83,0.22)',
            background: 'rgba(212,168,83,0.08)',
            color: '#d4a853',
            fontSize: '1.8rem',
            boxShadow: '0 0 30px rgba(212,168,83,0.08)',
          }}
        >
          ☕
        </div>
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              margin: 0,
              color: '#f2ece0',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
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
