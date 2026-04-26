'use client';

import { useEffect, useState } from 'react';

type MenuTab = 'Cafe' | 'Pizza';

type MenuItem = {
  name: string;
  desc?: string;
  price?: string;
  highlight?: boolean;
  allergens?: string[];
};

type MenuCategory = {
  title: string;
  items: MenuItem[];
};

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

const cafeMenu: MenuCategory[] = [
  {
    title: 'Desayunos',
    items: [
      { name: 'Tosta de tomate + café o té', price: '3,25', allergens: ['Gluten'] },
      { name: 'Media tosta de tomate + café o té', price: '2,75', allergens: ['Gluten'] },
      { name: 'Tosta de mermelada y mantequilla + café o té', price: '3,75', allergens: ['Gluten', 'Leche'] },
      { name: 'Media tosta de mermelada y mantequilla + café o té', price: '3,00', allergens: ['Gluten', 'Leche'] },
      { name: 'Tosta de aguacate y atún', price: '6,00', desc: 'Queso crema, tomate cherry, cebollino, sésamo', allergens: ['Gluten', 'Pescado', 'Leche', 'Sésamo'] },
      { name: 'Tosta de jamón serrano', price: '6,00', allergens: ['Gluten'] },
      { name: 'Tosta de jamón cocido o pavo', price: '5,50', allergens: ['Gluten'] },
      { name: 'Tosta de jamón cocido/pavo y queso', price: '6,50', allergens: ['Gluten', 'Leche'] },
      { name: 'Tosta de salmón y aguacate', price: '10,00', desc: 'Queso crema, salsa de naranja, sésamo', allergens: ['Gluten', 'Pescado', 'Leche', 'Sésamo'] },
      { name: 'Tosta de aguacate y tomate cherry', price: '5,50', allergens: ['Gluten', 'Leche', 'Sésamo'] },
      { name: 'Tosta Ebenezer', price: '12,00', desc: 'Aguacate, bacon, huevos, queso manchego…', highlight: true, allergens: ['Gluten', 'Huevos', 'Leche', 'Sésamo'] },
      { name: 'Tosta de cerdo asado', price: '11,00', allergens: ['Gluten', 'Huevos', 'Leche', 'Sésamo'] },
      { name: 'Healthy Toast', price: '8,00', desc: 'Brioche, mantequilla, sirope, frutas', allergens: ['Gluten', 'Leche'] },
      { name: 'Desayuno Edén', price: '13,00', desc: 'Tosta + yogur + granola + bebida', highlight: true, allergens: ['Gluten', 'Leche', 'Frutos secos', 'Sésamo'] },
    ],
  },
  {
    title: 'Sándwiches',
    items: [
      { name: 'Sándwich de pollo', price: '8,50', allergens: ['Gluten', 'Leche', 'Sésamo'] },
      { name: 'Sándwich jamón cocido y mozzarella', allergens: ['Gluten', 'Leche', 'Sésamo'] },
      { name: 'Sándwich pavo, provolone y mozzarella', allergens: ['Gluten', 'Leche', 'Sésamo'] },
      { name: 'Sándwich de pastrami', price: '10,50', allergens: ['Gluten', 'Leche', 'Mostaza', 'Sésamo'] },
    ],
  },
  {
    title: 'Huevos Benedict & Otros',
    items: [
      { name: 'Huevos Benedict con bacon', price: '9,00', allergens: ['Gluten', 'Huevos', 'Leche', 'Sésamo'] },
      { name: 'Huevos Benedict clásicos', price: '8,50', allergens: ['Gluten', 'Huevos', 'Leche'] },
      { name: 'Huevos Benedict con aguacate', price: '9,00', allergens: ['Gluten', 'Huevos', 'Leche', 'Sésamo'] },
      { name: 'Bocadillo cubano', price: '10,00', allergens: ['Gluten'] },
    ],
  },
  {
    title: 'Bollería & Tartas',
    items: [
      { name: 'Croissant', price: '2,50', allergens: ['Gluten', 'Leche'] },
      { name: 'Napolitana de chocolate', price: '2,50', allergens: ['Gluten', 'Leche', 'Soja'] },
      { name: 'Pastel de hojaldre con frutas', price: '2,00', allergens: ['Gluten'] },
      { name: 'Croissant jamón y queso', price: '5,00', allergens: ['Gluten', 'Leche'] },
      { name: 'Croissant con mermelada', price: '4,50', allergens: ['Gluten', 'Leche'] },
      { name: 'Petit choux (petisú)', price: '2,50', allergens: ['Gluten', 'Huevos', 'Leche'] },
      { name: 'Tres leches', price: '4,00', allergens: ['Leche', 'Huevos'] },
      { name: 'Beso de ángel', price: '4,50', allergens: ['Leche', 'Huevos'] },
      { name: 'Chocoflan', price: '4,50', allergens: ['Leche', 'Huevos'] },
    ],
  },
  {
    title: 'Cafés',
    items: [
      { name: 'Espresso', price: '1,50' },
      { name: 'Cortado', price: '1,50', allergens: ['Leche'] },
      { name: 'Café con leche', price: '1,60 / 1,80', allergens: ['Leche'] },
      { name: 'Americano', price: '1,75' },
      { name: 'Ice latte', price: '2,75', allergens: ['Leche'] },
      { name: 'Bombón', price: '2,50', allergens: ['Leche'] },
      { name: 'Capuchino', price: '2,50', allergens: ['Leche'] },
      { name: 'Frappé', price: '3,00', allergens: ['Leche'] },
      { name: 'ColaCao', price: '2,25', allergens: ['Leche'] },
    ],
  },
  {
    title: 'Bebidas',
    items: [
      { name: 'Refrescos', price: '2,70' },
      { name: 'Agua', price: '1,60' },
      { name: 'Agua con gas', price: '1,80' },
      { name: 'Zumo natural', price: '2,75' },
      { name: 'Batidos', price: '5,00', allergens: ['Leche'] },
      { name: 'Limonada de coco', price: '5,50' },
      { name: 'Piña colada', price: '5,50', allergens: ['Leche'] },
      { name: 'Tés e infusiones', price: '1,75' },
      { name: 'Tés especiales', price: '2,25' },
    ],
  },
];

