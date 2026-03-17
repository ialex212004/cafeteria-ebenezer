"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Tab = "cafe" | "pizza";

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("cafe");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    const elements = document.querySelectorAll(".reveal, .reveal-left");
    elements.forEach((element) => observer.observe(element));

    return () => {
      window.removeEventListener("scroll", onScroll);
      elements.forEach((element) => observer.unobserve(element));
      observer.disconnect();
    };
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: hsl(210, 40%, 98%);
          --fg: hsl(215, 25%, 20%);
          --card: hsl(0, 0%, 100%);
          --card-fg: hsl(215, 25%, 25%);
          --primary: hsl(217, 91%, 60%);
          --primary-fg: hsl(210, 40%, 98%);
          --secondary: hsl(210, 40%, 90%);
          --muted: hsl(210, 40%, 95%);
          --muted-fg: hsl(215, 20%, 55%);
          --accent: hsl(38, 95%, 55%);
          --accent-fg: hsl(215, 25%, 20%);
          --border: hsl(215, 20%, 88%);
          --hero-dark: hsl(215, 25%, 12%);
          --hero-dark-fg: hsl(210, 40%, 95%);
          --radius: 0.5rem;
          --shadow-card: 0 0 0 1px hsl(215 20% 88% / 0.5), 0 1px 2px -1px hsl(215 25% 20% / 0.05);
          --shadow-card-hover: 0 0 0 1px hsl(215 20% 88% / 0.7), 0 4px 12px hsl(215 25% 20% / 0.08);
          --shadow-btn: 0 0 0 1px hsl(215 25% 20% / 0.07), 0 2px 4px hsl(215 25% 20% / 0.05);
        }

        html { scroll-behavior: smooth; }
        body { font-family: 'Satoshi', sans-serif; background: var(--bg); color: var(--fg); line-height: 1.6; -webkit-font-smoothing: antialiased; }
        h1, h2, h3, h4, h5, h6 { font-family: 'General Sans', sans-serif; letter-spacing: -0.03em; text-wrap: balance; }
        p { text-wrap: pretty; }
        a { text-decoration: none; color: inherit; }
        img { display: block; max-width: 100%; }
        button { cursor: pointer; border: none; font-family: inherit; }

        .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
        .font-display { font-family: 'General Sans', sans-serif; }
        .font-body { font-family: 'Satoshi', sans-serif; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { transform: translateY(-100%); } to { transform: translateY(0); } }

        .animate-fade-up { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .animate-fade-in { animation: fadeIn 0.6s ease both; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
        .delay-5 { animation-delay: 0.5s; }

        .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .reveal-left { opacity: 0; transform: translateX(-30px); transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal-left.visible { opacity: 1; transform: translateX(0); }

        .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 50; transition: all 0.3s ease; animation: slideDown 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .navbar.scrolled { background: hsl(0 0% 100% / 0.9); backdrop-filter: blur(12px); box-shadow: var(--shadow-card); }
        .navbar-inner { display: flex; align-items: center; justify-content: space-between; padding: 1rem 0; }
        .navbar-brand { font-family: 'General Sans', sans-serif; font-size: 1.25rem; font-weight: 700; letter-spacing: -0.03em; color: var(--fg); }
        .nav-links { display: flex; align-items: center; gap: 2rem; list-style: none; }
        .nav-links a { font-family: 'Satoshi', sans-serif; font-size: 0.875rem; font-weight: 500; color: var(--muted-fg); transition: color 0.2s; }
        .nav-links a:hover { color: var(--fg); }
        .mobile-toggle { display: none; background: none; color: var(--fg); padding: 0.5rem; }
        .mobile-menu { display: none; background: hsl(0 0% 100% / 0.95); backdrop-filter: blur(12px); border-top: 1px solid var(--border); padding: 1rem 0; }
        .mobile-menu.open { display: block; }
        .mobile-menu ul { list-style: none; display: flex; flex-direction: column; gap: 1rem; padding: 0 1.5rem; }
        .mobile-menu a { font-size: 1rem; color: var(--fg); }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .mobile-toggle { display: block; }
        }

        .hero { display: flex; min-height: 100vh; }
        .hero-side { position: relative; flex: 1; display: flex; align-items: center; justify-content: center; min-height: 50vh; overflow: hidden; cursor: pointer; transition: flex-grow 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .hero-side:hover { flex-grow: 1.15; }
        .hero-side:hover .hero-img { transform: scale(1.05); }
        .hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s ease; }
        .hero-overlay-light { position: absolute; inset: 0; background: hsl(210 40% 98% / 0.6); }
        .hero-overlay-dark { position: absolute; inset: 0; background: hsl(215 25% 12% / 0.7); }
        .hero-content { position: relative; z-index: 10; text-align: center; padding: 2rem; max-width: 28rem; }
        .hero-label { font-size: 0.875rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1rem; }
        .hero-title { font-size: clamp(2rem, 5vw, 3.75rem); font-weight: 700; margin-bottom: 1rem; }
        .hero-desc { font-size: 1.125rem; max-width: 45ch; margin: 0 auto 2rem; }
        .btn-primary { display: inline-block; font-family: 'General Sans', sans-serif; font-weight: 600; font-size: 0.875rem; padding: 0.75rem 1.5rem; border-radius: var(--radius); background: var(--primary); color: var(--primary-fg); box-shadow: var(--shadow-btn); transition: all 0.2s; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 0 1px hsl(215 25% 20% / 0.07), 0 4px 8px hsl(215 25% 20% / 0.07); }
        .btn-accent { display: inline-block; font-family: 'General Sans', sans-serif; font-weight: 600; font-size: 0.875rem; padding: 0.75rem 1.5rem; border-radius: var(--radius); background: var(--accent); color: var(--accent-fg); box-shadow: var(--shadow-btn); transition: all 0.2s; }
        .btn-accent:hover { transform: translateY(-2px); box-shadow: 0 0 0 1px hsl(215 25% 20% / 0.07), 0 4px 8px hsl(215 25% 20% / 0.07); }

        @media (max-width: 768px) {
          .hero { flex-direction: column; }
        }

        .about { padding: 6rem 0; }
        .about-grid { display: grid; grid-template-columns: 2fr 3fr; gap: 4rem; align-items: center; }
        .about-img-wrapper { position: relative; overflow: hidden; border-radius: 1rem; }
        .about-img-wrapper img { width: 100%; aspect-ratio: 3/4; object-fit: cover; }
        .about-img-wrapper::after { content: ''; position: absolute; inset: 0; border-radius: 1rem; box-shadow: inset 0 0 0 1px hsl(215 25% 20% / 0.1); }
        .about-label { font-size: 0.875rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: var(--primary); margin-bottom: 1rem; }
        .about-title { font-size: clamp(1.75rem, 4vw, 3rem); font-weight: 700; color: var(--fg); margin-bottom: 1.5rem; }
        .about-text { font-size: 1.125rem; color: var(--muted-fg); line-height: 1.7; max-width: 65ch; }
        .about-text + .about-text { margin-top: 1rem; }
        .about-stats { display: flex; gap: 3rem; margin-top: 2.5rem; }
        .about-stat-value { font-family: 'General Sans', sans-serif; font-size: 1.875rem; font-weight: 700; color: var(--fg); }
        .about-stat-label { font-size: 0.875rem; color: var(--muted-fg); margin-top: 0.25rem; }

        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr; gap: 2.5rem; }
          .about-stats { gap: 2rem; flex-wrap: wrap; }
        }

        .menu-section { padding: 6rem 0; background: hsl(210 40% 95% / 0.5); }
        .menu-header { text-align: center; margin-bottom: 4rem; }
        .menu-label { font-size: 0.875rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: var(--primary); margin-bottom: 1rem; }
        .menu-title { font-size: clamp(1.75rem, 4vw, 3rem); font-weight: 700; color: var(--fg); }
        .menu-tabs { display: flex; justify-content: center; margin-bottom: 3rem; }
        .tab-container { display: inline-flex; background: var(--card); border-radius: 0.75rem; padding: 0.375rem; box-shadow: var(--shadow-card); }
        .tab-btn { position: relative; font-family: 'General Sans', sans-serif; font-weight: 600; font-size: 0.875rem; padding: 0.75rem 2rem; border-radius: 0.5rem; background: transparent; color: var(--muted-fg); transition: color 0.2s; }
        .tab-btn.active { color: var(--primary-fg); background: var(--primary); }
        .tab-btn:not(.active):hover { color: var(--fg); }
        .menu-content { max-width: 48rem; margin: 0 auto; }
        .menu-category { margin-bottom: 3rem; }
        .menu-category:last-child { margin-bottom: 0; }
        .menu-cat-title { font-family: 'General Sans', sans-serif; font-size: 1.5rem; font-weight: 700; color: var(--fg); margin-bottom: 1.5rem; }
        .menu-items { display: flex; flex-direction: column; gap: 0.75rem; }
        .menu-item { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; padding: 1.25rem; border-radius: 0.75rem; background: var(--card); box-shadow: var(--shadow-card); transition: box-shadow 0.3s; }
        .menu-item:hover { box-shadow: var(--shadow-card-hover); }
        .menu-item-name { font-family: 'General Sans', sans-serif; font-weight: 600; color: var(--card-fg); }
        .menu-item-desc { font-size: 0.875rem; color: var(--muted-fg); margin-top: 0.25rem; }
        .menu-item-price { font-family: 'General Sans', sans-serif; font-weight: 700; color: var(--primary); white-space: nowrap; }
        .menu-panel { display: none; }
        .menu-panel.active { display: block; animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1); }

        .gallery { padding: 6rem 0; overflow: hidden; }
        .gallery-header { margin-bottom: 3rem; }
        .gallery-label { font-size: 0.875rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: var(--primary); margin-bottom: 1rem; }
        .gallery-title { font-size: clamp(1.75rem, 4vw, 3rem); font-weight: 700; color: var(--fg); }
        .gallery-track { display: flex; gap: 1.5rem; padding: 0 1.5rem; mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%); }
        .gallery-item { flex-shrink: 0; width: 18rem; overflow: hidden; border-radius: 1rem; }
        .gallery-item img { width: 100%; aspect-ratio: 4/5; object-fit: cover; transition: transform 0.7s ease; }
        .gallery-item:hover img { transform: scale(1.05); }

        @media (min-width: 768px) {
          .gallery-item { width: 24rem; }
        }

        .contact { padding: 6rem 0; background: hsl(210 40% 95% / 0.5); }
        .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; }
        .contact-map { border-radius: 1rem; overflow: hidden; min-height: 400px; box-shadow: var(--shadow-card); }
        .contact-map iframe { width: 100%; height: 100%; min-height: 400px; border: 0; }
        .contact-label { font-size: 0.875rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: var(--primary); margin-bottom: 1rem; }
        .contact-title { font-size: clamp(1.75rem, 4vw, 3rem); font-weight: 700; color: var(--fg); margin-bottom: 2.5rem; }
        .contact-info { display: flex; flex-direction: column; justify-content: center; }
        .contact-items { display: flex; flex-direction: column; gap: 2rem; }
        .contact-item { display: flex; gap: 1rem; }
        .contact-icon { width: 2.5rem; height: 2.5rem; border-radius: 0.5rem; background: hsl(217 91% 60% / 0.1); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--primary); }
        .contact-item-title { font-family: 'General Sans', sans-serif; font-weight: 600; color: var(--fg); }
        .contact-item-text { font-size: 0.9375rem; color: var(--muted-fg); margin-top: 0.25rem; }
        .contact-item-text a { transition: color 0.2s; }
        .contact-item-text a:hover { color: var(--primary); }
        .social-links { display: flex; gap: 1rem; margin-top: 2.5rem; }
        .social-link { width: 3rem; height: 3rem; border-radius: 0.75rem; background: var(--card); box-shadow: var(--shadow-card); display: flex; align-items: center; justify-content: center; color: var(--muted-fg); transition: all 0.2s; }
        .social-link:hover { color: var(--primary); transform: scale(1.1); }
        .social-link svg { width: 1.25rem; height: 1.25rem; fill: currentColor; }

        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr; gap: 2.5rem; }
        }

        .footer { padding: 2rem 0; border-top: 1px solid var(--border); }
        .footer-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
        .footer-brand { font-family: 'General Sans', sans-serif; font-weight: 600; color: var(--fg); }
        .footer-tagline { font-size: 0.875rem; color: var(--muted-fg); }
      `}</style>

      <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
      <link
        href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&f[]=satoshi@400,400i,500,700&display=swap"
        rel="stylesheet"
      />

      <nav className={`navbar${scrolled ? " scrolled" : ""}`} id="navbar">
        <div className="container">
          <div className="navbar-inner">
            <a href="#inicio" className="navbar-brand">
              Cafeteria Ebenezer
            </a>
            <ul className="nav-links">
              <li><a href="#inicio">Inicio</a></li>
              <li><a href="#nosotros">Nosotros</a></li>
              <li><a href="#menu">Menu</a></li>
              <li><a href="#galeria">Galeria</a></li>
              <li><a href="#contacto">Contacto</a></li>
            </ul>
            <button
              className="mobile-toggle"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div className={`mobile-menu${mobileOpen ? " open" : ""}`} id="mobileMenu">
          <ul>
            <li><a href="#inicio" onClick={closeMobile}>Inicio</a></li>
            <li><a href="#nosotros" onClick={closeMobile}>Nosotros</a></li>
            <li><a href="#menu" onClick={closeMobile}>Menu</a></li>
            <li><a href="#galeria" onClick={closeMobile}>Galeria</a></li>
            <li><a href="#contacto" onClick={closeMobile}>Contacto</a></li>
          </ul>
        </div>
      </nav>

      <section id="inicio" className="hero">
        <div className="hero-side" onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}>
          <Image
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&q=80"
            alt="Cafe artesanal con latte art"
            className="hero-img"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="hero-overlay-light" />
          <div className="hero-content animate-fade-up delay-2">
            <p className="hero-label" style={{ color: "var(--muted-fg)" }}>Mananas en Ebenezer</p>
            <h1 className="hero-title" style={{ color: "var(--fg)" }}>El arte del buen cafe</h1>
            <p className="hero-desc" style={{ color: "var(--muted-fg)" }}>Despierta tus mananas con granos seleccionados y preparaciones artesanales.</p>
            <a href="#menu" className="btn-primary" onClick={(event) => event.stopPropagation()}>Ver Menu de Cafe</a>
          </div>
        </div>
        <div className="hero-side" onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}>
          <Image
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=80"
            alt="Pizza artesanal con mozzarella fresca"
            className="hero-img"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="hero-overlay-dark" />
          <div className="hero-content animate-fade-up delay-4">
            <p className="hero-label" style={{ color: "hsl(210 40% 95% / 0.6)" }}>Noches en Ebenezer</p>
            <h2 className="hero-title" style={{ color: "var(--hero-dark-fg)" }}>La noche pide pizza</h2>
            <p className="hero-desc" style={{ color: "hsl(210 40% 95% / 0.7)" }}>Ingredientes frescos, horno caliente. Pizzas artesanales que hablan por si solas.</p>
            <a href="#menu" className="btn-accent" onClick={(event) => event.stopPropagation()}>Ver Menu de Pizza</a>
          </div>
        </div>
      </section>

      <section id="nosotros" className="about">
        <div className="container">
          <div className="about-grid">
            <div className="reveal-left">
              <div className="about-img-wrapper">
                <Image
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=700&q=80"
                  alt="Interior de Cafeteria Ebenezer"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
            </div>
            <div className="reveal">
              <p className="about-label">Nuestra historia</p>
              <h2 className="about-title">De la manana a la noche, una misma pasion</h2>
              <p className="about-text">En Cafeteria Ebenezer creemos que los mejores momentos del dia merecen ser acompanados con lo mejor. Por las mananas, nuestro cafe de especialidad despierta los sentidos con aromas que llenan el espacio.</p>
              <p className="about-text">Al caer la tarde, el horno cobra vida y nuestras pizzas artesanales se convierten en el centro de la mesa. Dos experiencias, un solo lugar donde la calidad es la constante.</p>
              <div className="about-stats">
                <div>
                  <p className="about-stat-value">08:00</p>
                  <p className="about-stat-label">Apertura Cafeteria</p>
                </div>
                <div>
                  <p className="about-stat-value">16:00</p>
                  <p className="about-stat-label">Apertura Pizzeria</p>
                </div>
                <div>
                  <p className="about-stat-value">23:00</p>
                  <p className="about-stat-label">Cierre</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="menu-section">
        <div className="container">
          <div className="menu-header reveal">
            <p className="menu-label">Nuestro menu</p>
            <h2 className="menu-title">Elige tu experiencia</h2>
          </div>
          <div className="menu-tabs">
            <div className="tab-container">
              <button className={`tab-btn${activeTab === "cafe" ? " active" : ""}`} onClick={() => setActiveTab("cafe")}>Cafeteria</button>
              <button className={`tab-btn${activeTab === "pizza" ? " active" : ""}`} onClick={() => setActiveTab("pizza")}>Pizzeria</button>
            </div>
          </div>
          <div className="menu-content">
            <div className={`menu-panel${activeTab === "cafe" ? " active" : ""}`} id="panel-cafe">
              <div className="menu-category">
                <h3 className="menu-cat-title">Bebidas Calientes</h3>
                <div className="menu-items">
                  <div className="menu-item"><div><div className="menu-item-name">Espresso</div><div className="menu-item-desc">Intenso y concentrado, doble shot</div></div><span className="menu-item-price">$3.50</span></div>
                  <div className="menu-item"><div><div className="menu-item-name">Cappuccino</div><div className="menu-item-desc">Espresso con leche espumada y cacao</div></div><span className="menu-item-price">$4.50</span></div>
                  <div className="menu-item"><div><div className="menu-item-name">Latte</div><div className="menu-item-desc">Espresso suave con leche cremosa</div></div><span className="menu-item-price">$4.50</span></div>
                  <div className="menu-item"><div><div className="menu-item-name">Mocha</div><div className="menu-item-desc">Espresso con chocolate y crema batida</div></div><span className="menu-item-price">$5.00</span></div>
                  <div className="menu-item"><div><div className="menu-item-name">Te Chai</div><div className="menu-item-desc">Te negro con especias y leche</div></div><span className="menu-item-price">$4.00</span></div>
                </div>
              </div>
              <div className="menu-category">
                <h3 className="menu-cat-title">Bebidas Frias</h3>
                <div className="menu-items">
                  <div className="menu-item"><div><div className="menu-item-name">Cold Brew</div><div className="menu-item-desc">Cafe infusionado en frio 12 horas</div></div><span className="menu-item-price">$5.00</span></div>
                  <div className="menu-item"><div><div className="menu-item-name">Frappe de Cafe</div><div className="menu-item-desc">Cafe helado cremoso y dulce</div></div><span className="menu-item-price">$5.50</span></div>
                  <div className="menu-item"><div><div className="menu-item-name">Limonada Natural</div><div className="menu-item-desc">Limon fresco con hierbabuena</div></div><span className="menu-item-price">$3.50</span></div>
                </div>
              </div>
              <div className="menu-category">
                <h3 className="menu-cat-title">Reposteria</h3>
                <div className="menu-items">
                  <div className="menu-item"><div><div className="menu-item-name">Croissant de Mantequilla</div><div className="menu-item-desc">Horneado fresco cada manana</div></div><span className="menu-item-price">$3.00</span></div>
                  <div className="menu-item"><div><div className="menu-item-name">Cheesecake</div><div className="menu-item-desc">New York style con frutos rojos</div></div><span className="menu-item-price">$5.50</span></div>
                  <div className="menu-item"><div><div className="menu-item-name">Brownie</div><div className="menu-item-desc">Chocolate belga con nueces</div></div><span className="menu-item-price">$4.00</span></div>
                </div>
              </div>
            </div>
            <div className={`menu-panel${activeTab === "pizza" ? " active" : ""}`} id="panel-pizza">
              <div className="menu-category">
                <h3 className="menu-cat-title">Pizzas Clasicas</h3>
                <div className="menu-items">
                  <div className="menu-item"><div><div className="menu-item-name">Margherita</div><div className="menu-item-desc">Salsa de tomate, mozzarella fresca y albahaca</div></div><span className="menu-item-price">$10.00</span></div>
                  <div className="menu-item"><div><div className="menu-item-name">Pepperoni</div><div className="menu-item-desc">Pepperoni artesanal con mozzarella fundida</div></div><span className="menu-item-price">$12.00</span></div>
                  <div className="menu-item"><div><div className="menu-item-name">Hawaiana</div><div className="menu-item-desc">Jamon, pina caramelizada y queso</div></div><span className="menu-item-price">$12.00</span></div>
                  <div className="menu-item"><div><div className="menu-item-name">Cuatro Quesos</div><div className="menu-item-desc">Mozzarella, gorgonzola, parmesano y fontina</div></div><span className="menu-item-price">$13.00</span></div>
                </div>
              </div>
              <div className="menu-category">
                <h3 className="menu-cat-title">Pizzas Especiales</h3>
                <div className="menu-items">
                  <div className="menu-item"><div><div className="menu-item-name">Ebenezer Suprema</div><div className="menu-item-desc">Carne, chorizo, pimiento, cebolla y aceitunas</div></div><span className="menu-item-price">$15.00</span></div>
                  <div className="menu-item"><div><div className="menu-item-name">Mediterranea</div><div className="menu-item-desc">Tomate cherry, rucula, jamon serrano y parmesano</div></div><span className="menu-item-price">$14.00</span></div>
                  <div className="menu-item"><div><div className="menu-item-name">BBQ Chicken</div><div className="menu-item-desc">Pollo, salsa BBQ, cebolla morada y cilantro</div></div><span className="menu-item-price">$14.00</span></div>
                </div>
              </div>
              <div className="menu-category">
                <h3 className="menu-cat-title">Acompanantes</h3>
                <div className="menu-items">
                  <div className="menu-item"><div><div className="menu-item-name">Alitas BBQ</div><div className="menu-item-desc">8 piezas con salsa casera</div></div><span className="menu-item-price">$8.00</span></div>
                  <div className="menu-item"><div><div className="menu-item-name">Breadsticks con Queso</div><div className="menu-item-desc">Pan artesanal con dip de queso</div></div><span className="menu-item-price">$5.00</span></div>
                  <div className="menu-item"><div><div className="menu-item-name">Ensalada Caesar</div><div className="menu-item-desc">Lechuga, crutones, parmesano y aderezo</div></div><span className="menu-item-price">$6.00</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="galeria" className="gallery">
        <div className="container gallery-header reveal">
          <p className="gallery-label">La experiencia</p>
          <h2 className="gallery-title">Momentos que nos definen</h2>
        </div>
        <div className="gallery-track">
          <div className="gallery-item">
            <Image
              src="https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=600&q=80"
              alt="Croissant artesanal recien horneado"
              width={600}
              height={750}
              sizes="(max-width: 768px) 18rem, 24rem"
            />
          </div>
          <div className="gallery-item">
            <Image
              src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&q=80"
              alt="Espresso preparado con precision"
              width={600}
              height={750}
              sizes="(max-width: 768px) 18rem, 24rem"
            />
          </div>
          <div className="gallery-item">
            <Image
              src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80"
              alt="Pizza margherita con queso derretido"
              width={600}
              height={750}
              sizes="(max-width: 768px) 18rem, 24rem"
            />
          </div>
          <div className="gallery-item">
            <Image
              src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&q=80"
              alt="Clientes disfrutando en la cafeteria"
              width={600}
              height={750}
              sizes="(max-width: 768px) 18rem, 24rem"
            />
          </div>
        </div>
      </section>

      <section id="contacto" className="contact">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-map reveal-left">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.0!2d-73.9857!3d40.7484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ0JzU0LjIiTiA3M8KwNTknMDguNSJX!5e0!3m2!1ses!2sus!4v1234567890"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicacion de Cafeteria Ebenezer"
              />
            </div>
            <div className="contact-info reveal">
              <p className="contact-label">Visitanos</p>
              <h2 className="contact-title">Te esperamos</h2>
              <div className="contact-items">
                <div className="contact-item">
                  <div className="contact-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  </div>
                  <div>
                    <h4 className="contact-item-title">Direccion</h4>
                    <p className="contact-item-text">Calle Principal #123, Centro</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  </div>
                  <div>
                    <h4 className="contact-item-title">Horarios</h4>
                    <p className="contact-item-text">Cafeteria: 08:00 - 16:00</p>
                    <p className="contact-item-text">Pizzeria: 16:00 - 23:00</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  </div>
                  <div>
                    <h4 className="contact-item-title">Telefono</h4>
                    <p className="contact-item-text"><a href="tel:+1234567890">+1 (234) 567-890</a></p>
                  </div>
                </div>
              </div>
              <div className="social-links">
                <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="WhatsApp">
                  <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                </a>
                <a href="https://instagram.com/cafeteriaebenezer" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                  <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <p className="footer-brand">Cafeteria Ebenezer</p>
            <p className="footer-tagline">Cafe de dia. Pizza de noche.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
