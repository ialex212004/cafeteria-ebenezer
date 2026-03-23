'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

const MINIMUM_VISIBLE_MS = 1100
const EXIT_DURATION_MS = 760

export default function SplashScreen() {
  const [visible, setVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    let exitTimer: number | undefined
    let hideTimer: number | undefined
    let frameId: number | undefined
    let exited = false

    const startedAt = performance.now()
    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    const restoreBody = () => {
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
    }

    const beginExit = () => {
      if (exited) return
      exited = true

      const elapsed = performance.now() - startedAt
      const remaining = Math.max(MINIMUM_VISIBLE_MS - elapsed, 0)

      exitTimer = window.setTimeout(() => {
        frameId = window.requestAnimationFrame(() => {
          setIsExiting(true)
        })

        hideTimer = window.setTimeout(() => {
          setVisible(false)
          restoreBody()
        }, reducedMotion ? 0 : EXIT_DURATION_MS)
      }, remaining)
    }

    if (document.readyState === 'complete') {
      beginExit()
    } else {
      window.addEventListener('load', beginExit, { once: true })
    }

    return () => {
      window.removeEventListener('load', beginExit)
      restoreBody()

      if (exitTimer !== undefined) {
        window.clearTimeout(exitTimer)
      }

      if (hideTimer !== undefined) {
        window.clearTimeout(hideTimer)
      }

      if (frameId !== undefined) {
        window.cancelAnimationFrame(frameId)
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
        padding: '1.5rem',
        background:
          'radial-gradient(circle at 50% 18%, rgba(212,168,83,0.10), transparent 30%), radial-gradient(circle at 85% 80%, rgba(168,50,40,0.10), transparent 28%), linear-gradient(180deg, rgba(16,12,8,0.88) 0%, rgba(10,8,6,0.94) 100%)',
        backdropFilter: isExiting ? 'blur(8px)' : 'blur(18px)',
        WebkitBackdropFilter: isExiting ? 'blur(8px)' : 'blur(18px)',
        opacity: isExiting ? 0 : 1,
        pointerEvents: isExiting ? 'none' : 'all',
        transition:
          'opacity 0.76s cubic-bezier(0.22, 1, 0.36, 1), backdrop-filter 0.76s cubic-bezier(0.22, 1, 0.36, 1), -webkit-backdrop-filter 0.76s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <div
        style={{
          width: 'min(92vw, 460px)',
          padding: '2.35rem 2rem 2.1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.15rem',
          borderRadius: '30px',
          border: '1px solid rgba(212,168,83,0.16)',
          background:
            'linear-gradient(180deg, rgba(34,27,18,0.92) 0%, rgba(20,16,10,0.88) 100%)',
          boxShadow:
            '0 30px 80px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,245,224,0.05)',
          transform: isExiting ? 'translateY(-8px) scale(0.988)' : 'translateY(0) scale(1)',
          opacity: isExiting ? 0 : 1,
          filter: isExiting ? 'blur(6px)' : 'blur(0px)',
          transition:
            'transform 0.76s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.58s ease, filter 0.76s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div
          style={{
            width: '88px',
            height: '88px',
            display: 'grid',
            placeItems: 'center',
            borderRadius: '24px',
            border: '1px solid rgba(212,168,83,0.2)',
            background:
              'linear-gradient(180deg, rgba(212,168,83,0.14) 0%, rgba(212,168,83,0.05) 100%)',
            boxShadow:
              '0 14px 32px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.05)',
            overflow: 'hidden',
          }}
        >
          <Image
            src="/favicon.ico"
            alt="Logo de Cafetería Ébenezer"
            width={58}
            height={58}
            priority
            unoptimized
            style={{
              width: '58px',
              height: '58px',
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.24))',
            }}
          />
        </div>

        <div
          style={{
            width: '72px',
            height: '1px',
            background:
              'linear-gradient(90deg, transparent 0%, rgba(212,168,83,0.7) 50%, transparent 100%)',
          }}
        />

        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              margin: 0,
              color: '#f6efe3',
              fontFamily: 'Poppins, sans-serif',
              fontSize: 'clamp(1.2rem, 2vw, 1.52rem)',
              fontWeight: 700,
              letterSpacing: '0.11em',
              textTransform: 'uppercase',
              lineHeight: 1.06,
              textShadow: '0 2px 14px rgba(0,0,0,0.18)',
            }}
          >
            Cafetería{' '}
            <span
              style={{
                color: '#d9ac57',
                fontStyle: 'italic',
                textTransform: 'none',
                letterSpacing: '0.06em',
              }}
            >
              Ébenezer
            </span>
          </p>
          <p
            style={{
              margin: '0.55rem 0 0',
              color: '#bca88c',
              fontFamily: 'Libre Baskerville, serif',
              fontSize: '0.84rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              lineHeight: 1.45,
            }}
          >
            Café de día · Pizza de noche
          </p>
        </div>
      </div>
    </div>
  )
}
