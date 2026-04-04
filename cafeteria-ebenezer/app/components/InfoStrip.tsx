'use client';

export default function InfoStrip() {
  return (
    <>
      <style jsx>{`
        .info-strip {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 2.5rem;
          background: linear-gradient(90deg, rgba(26, 15, 10, 0.98) 0%, rgba(26, 15, 10, 0.95) 100%);
          border-bottom: 1px solid rgba(212, 168, 83, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 35;
          backdrop-filter: blur(8px);
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          font-family: 'Poppins', sans-serif;
          font-weight: 400;
        }

        .info-strip-content {
          display: flex;
          align-items: center;
          gap: 2rem;
          color: rgba(242, 236, 224, 0.85);
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          white-space: nowrap;
        }

        .info-bullet {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #d4a853;
          display: inline-block;
        }

        .info-text {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .info-highlight {
          color: #d4a853;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .info-strip {
            height: 2.25rem;
            font-size: 0.65rem;
          }

          .info-strip-content {
            gap: 1rem;
            padding: 0 1rem;
          }

          .info-item {
            gap: 0.4rem;
          }
        }

        @media (max-width: 480px) {
          .info-strip-content {
            flex-direction: column;
            gap: 0.5rem;
          }

          .info-item {
            gap: 0.3rem;
          }
        }
      `}</style>

      <div className="info-strip">
        <div className="info-strip-content">
          <div className="info-item">
            <span className="info-bullet" />
            <span className="info-text">
              <span className="info-highlight">08:00 – 23:00</span>
              <span>Lunes a Domingo</span>
            </span>
          </div>
          <div className="info-item">
            <span className="info-bullet" />
            <span className="info-text">
              <span>Valdepeñas, Ciudad Real</span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
