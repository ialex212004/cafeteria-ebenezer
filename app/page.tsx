"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

const orderInitial = {
  nombre: "",
  telefono: "",
  producto: "",
  cantidad: "1",
  notas: "",
};

const reviewInitial = {
  nombre: "",
  ciudad: "",
  texto: "",
};

export default function Page() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [orderForm, setOrderForm] = useState(orderInitial);
  const [reviewForm, setReviewForm] = useState(reviewInitial);
  const [orderMsg, setOrderMsg] = useState<{ type: "ok" | "err" | ""; text: string }>({ type: "", text: "" });
  const [reviewMsg, setReviewMsg] = useState<{ type: "ok" | "err" | ""; text: string }>({ type: "", text: "" });
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const apiBase = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.hostname === "localhost" ? "http://localhost:3000" : "";
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("vis");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const handler = () => {
      const header = document.getElementById("site-header");
      if (!header) return;
      header.style.boxShadow = window.scrollY > 20 ? "0 2px 18px rgba(44,26,14,.1)" : "none";
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const closeMob = () => setMobileOpen(false);

  const submitOrder = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOrderSubmitting(true);
    setOrderMsg({ type: "", text: "" });

    const payload = {
      nombre: orderForm.nombre.trim(),
      telefono: orderForm.telefono.trim(),
      producto: orderForm.producto,
      cantidad: Number(orderForm.cantidad || 1),
      notas: orderForm.notas.trim(),
    };

    try {
      const res = await fetch(`${apiBase}/api/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al enviar pedido");
      }
      setOrderMsg({ type: "ok", text: "✅ ¡Pedido enviado! Te confirmamos en breve por teléfono." });
      setOrderForm(orderInitial);
    } catch (err: any) {
      setOrderMsg({ type: "err", text: `❌ ${err?.message || "Error al enviar pedido"}` });
    } finally {
      setOrderSubmitting(false);
    }
  };

  const submitReview = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setReviewSubmitting(true);
    setReviewMsg({ type: "", text: "" });

    const payload = {
      nombre: reviewForm.nombre.trim(),
      ciudad: reviewForm.ciudad.trim(),
      texto: reviewForm.texto.trim(),
    };

    try {
      const res = await fetch(`${apiBase}/api/resenas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al enviar opinión");
      }
      setReviewMsg({ type: "ok", text: `✅ ¡Gracias por tu opinión, ${payload.nombre}!` });
      setReviewForm(reviewInitial);
    } catch (err: any) {
      setReviewMsg({ type: "err", text: `❌ ${err?.message || "Error al enviar opinión"}` });
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <header id="site-header">
        <nav>
          <div className="logo">Cafetería <span>Ebenezer</span></div>
          <ul className="nav-links">
            <li><a href="#menu">Menú</a></li>
            <li><a href="#nosotros">Nosotros</a></li>
            <li><a href="#opiniones">Opiniones</a></li>
            <li><a href="#ubicacion">Ubicación</a></li>
            <li><a href="#pedidos" className="nav-cta">Pedir Ahora</a></li>
          </ul>
          <button className="ham" id="ham" aria-label="Menú" onClick={() => setMobileOpen((v) => !v)}>
            <span></span><span></span><span></span>
          </button>
        </nav>
        <div className={`mobile-nav ${mobileOpen ? "open" : ""}`} id="mobileNav">
          <a href="#menu" onClick={closeMob}>Menú</a>
          <a href="#nosotros" onClick={closeMob}>Nosotros</a>
          <a href="#opiniones" onClick={closeMob}>Opiniones</a>
          <a href="#ubicacion" onClick={closeMob}>Ubicación</a>
          <a href="#pedidos" onClick={closeMob}>Pedir Ahora</a>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-text">
          <p className="tag">Madrid · Valdepeñas · Sabor Auténtico</p>
          <h1 className="hero-title">El bocadillo<br /><span>cubano</span> más<br />delicioso</h1>
          <p className="hero-desc">En Cafetería Ebenezer cada bocado cuenta una historia de sabor auténtico. Hecho en casa, con amor y los mejores ingredientes.</p>
          <div className="btns">
            <a href="#pedidos" className="btn btn-primary">Hacer Pedido</a>
            <a href="#menu" className="btn btn-outline">Ver Menú</a>
          </div>
          <div className="stats">
            <div><div className="stat-n">10/10</div><div className="stat-l">Recomendado</div></div>
            <div><div className="stat-n">100%</div><div className="stat-l">Casero</div></div>
            <div><div className="stat-n">★★★★★</div><div className="stat-l">Clientes felices</div></div>
          </div>
        </div>
        <div className="hero-img">
          <img src="https://images.unsplash.com/photo-1592415499556-74fcb9f18667?auto=format&fit=crop&w=900&q=80" alt="Bocadillo Cubano" />
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          <span className="t-item">Bocadillo Cubano<span className="t-dot"></span></span>
          <span className="t-item">Pizzas Artesanas<span className="t-dot"></span></span>
          <span className="t-item">Postres Caseros<span className="t-dot"></span></span>
          <span className="t-item">Café de Calidad<span className="t-dot"></span></span>
          <span className="t-item">Sabor 100% Casero<span className="t-dot"></span></span>
          <span className="t-item">Bocadillo Cubano<span className="t-dot"></span></span>
          <span className="t-item">Pizzas Artesanas<span className="t-dot"></span></span>
          <span className="t-item">Postres Caseros<span className="t-dot"></span></span>
          <span className="t-item">Café de Calidad<span className="t-dot"></span></span>
          <span className="t-item">Sabor 100% Casero<span className="t-dot"></span></span>
        </div>
      </div>

      {/* MENU */}
      <section id="menu">
        <div className="wrap">
          <div className="menu-head reveal">
            <div>
              <p className="s-label">Nuestros Sabores</p>
              <h2 className="s-title">Lo mejor de <span>nuestra cocina</span></h2>
            </div>
            <a href="#pedidos" className="arrow-link">Pedir ahora →</a>
          </div>
          <div className="cards">
            <div className="card reveal">
              <div className="card-img"><img src="https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=600&q=80" alt="Bocadillo Cubano" /></div>
              <div className="card-body">
                <p className="c-tag">Estrella de la casa</p>
                <h3 className="c-name">Bocadillo Cubano</h3>
                <p className="c-desc">Un clásico irresistible con ingredientes frescos, carne jugosa y un toque crujiente inigualable.</p>
              </div>
              <div className="card-foot"><a href="#pedidos" className="arrow-link">Pedir →</a></div>
            </div>
            <div className="card reveal" style={{ transitionDelay: ".1s" }}>
              <div className="card-img"><img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80" alt="Pizzas" /></div>
              <div className="card-body">
                <p className="c-tag">Sábados especiales</p>
                <h3 className="c-name">Pizzas Artesanas</h3>
                <p className="c-desc">Menú de pizzas los sábados, con sabores para elegir y compartir con quien más quieres.</p>
              </div>
              <div className="card-foot"><a href="#pedidos" className="arrow-link">Pedir →</a></div>
            </div>
            <div className="card reveal" style={{ transitionDelay: ".2s" }}>
              <div className="card-img"><img src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80" alt="Postres" /></div>
              <div className="card-body">
                <p className="c-tag">Dulce final</p>
                <h3 className="c-name">Postres Caseros</h3>
                <p className="c-desc">Dulces y bocados perfectos para acompañar tu café o merienda. Hechos con cariño cada día.</p>
              </div>
              <div className="card-foot"><a href="#pedidos" className="arrow-link">Pedir →</a></div>
            </div>
          </div>
        </div>
      </section>

      {/* NOSOTROS */}
      <section id="nosotros">
        <div className="wrap">
          <div className="about-grid">
            <div className="about-imgs reveal">
              <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80" alt="Café" />
              <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80" alt="Cocina" />
              <img src="https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=400&q=80" alt="Comida" />
            </div>
            <div className="about-txt reveal" style={{ transitionDelay: ".15s" }}>
              <p className="s-label">Nuestra Historia</p>
              <h2 className="s-title">Pasión por la <span>calidad</span></h2>
              <p className="about-p">En Cafetería Ebenezer, cada bocado cuenta una historia de sabor auténtico y pasión genuina. Hemos integrado lo mejor de la tradición cubana y española, donde cada ingrediente se selecciona con cuidado para ofrecer una experiencia única.</p>
              <p className="about-p">Somos más que una cafetería — somos un punto de encuentro donde la comida casera se convierte en experiencia memorable.</p>
              <a href="#pedidos" className="btn btn-primary" style={{ marginTop: "2rem", display: "inline-block" }}>Contáctanos</a>
            </div>
          </div>
        </div>
      </section>

      {/* OPINIONES */}
      <section id="opiniones">
        <div className="wrap">
          <div className="reveal">
            <p className="s-label">Opiniones</p>
            <h2 className="s-title">Lo que dicen nuestros <span>clientes</span></h2>
          </div>
          <div className="rev-grid">
            <div className="rev reveal" style={{ transitionDelay: ".05s" }}>
              <div className="rev-stars">★★★★★</div>
              <p className="rev-text">"Ambiente acogedor y productos deliciosos. Siempre vuelvo por el café y la atención amable."</p>
              <div className="rev-user">
                <img src="https://images.unsplash.com/photo-1721120137923-6322c2cd83ec?auto=format&fit=crop&w=48&h=48" alt="Luis" className="rev-av" />
                <div><div className="rev-name">Luis Gómez</div><div className="rev-loc">Madrid</div></div>
              </div>
            </div>
            <div className="rev reveal" style={{ transitionDelay: ".15s" }}>
              <div className="rev-stars">★★★★★</div>
              <p className="rev-text">"Probé las pizzas y son riquísimas, muy buenos precios. Sin duda repetiré pronto."</p>
              <div className="rev-user">
                <img src="https://images.unsplash.com/photo-1514315384763-ba401779410f?auto=format&fit=crop&w=48&h=48" alt="Jorge" className="rev-av" />
                <div><div className="rev-name">Jorge M.</div><div className="rev-loc">Valdepeñas</div></div>
              </div>
            </div>
            <div className="rev reveal" style={{ transitionDelay: ".25s" }}>
              <div className="rev-stars">★★★★★</div>
              <p className="rev-text">"Una mañana muy buena, todo delicioso y la atención le doy un 10 sin pensarlo dos veces."</p>
              <div className="rev-user">
                <img src="https://images.unsplash.com/photo-1560439514-e960a3ef5019?auto=format&fit=crop&w=48&h=48" alt="Valentina" className="rev-av" />
                <div><div className="rev-name">Valentina Sanchez</div><div className="rev-loc">Madrid</div></div>
              </div>
            </div>
          </div>
          <div className="form-wrap reveal" style={{ marginTop: "2.5rem", maxWidth: "600px" }}>
            <p className="s-label">Deja tu opinión</p>
            <form onSubmit={submitReview}>
              <div className="form-row">
                <div className="fg"><label htmlFor="rev-nombre">Nombre</label><input type="text" id="rev-nombre" name="nombre" placeholder="Tu nombre" required value={reviewForm.nombre} onChange={(e) => setReviewForm((s) => ({ ...s, nombre: e.target.value }))} /></div>
                <div className="fg"><label htmlFor="rev-ciudad">Ciudad</label><input type="text" id="rev-ciudad" name="ciudad" placeholder="Madrid…" value={reviewForm.ciudad} onChange={(e) => setReviewForm((s) => ({ ...s, ciudad: e.target.value }))} /></div>
              </div>
              <div className="fg"><label htmlFor="rev-texto">Tu opinión</label><textarea id="rev-texto" name="texto" placeholder="¿Qué te pareció?" required value={reviewForm.texto} onChange={(e) => setReviewForm((s) => ({ ...s, texto: e.target.value }))} /></div>
              <button type="submit" className="form-btn" disabled={reviewSubmitting}>{reviewSubmitting ? "Enviando…" : "Enviar Opinión →"}</button>
              <div id="rev-msg" className={reviewMsg.type}>{reviewMsg.text}</div>
            </form>
          </div>
        </div>
      </section>

      {/* PEDIDOS */}
      <section id="pedidos">
        <div className="wrap">
          <div className="reveal">
            <p className="s-label">Haz tu pedido</p>
            <h2 className="s-title">¿Listo para el mejor <span>bocado</span>?</h2>
          </div>
          <div className="order-grid">
            <div className="order-info reveal">
              <h3>Contacto directo</h3>
              <p>Llámanos o escríbenos para hacer tu pedido. También puedes usar el formulario y te confirmamos en breve.</p>
              <div className="cblock">
                <div className="crow">
                  <div className="cico">
                    <svg viewBox="0 0 24 24"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.37 11.37 0 003.57.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.37 11.37 0 00.57 3.57 1 1 0 01-.24 1.02l-2.21 2.2z"/></svg>
                  </div>
                  <div><div className="crow-label">Teléfono</div><div className="crow-val"><a href="tel:+34623272728">+34 623 272 728</a></div></div>
                </div>
                <div className="crow">
                  <div className="cico">
                    <svg viewBox="0 0 24 24"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  </div>
                  <div><div className="crow-label">Email</div><div className="crow-val"><a href="mailto:info@cafeteriaebenezer.com">info@cafeteriaebenezer.com</a></div></div>
                </div>
              </div>
            </div>
            <div className="form-wrap reveal" style={{ transitionDelay: ".1s" }}>
              <form onSubmit={submitOrder}>
                <div className="form-row">
                  <div className="fg"><label htmlFor="nombre">Nombre</label><input type="text" id="nombre" name="nombre" placeholder="Tu nombre" required value={orderForm.nombre} onChange={(e) => setOrderForm((s) => ({ ...s, nombre: e.target.value }))} /></div>
                  <div className="fg"><label htmlFor="telefono">Teléfono</label><input type="tel" id="telefono" name="telefono" placeholder="+34 600 000 000" required value={orderForm.telefono} onChange={(e) => setOrderForm((s) => ({ ...s, telefono: e.target.value }))} /></div>
                </div>
                <div className="fg">
                  <label htmlFor="producto">Producto</label>
                  <select id="producto" name="producto" required value={orderForm.producto} onChange={(e) => setOrderForm((s) => ({ ...s, producto: e.target.value }))}>
                    <option value="">— Selecciona —</option>
                    <option value="bocadillo-cubano">Bocadillo Cubano</option>
                    <option value="pizza">Pizza Artesana</option>
                    <option value="postre">Postre Casero</option>
                    <option value="cafe">Café</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div className="fg"><label htmlFor="cantidad">Cantidad</label><input type="number" id="cantidad" name="cantidad" min={1} max={20} value={orderForm.cantidad} onChange={(e) => setOrderForm((s) => ({ ...s, cantidad: e.target.value }))} /></div>
                <div className="fg"><label htmlFor="notas">Notas / Personalización</label><textarea id="notas" name="notas" placeholder="Alergias, personalización, hora de recogida…" value={orderForm.notas} onChange={(e) => setOrderForm((s) => ({ ...s, notas: e.target.value }))} /></div>
                <button type="submit" className="form-btn" disabled={orderSubmitting}>{orderSubmitting ? "Enviando…" : "Enviar Pedido →"}</button>
                <div id="form-msg" className={orderMsg.type}>{orderMsg.text}</div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* UBICACIÓN */}
      <section id="ubicacion" style={{ paddingBottom: 0 }}>
        <div className="wrap reveal">
          <p className="s-label">Encuéntranos</p>
          <h2 className="s-title">Nuestra <span>Ubicación</span></h2>
        </div>
        <iframe
          className="map-frame"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193734.99498408924!2d-3.8196213!3d40.4167754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd422997800a3c81%3A0xc436dec1618c2269!2sMadrid!5e0!3m2!1ses!2ses!4v1700000000000"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación Cafetería Ebenezer"
        />
      </section>

      {/* FOOTER */}
      <footer>
        <div className="foot-inner">
          <div>
            <div className="foot-brand">Cafetería <span>Ebenezer</span></div>
            <p className="foot-desc">Sabor auténtico cubano en Madrid. Bocadillos, pizzas y postres hechos con amor y los mejores ingredientes.</p>
          </div>
          <div className="foot-col">
            <p className="foot-col-title">Navegación</p>
            <ul>
              <li><a href="#menu">Menú</a></li>
              <li><a href="#nosotros">Nosotros</a></li>
              <li><a href="#opiniones">Opiniones</a></li>
              <li><a href="#ubicacion">Ubicación</a></li>
              <li><a href="#pedidos">Pedir</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <p className="foot-col-title">Contacto</p>
            <ul>
              <li><a href="tel:+34623272728">+34 623 272 728</a></li>
              <li><a href="mailto:info@cafeteriaebenezer.com">info@cafeteriaebenezer.com</a></li>
              <li><a href="#ubicacion">Madrid, España</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <p className="foot-copy">© 2026 Cafetería Ebenezer. Todos los derechos reservados.</p>
          <p className="foot-copy">Hecho con ❤️ en Madrid</p>
        </div>
      </footer>
    </div>
  );
}