const pizzaMenu: MenuCategory[] = [
  {
    title: 'Pizzas',
    items: [
      { name: 'Pizza queso', price: '10,00', allergens: ['Gluten', 'Leche'] },
      { name: 'Hawaiana', price: '11,50', allergens: ['Gluten', 'Leche'] },
      { name: 'Pollo / Cerdo / Vegetales / Pepperoni', price: '12,50', allergens: ['Gluten', 'Leche'] },
      { name: 'Manggarina', price: '13,00', allergens: ['Gluten', 'Leche', 'Frutos secos'] },
      { name: 'Cuatro estaciones', price: '14,00', allergens: ['Gluten', 'Leche'] },
      { name: 'Carbonara', price: '14,00', allergens: ['Gluten', 'Leche', 'Huevos', 'Frutos secos'] },
    ],
  },
];

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState<MenuTab>('Cafe');

  useEffect(() => {
    let observer: IntersectionObserver;

    const frameId = requestAnimationFrame(() => {
      observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('visible');
              observer.unobserve(e.target);
            }
          }),
        { threshold: 0.08 }
      );
      document
        .querySelectorAll('.menu-body .reveal:not(.visible)')
        .forEach((el) => observer.observe(el));
    });

    return () => {
      cancelAnimationFrame(frameId);
      observer?.disconnect();
    };
  }, [activeTab]);

  const categories = activeTab === 'Cafe' ? cafeMenu : pizzaMenu;

  return (
    <>
      <style jsx global>{`
        .menu-hero {
          position: relative;
          margin-top: var(--stack);
          padding: clamp(6rem, 10vw, 10rem) clamp(1.5rem, 5vw, 5rem) clamp(3rem, 6vw, 5rem);
          text-align: center;
          background:
            radial-gradient(ellipse 80% 50% at 50% 0%, rgba(201, 169, 110, 0.06) 0%, transparent 70%),
            var(--obsidian);
          border-bottom: 1px solid var(--border-hair);
        }
        .menu-hero-inner {
          max-width: 860px;
          margin: 0 auto;
        }
        .menu-hero h1 {
          font-family: var(--font-display);
          font-weight: 300;
          font-size: clamp(3rem, 6vw, 5.6rem);
          line-height: 1;
          color: var(--pearl);
          margin: 1.5rem 0;
          letter-spacing: -0.015em;
        }
        .menu-hero h1 em {
          font-style: italic;
          color: var(--champagne);
          font-weight: 400;
        }
        .menu-hero p {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 1.0625rem;
          color: var(--taupe);
          line-height: 1.85;
          max-width: 54ch;
          margin: 0 auto;
        }
        .menu-hero .ornament {
          font-family: var(--font-italiana);
          font-size: 1.4rem;
          color: var(--champagne);
          letter-spacing: 0.4em;
          opacity: 0.7;
          margin: 2.5rem 0 1.5rem;
        }
        .menu-hero .ornament span {
          display: inline-block;
          margin: 0 0.6em;
        }

        /* ── Tabs ── */
        .menu-tabs-wrap {
          display: flex;
          justify-content: center;
          padding: clamp(3rem, 5vw, 5rem) 1.5rem 1rem;
          background: var(--obsidian);
        }
        .menu-tabs {
          display: inline-flex;
          gap: 0;
          position: relative;
          padding: 0;
        }
        .menu-tab {
          font-family: var(--font-sans);
          font-size: 0.66rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          font-weight: 400;
          padding: 1.1rem 2.6rem;
          color: var(--stone);
          border: 1px solid var(--border-hair);
          background: transparent;
          transition: color 0.55s var(--ease-silk), border-color 0.55s var(--ease-silk),
            background 0.55s var(--ease-silk);
          position: relative;
        }
        .menu-tab + .menu-tab {
          border-left: none;
        }
        .menu-tab.active {
          color: var(--ink);
          background: var(--champagne);
          border-color: var(--champagne);
        }
        .menu-tab:not(.active):hover {
          color: var(--pearl);
          border-color: var(--border-soft);
        }
        .menu-tab small {
          display: block;
          font-family: var(--font-italiana);
          font-size: 0.9rem;
          margin-top: 0.4rem;
          letter-spacing: 0.05em;
          text-transform: none;
          color: inherit;
        }

        /* ── Menu body ── */
        .menu-body {
          padding: clamp(3rem, 6vw, 6rem) clamp(1.5rem, 5vw, 5rem) clamp(6rem, 10vw, 10rem);
          background: linear-gradient(180deg, var(--obsidian) 0%, var(--onyx) 60%, var(--obsidian) 100%);
        }
        .menu-body-inner {
          max-width: 860px;
          margin: 0 auto;
        }
        .menu-category {
          margin-bottom: 5rem;
        }
        .menu-category-head {
          display: flex;
          align-items: baseline;
          gap: 2rem;
          padding-bottom: 2rem;
          margin-bottom: 2.5rem;
          border-bottom: 1px solid var(--border-hair);
          position: relative;
        }
        .menu-category-head::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -1px;
          width: 80px;
          height: 1px;
          background: var(--champagne);
        }
        .menu-category-num {
          font-family: var(--font-italiana);
          font-size: 2.4rem;
          color: var(--champagne);
          line-height: 1;
          opacity: 0.8;
        }
        .menu-category-title {
          font-family: var(--font-display);
          font-weight: 300;
          font-size: clamp(1.6rem, 2.8vw, 2.4rem);
          color: var(--pearl);
          letter-spacing: -0.005em;
        }
        .menu-category-title em {
          font-style: italic;
          color: var(--champagne);
        }

        .menu-item {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 2rem;
          padding: 1.5rem 0;
          border-bottom: 1px dashed rgba(201, 169, 110, 0.1);
          align-items: baseline;
          transition: padding 0.5s var(--ease-silk);
        }
        .menu-item:last-child {
          border-bottom: none;
        }
        .menu-item:hover {
          padding-left: 1rem;
        }
        .menu-item-name {
          display: flex;
          align-items: baseline;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 0.45rem;
        }
        .menu-item-name h4 {
          font-family: var(--font-display);
          font-weight: 500;
          font-size: 1.18rem;
          color: var(--pearl);
          letter-spacing: 0;
        }
        .menu-item-note {
          font-family: var(--font-sans);
          font-size: 0.54rem;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--champagne);
          padding: 0.25rem 0.65rem;
          border: 1px solid rgba(201, 169, 110, 0.3);
          font-weight: 400;
        }
        .menu-item-desc {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 1rem;
          color: var(--stone);
          line-height: 1.7;
          max-width: 52ch;
        }
        .menu-item-price {
          font-family: var(--font-display);
          font-weight: 400;
          font-size: 1.35rem;
          color: var(--champagne);
          white-space: nowrap;
          letter-spacing: 0.01em;
          position: relative;
          padding-left: 1rem;
        }
        .menu-item-price::before {
          content: '€';
          font-family: var(--font-italiana);
          font-size: 0.9em;
          margin-right: 0.15em;
          opacity: 0.8;
        }
        .menu-item-allergens {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-top: 0.5rem;
        }
        .allergen-badge {
          font-family: var(--font-sans);
          font-size: 0.5rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--stone);
          padding: 0.15rem 0.5rem;
          border: 1px solid rgba(139, 98, 80, 0.25);
          font-weight: 400;
        }
        .menu-item-price--consult {
          color: var(--stone);
          font-size: 0.9rem;
          letter-spacing: 0.1em;
          font-family: var(--font-sans);
          text-transform: uppercase;
        }
        .menu-item-price--consult::before {
          content: '';
        }

        /* ── Footer of menu ── */
        .menu-footer {
          text-align: center;
          margin-top: 5rem;
          padding-top: 3.5rem;
          border-top: 1px solid var(--border-hair);
        }
        .menu-footer-mark {
          font-family: var(--font-italiana);
          font-size: 1.1rem;
          color: var(--champagne);
          letter-spacing: 0.3em;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
        }
        .menu-footer-quote {
          font-family: var(--font-display);
          font-style: italic;
          font-size: clamp(1.1rem, 1.8vw, 1.5rem);
          color: var(--taupe);
          max-width: 50ch;
          margin: 0 auto 2rem;
          line-height: 1.65;
        }
        .menu-footer-note {
          font-family: var(--font-sans);
          font-size: 0.58rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--stone);
        }
        .menu-footer-note b {
          color: var(--champagne);
          font-weight: 400;
        }

        @media (max-width: 768px) {
          .menu-item {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
          .menu-item-price {
            padding-left: 0;
            font-size: 1.15rem;
          }
          .menu-category-head {
            flex-direction: column;
            gap: 0.75rem;
          }
          .menu-tab {
            padding: 0.9rem 1.6rem;
            font-size: 0.58rem;
          }
          .menu-hero {
            padding: clamp(4rem, 8vw, 6rem) clamp(1.25rem, 4vw, 4rem) clamp(2rem, 5vw, 3rem);
          }
          .menu-body {
            padding: clamp(2rem, 5vw, 4rem) clamp(1.25rem, 4vw, 4rem) clamp(4rem, 8vw, 7rem);
          }
          .menu-item:hover {
            padding-left: 0;
          }
          .menu-item-desc {
            max-width: 100%;
          }
        }
        @media (max-width: 480px) {
          .menu-tabs-wrap {
            padding: clamp(2rem, 5vw, 3rem) 1.25rem 0.75rem;
          }
          .menu-tab {
            padding: 0.85rem 1.4rem;
            font-size: 0.56rem;
          }
          .menu-tab small {
            font-size: 0.8rem;
          }
          .menu-category-num {
            font-size: 1.8rem;
          }
          .menu-item {
            padding: 1.25rem 0;
          }
          .menu-item-name h4 {
            font-size: 1.05rem;
          }
          .menu-category {
            margin-bottom: 3.5rem;
          }
        }
        @media (max-width: 390px) {
          .menu-tabs-wrap {
            padding: clamp(1.75rem, 5vw, 2.5rem) 1rem 0.75rem;
          }
          .menu-tab {
            padding: 0.8rem 1.1rem;
            font-size: 0.54rem;
            letter-spacing: 0.22em;
          }
          .menu-tab small {
            font-size: 0.75rem;
          }
          .menu-item-name h4 {
            font-size: 1rem;
          }
          .menu-item-desc {
            font-size: 0.82rem;
          }
          .menu-item-price {
            font-size: 1.05rem;
          }
          .menu-body {
            padding: clamp(1.5rem, 4vw, 3rem) 1rem clamp(3rem, 7vw, 5rem);
          }
          .menu-category-num {
            font-size: 1.6rem;
          }
          .menu-category-title {
            font-size: clamp(1.3rem, 5vw, 1.8rem);
          }
        }
      `}</style>

      <section className="menu-hero">
        <div className="menu-hero-inner">
          <div className="eyebrow center reveal">La carta</div>
          <h1 className="reveal reveal-delay-1">
            Sabores de casa,
            <br />
            <em>hechos con amor</em>
          </h1>
          <div className="ornament reveal reveal-delay-2">
            <span>✦</span>
            <span>✦</span>
            <span>✦</span>
          </div>
          <p className="reveal reveal-delay-3">
            De mañana a noche, café de especialidad y desayunos caseros;
            de tarde en adelante, pizzas artesanales con ingredientes que se notan.
            Todo hecho con las manos y el corazón de una familia cubana.
          </p>
        </div>
      </section>

      <div className="menu-tabs-wrap">
        <div className="menu-tabs reveal" role="tablist" aria-label="Sección del menú">
          <button
            role="tab"
            aria-selected={activeTab === 'Cafe'}
            aria-controls="menu-panel"
            id="tab-cafe"
            className={`menu-tab${activeTab === 'Cafe' ? ' active' : ''}`}
            onClick={() => setActiveTab('Cafe')}
          >
            Cafetería
            <small>— Día —</small>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'Pizza'}
            aria-controls="menu-panel"
            id="tab-pizza"
            className={`menu-tab${activeTab === 'Pizza' ? ' active' : ''}`}
            onClick={() => setActiveTab('Pizza')}
          >
            Pizzería
            <small>— Noche —</small>
          </button>
        </div>
      </div>

      <section
        id="menu-panel"
        className="menu-body"
        role="tabpanel"
        aria-labelledby={activeTab === 'Cafe' ? 'tab-cafe' : 'tab-pizza'}
      >
        <div className="menu-body-inner">
          {categories.map((cat, i) => (
            <div className={`menu-category reveal reveal-delay-${(i % 3) + 1}`} key={`${activeTab}-${cat.title}`}>
              <div className="menu-category-head">
                <span className="menu-category-num">{ROMAN[i]}</span>
                <h2 className="menu-category-title">
                  <em>{cat.title.split(' ')[0]}</em>
                  {cat.title.split(' ').slice(1).join(' ') ? ' ' + cat.title.split(' ').slice(1).join(' ') : ''}
                </h2>
              </div>
              {cat.items.map((item) => (
                <div className="menu-item" key={item.name}>
                  <div>
                    <div className="menu-item-name">
                      <h4>{item.name}</h4>
                      {item.highlight && <span className="menu-item-note">Especialidad</span>}
                    </div>
                    {item.desc && <p className="menu-item-desc">{item.desc}</p>}
                    {item.allergens && item.allergens.length > 0 && (
                      <div className="menu-item-allergens">
                        {item.allergens.map((a) => (
                          <span className="allergen-badge" key={a}>{a}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  {item.price ? (
                    <div className="menu-item-price">{item.price}</div>
                  ) : (
                    <div className="menu-item-price menu-item-price--consult">Consultar</div>
                  )}
                </div>
              ))}
            </div>
          ))}

          <div className="menu-footer">
            <div className="menu-footer-mark">— · —</div>
            <p className="menu-footer-quote">
              &ldquo;En casa de mi madre en Cuba, la cocina siempre olía a algo rico.
              Intentamos que Ébenezer huela igual cada día.&rdquo;
            </p>
            <p className="menu-footer-note">
              Todos los productos pueden contener <b>trazas</b> por contaminación cruzada
              &nbsp;·&nbsp; Consulte al personal ante cualquier <b>alergia</b>
              &nbsp;·&nbsp; Precios con <b>IVA incluido</b>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
