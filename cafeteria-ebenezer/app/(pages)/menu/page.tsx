'use client';

import { useEffect, useState } from 'react';

type MenuTab = 'Cafe' | 'Pizza';

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState<MenuTab>('Cafe');

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
          --bg3: #18140d;
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
          background: var(--bg);
          color: var(--fg);
        }

        .section {
          padding: 7rem 5rem;
          margin-top: 70px;
        }
        .section-surface {
          background: var(--bg3);
          background-image: radial-gradient(ellipse 70% 50% at 85% 15%, rgba(212, 168, 83, 0.05) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 5% 90%, rgba(168, 50, 40, 0.04) 0%, transparent 70%);
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
          justify-content: center;
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

        .menu-header {
          text-align: center;
          margin-bottom: 3.5rem;
        }
        .menu-tabs-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 3.5rem;
        }
        .menu-tabs {
          display: inline-flex;
          border: 1px solid var(--border2);
          padding: 4px;
        }
        .menu-tab {
          font-family: var(--font-body);
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 500;
          padding: 0.65rem 2.2rem;
          border: none;
          background: transparent;
          color: var(--fg3);
          transition: all 0.3s;
        }
        .menu-tab.active {
          background: var(--gold);
          color: var(--bg);
        }
        .menu-tab:not(.active):hover {
          color: var(--fg);
        }
        .menu-content {
          max-width: 720px;
          margin: 0 auto;
        }
        .menu-section-title {
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--fg2);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border);
        }
        .menu-cat {
          margin-bottom: 2.75rem;
        }
        .menu-item {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.9rem 1.1rem;
          border: 1px solid transparent;
          transition: border-color 0.25s, background 0.25s;
        }
        .menu-item:hover {
          border-color: var(--border);
          background: var(--surface);
        }
        .item-name {
          font-family: var(--font-display);
          font-weight: 500;
          font-size: 0.9rem;
          color: var(--fg);
          margin-bottom: 0.2rem;
        }
        .item-desc {
          font-size: 0.78rem;
          color: var(--fg3);
        }
        .item-price {
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--gold);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .reveal {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 1.5s var(--ease-smooth), transform 1.5s var(--ease-smooth);
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

        @media (max-width: 768px) {
          .section {
            padding: 5rem 2rem;
          }
        }
      `}</style>

      <section className="section section-surface">
        <div className="container">
          <div className="menu-header">
            <div className="eyebrow reveal">Nuestro menú</div>
            <h1 className="section-title reveal reveal-delay-1">
              Elige tu <em>experiencia</em>
            </h1>
          </div>
          <div className="menu-tabs-wrap reveal reveal-delay-2">
            <div className="menu-tabs">
              <button className={`menu-tab${activeTab === 'Cafe' ? ' active' : ''}`} onClick={() => setActiveTab('Cafe')}>
                Cafetería
              </button>
              <button className={`menu-tab${activeTab === 'Pizza' ? ' active' : ''}`} onClick={() => setActiveTab('Pizza')}>
                Pizzería
              </button>
            </div>
          </div>
          <div className="menu-content">
            {activeTab === 'Cafe' ? (
              <>
                <div className="menu-cat reveal">
                  <h3 className="menu-section-title">Bebidas Calientes</h3>
                  <div className="menu-item">
                    <div>
                      <div className="item-name">Espresso</div>
                      <div className="item-desc">Intenso y concentrado, doble shot</div>
                    </div>
                    <span className="item-price">€3,50</span>
                  </div>
                  <div className="menu-item">
                    <div>
                      <div className="item-name">Cappuccino</div>
                      <div className="item-desc">Espresso con leche espumada y cacao</div>
                    </div>
                    <span className="item-price">€4,50</span>
                  </div>
                  <div className="menu-item">
                    <div>
                      <div className="item-name">Latte</div>
                      <div className="item-desc">Espresso suave con leche cremosa</div>
                    </div>
                    <span className="item-price">€4,50</span>
                  </div>
                  <div className="menu-item">
                    <div>
                      <div className="item-name">Mocha</div>
                      <div className="item-desc">Espresso con chocolate y crema batida</div>
                    </div>
                    <span className="item-price">€5,00</span>
                  </div>
                  <div className="menu-item">
                    <div>
                      <div className="item-name">Té Chai</div>
                      <div className="item-desc">Té negro con especias y leche</div>
                    </div>
                    <span className="item-price">€4,00</span>
                  </div>
                </div>
                <div className="menu-cat reveal reveal-delay-1">
                  <h3 className="menu-section-title">Bebidas Frías</h3>
                  <div className="menu-item">
                    <div>
                      <div className="item-name">Cold Brew</div>
                      <div className="item-desc">Café infusionado en frío 12 horas</div>
                    </div>
                    <span className="item-price">€5,00</span>
                  </div>
                  <div className="menu-item">
                    <div>
                      <div className="item-name">Frappé de Café</div>
                      <div className="item-desc">Café helado cremoso y dulce</div>
                    </div>
                    <span className="item-price">€5,50</span>
                  </div>
                  <div className="menu-item">
                    <div>
                      <div className="item-name">Limonada Natural</div>
                      <div className="item-desc">Limón fresco con hierbabuena</div>
                    </div>
                    <span className="item-price">€3,50</span>
                  </div>
                </div>
                <div className="menu-cat reveal reveal-delay-2">
                  <h3 className="menu-section-title">Repostería</h3>
                  <div className="menu-item">
                    <div>
                      <div className="item-name">Croissant de Mantequilla</div>
                      <div className="item-desc">Horneado fresco cada mañana</div>
                    </div>
                    <span className="item-price">€3,00</span>
                  </div>
                  <div className="menu-item">
                    <div>
                      <div className="item-name">Cheesecake</div>
                      <div className="item-desc">New York style con frutos rojos</div>
                    </div>
                    <span className="item-price">€5,50</span>
                  </div>
                  <div className="menu-item">
                    <div>
                      <div className="item-name">Brownie</div>
                      <div className="item-desc">Chocolate belga con nueces</div>
                    </div>
                    <span className="item-price">€4,00</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="menu-cat reveal">
                  <h3 className="menu-section-title">Pizzas Clásicas</h3>
                  <div className="menu-item">
                    <div>
                      <div className="item-name">Margherita</div>
                      <div className="item-desc">Salsa de tomate, mozzarella fresca y albahaca</div>
                    </div>
                    <span className="item-price">€10,00</span>
                  </div>
                  <div className="menu-item">
                    <div>
                      <div className="item-name">Pepperoni</div>
                      <div className="item-desc">Pepperoni artesanal con mozzarella fundida</div>
                    </div>
                    <span className="item-price">€12,00</span>
                  </div>
                  <div className="menu-item">
                    <div>
                      <div className="item-name">Hawaiana</div>
                      <div className="item-desc">Jamón, piña caramelizada y queso</div>
                    </div>
                    <span className="item-price">€12,00</span>
                  </div>
                  <div className="menu-item">
                    <div>
                      <div className="item-name">Cuatro Quesos</div>
                      <div className="item-desc">Mozzarella, gorgonzola, parmesano y fontina</div>
                    </div>
                    <span className="item-price">€13,00</span>
                  </div>
                </div>
                <div className="menu-cat reveal reveal-delay-1">
                  <h3 className="menu-section-title">Pizzas Especiales</h3>
                  <div className="menu-item">
                    <div>
                      <div className="item-name">Ébenezer Suprema</div>
                      <div className="item-desc">Carne, chorizo, pimiento, cebolla y aceitunas</div>
                    </div>
                    <span className="item-price">€15,00</span>
                  </div>
                  <div className="menu-item">
                    <div>
                      <div className="item-name">Mediterránea</div>
                      <div className="item-desc">Tomate cherry, rúcula, jamón serrano y parmesano</div>
                    </div>
                    <span className="item-price">€14,00</span>
                  </div>
                  <div className="menu-item">
                    <div>
                      <div className="item-name">BBQ Chicken</div>
                      <div className="item-desc">Pollo, salsa BBQ, cebolla morada y cilantro</div>
                    </div>
                    <span className="item-price">€14,00</span>
                  </div>
                </div>
                <div className="menu-cat reveal reveal-delay-2">
                  <h3 className="menu-section-title">Acompañantes</h3>
                  <div className="menu-item">
                    <div>
                      <div className="item-name">Alitas BBQ</div>
                      <div className="item-desc">8 piezas con salsa casera</div>
                    </div>
                    <span className="item-price">€8,00</span>
                  </div>
                  <div className="menu-item">
                    <div>
                      <div className="item-name">Breadsticks con Queso</div>
                      <div className="item-desc">Pan artesanal con dip de queso</div>
                    </div>
                    <span className="item-price">€5,00</span>
                  </div>
                  <div className="menu-item">
                    <div>
                      <div className="item-name">Ensalada Caesar</div>
                      <div className="item-desc">Lechuga, crutones, parmesano y aderezo</div>
                    </div>
                    <span className="item-price">€6,00</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
