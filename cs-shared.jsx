// Shared components, i18n, content, logo, navbar, footer, placeholders
const { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } = React;

/* ---------------- LOGO ---------------- */
function Logo({ size = 28, color = "#000" }) {
  const isWhite = color !== "#000" && color !== "currentColor";
  return (
    <img
      src="assets/centro-logo.png"
      alt="Centro Studio"
      style={{
        height: size,
        width: "auto",
        display: "block",
        filter: isWhite ? "invert(1)" : "none",
      }}
    />
  );
}

/* ---------------- ASTERISK GLYPH ---------------- */
function Asterisk({ size = 14, color = "currentColor", spin = false, className = "" }) {
  const cls = "ast" + (spin ? " ast-rotate" : "") + (className ? " " + className : "");
  return (
    <span className={cls} style={{ width: size, height: size, display: "inline-block" }}>
      <svg width={size} height={size} viewBox="-50 -50 100 100" fill={color}>
        <rect x="-7" y="-46" width="14" height="92" />
        <rect x="-7" y="-46" width="14" height="92" transform="rotate(60)" />
        <rect x="-7" y="-46" width="14" height="92" transform="rotate(120)" />
      </svg>
    </span>
  );
}

/* ---------------- I18N ---------------- */
const I18N = {
  es: {
    tagline: "Un espacio donde convive la escena",
    location: "Buenos Aires — AR",
    nav: {
      tattoo: "Tatuaje",
      quote: "Cotizá tu tatuaje",
      guest: "Quiero tatuar en Centro",
      aftercare: "Cuidados del tatuaje",
      blog: "Blog",
      store: "Centro Store",
      workshops: "Talleres",
      gallery: "Galería",
      events: "Eventos",
      giftcard: "Gift Card",
      info: "Más info",
    },
    tattoo: {
      kicker: "Tatuaje",
      ctaQuote: "Cotizá tu tatuaje",
      ctaQuoteSub: "Completá el formulario y te respondemos en 48h hábiles",
      ctaGuest: "Quiero tatuar en Centro",
      ctaGuestSub: "Residencia para tatuadores — convocatoria abierta",
      ctaAftercare: "Cuidados del tatuaje",
      ctaAftercareSub: "Guía de cuidados antes, durante y después del turno",
      artistsTitle: "Artistas residentes",
      artistsIntro: "Un colectivo de tatuadores con estilos, técnicas y perspectivas diferentes. Cada uno con agenda propia.",
      googleTitle: "¿Te tatuaste en Centro?",
      googleBody: "Si conociste el estudio o te tatuaste con nosotros, agradeceríamos mucho una valoración en Google Maps.",
      googleCta: "Dejar valoración",
      aftercareTitle: "Cuidados del tatuaje",
      slide1: "Arte en piel",
      slide1sub: "Estudio · Residentes · Buenos Aires",
      slide2: "Residentes",
      slide2sub: "Fine line · Blackwork · Tradicional · Ornamental",
      slide3: "Con agenda",
      slide3sub: "Presupuesto sin cargo · Respuesta en 48h",
    },
    home: {
      eyebrow: "Estudio · Galería · Showroom · Espacio cultural",
      heroLine1: "Centro",
      heroLine2: "Studio",
      heroSub: "Un espacio donde convive la escena.",
      heroBody: "Tatuaje, arte, marcas y comunidad bajo un mismo techo, en el corazón de Buenos Aires.",
      scroll: "Scroll",
      areaIntro: "Cuatro disciplinas, un mismo espacio curado",
      areaIntroBody: "Centro Studio no se define por una sola práctica. Es la convergencia de tatuaje, arte contemporáneo, marcas independientes y formación.",
      cta: "Conocé el espacio",
      visit: "Vení a visitarnos",
      visitBody: "Av. Córdoba 857 — Retiro, Buenos Aires. Miércoles a sábados, 14 a 19h.",
      newsletter: "Sumate a la lista",
      newsletterBody: "Una vez al mes: nuevas muestras, artistas guest, talleres y aperturas.",
      areas: [
        { num: "01", k: "Tatuaje", d: "Estudio residente y artistas guest rotativos. Citas con cita previa." },
        { num: "02", k: "Galería", d: "Volumen 48 en curso. Exhibiciones con texto curatorial y publicación." },
        { num: "03", k: "Centro Store", d: "Marcas seleccionadas en showroom físico. Tienda online vía Tiendanube." },
        { num: "04", k: "Talleres", d: "Programa abierto al público y residencia para artistas." },
      ],
      manifesto: [
        "No somos un estudio.",
        "Somos un espacio cultural",
        "donde convive la escena.",
      ],
      featured: "Próximo evento",
      featuredEvent: "Apertura — Galería Vol. 48",
      featuredDate: "Vie 09 Mayo · 20h",
      featuredBody: "Cuatro artistas exploran el cuerpo como soporte expandido. Apertura con DJ y publicación impresa.",
    },
    footer: {
      address: "Av. Córdoba 857\nRetiro, CABA",
      addressShort: "Av. Córdoba 857, Retiro",
      mapUrl: "https://maps.google.com/?q=Av.+Cordoba+857,+Retiro,+CABA,+Argentina",
      ig: "@centro__studio",
      igUrl: "https://www.instagram.com/centro__studio/",
      email: "centrostudio.ar@gmail.com",
      hours: "Mié — Sáb · 14 — 19h",
      contact: "Contacto",
      follow: "Seguinos",
      maps: "Ver en Google Maps",
      legal: "© 2026 Centro Studio. Todos los derechos reservados.",
      colofon: "Sitio diseñado en Buenos Aires.",
    },
  },
  en: {
    tagline: "A space where the scene lives together",
    location: "Buenos Aires — AR",
    nav: {
      tattoo: "Tattoo",
      quote: "Get a tattoo quote",
      guest: "Tattoo at Centro",
      aftercare: "Aftercare guide",
      blog: "Journal",
      store: "Centro Store",
      workshops: "Workshops",
      gallery: "Gallery",
      events: "Events",
      giftcard: "Gift Card",
      info: "More",
    },
    tattoo: {
      kicker: "Tattoo",
      ctaQuote: "Get a tattoo quote",
      ctaQuoteSub: "Fill the form and we'll reply within 48 business hours",
      ctaGuest: "Tattoo at Centro",
      ctaGuestSub: "Artist residency — open applications",
      ctaAftercare: "Aftercare guide",
      ctaAftercareSub: "Before, during and after your session",
      artistsTitle: "Resident artists",
      artistsIntro: "A collective of tattoo artists with different styles, techniques and perspectives. Each with their own schedule.",
      googleTitle: "Got tattooed at Centro?",
      googleBody: "If you visited the studio or got tattooed with us, we'd really appreciate a rating on Google Maps.",
      googleCta: "Leave a review",
      aftercareTitle: "Aftercare",
      slide1: "Art on skin",
      slide1sub: "Studio · Residents · Buenos Aires",
      slide2: "Residents",
      slide2sub: "Fine line · Blackwork · Traditional · Ornamental",
      slide3: "By appointment",
      slide3sub: "Free quote · Reply within 48h",
    },
    home: {
      eyebrow: "Studio · Gallery · Showroom · Cultural Space",
      heroLine1: "Centro",
      heroLine2: "Studio",
      heroSub: "A space where the scene lives together.",
      heroBody: "Tattoo, art, brands and community under one roof, in the heart of Buenos Aires.",
      scroll: "Scroll",
      areaIntro: "Four disciplines, one curated space",
      areaIntroBody: "Centro Studio is not defined by a single practice. It is the convergence of tattoo, contemporary art, independent brands and education.",
      cta: "Discover the space",
      visit: "Come visit us",
      visitBody: "Av. Córdoba 857 — Retiro, Buenos Aires. Wed to Sat, 2 — 7pm.",
      newsletter: "Join the list",
      newsletterBody: "Once a month: new shows, guest artists, workshops and openings.",
      areas: [
        { num: "01", k: "Tattoo", d: "Resident studio and rotating guest artists. By appointment only." },
        { num: "02", k: "Gallery", d: "Volume 48 in progress. Curated exhibitions with text and printed edition." },
        { num: "03", k: "Centro Store", d: "Curated brands in a physical showroom. Online store via Tiendanube." },
        { num: "04", k: "Workshops", d: "Public program and artist residency." },
      ],
      manifesto: [
        "We are not a studio.",
        "We are a cultural space",
        "where the scene lives.",
      ],
      featured: "Upcoming event",
      featuredEvent: "Opening — Gallery Vol. 48",
      featuredDate: "Fri May 09 · 8pm",
      featuredBody: "Four artists explore the body as an expanded surface. Opening with DJ and printed publication.",
    },
    footer: {
      address: "Av. Córdoba 857\nRetiro, CABA",
      addressShort: "Av. Córdoba 857, Retiro",
      mapUrl: "https://maps.google.com/?q=Av.+Cordoba+857,+Retiro,+CABA,+Argentina",
      ig: "@centro__studio",
      igUrl: "https://www.instagram.com/centro__studio/",
      email: "centrostudio.ar@gmail.com",
      hours: "Wed — Sat · 2 — 7pm",
      contact: "Contact",
      follow: "Follow",
      maps: "View on Google Maps",
      legal: "© 2026 Centro Studio. All rights reserved.",
      colofon: "Designed in Buenos Aires.",
    },
  },
};

const I18nContext = createContext({ lang: "es", t: I18N.es, setLang: () => {} });
function useI18n() { return useContext(I18nContext); }

/* ---------------- NAV STRUCTURE ---------------- */
// top-level keys (tattoo is a dropdown, rest are direct links)
const NAV_KEYS = ["tattoo", "blog", "store", "workshops", "gallery", "events", "giftcard", "info"];
const NAV_ROUTES = {
  tattoo: "tattoo",
  blog: "blog",
  store: "store",
  workshops: "workshops",
  gallery: "gallery",
  events: "events",
  giftcard: "giftcard",
  info: "info",
  quote: "quote",
  guest: "guest",
};

/* ---------------- TATTOO DROPDOWN ---------------- */
function TattooDropdown({ route, setRoute, t }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const active = ["tattoo", "quote", "guest"].includes(route);

  const items = [
    { k: "quote",    label: t.nav.quote },
    { k: "guest",    label: t.nav.guest },
    { k: "aftercare",label: t.nav.aftercare },
  ];

  const navBtnStyle = (isActive) => ({
    fontFamily: "var(--sans)",
    fontSize: 13,
    fontWeight: isActive ? 900 : 700,
    letterSpacing: "-0.005em",
    textTransform: "uppercase",
    padding: "8px 12px",
    background: isActive ? "#000" : "transparent",
    color: isActive ? "#fff" : "#000",
    transition: "all .15s",
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    gap: 5,
  });

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={navBtnStyle(active)}
        onMouseEnter={e => { if (!active && !open) e.currentTarget.style.background = "#F4F2EE"; }}
        onMouseLeave={e => { if (!active && !open) e.currentTarget.style.background = active ? "#000" : "transparent"; }}
      >
        {t.nav.tattoo}
        <span style={{
          display: "inline-block",
          fontSize: 9,
          transition: "transform .22s ease",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transformOrigin: "center",
        }}>▾</span>
      </button>

      {/* Dropdown panel */}
      <div style={{
        position: "absolute",
        top: "calc(100% + 6px)",
        left: 0,
        background: "#fff",
        border: "1.5px solid #000",
        minWidth: 230,
        opacity: open ? 1 : 0,
        transform: open ? "translateY(0)" : "translateY(-8px)",
        pointerEvents: open ? "auto" : "none",
        transition: "opacity .18s ease, transform .18s ease",
        zIndex: 200,
        boxShadow: "0 8px 28px rgba(0,0,0,0.14)",
      }}>
        {items.map((item, i) => (
          <button
            key={item.k}
            onClick={() => {
              setRoute(item.k === "aftercare" ? "tattoo" : item.k);
              setOpen(false);
            }}
            style={{
              display: "block",
              width: "100%",
              padding: "13px 18px",
              textAlign: "left",
              fontFamily: "var(--sans)",
              fontSize: 12.5,
              fontWeight: route === item.k ? 700 : 500,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              borderTop: i > 0 ? "1px solid var(--hair)" : "none",
              background: route === item.k ? "#F4F2EE" : "#fff",
              transition: "background .1s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#F4F2EE"}
            onMouseLeave={e => e.currentTarget.style.background = route === item.k ? "#F4F2EE" : "#fff"}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- NAVBAR ---------------- */
function Navbar({ route, setRoute, time, intensity }) {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  return (
    <>
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 80,
        background: "#fff",
        borderBottom: "2px solid #000",
        height: 64,
      }}>
        {/* Always: [MENU] [LOGO centered] [ES/EN] */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          height: "100%",
          padding: "0 20px",
        }}>
          {/* LEFT: Hamburger */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              onClick={() => setOpen(true)}
              style={{
                fontFamily: "var(--sans)", fontWeight: 900, fontSize: 13,
                letterSpacing: "0.02em", textTransform: "uppercase",
                padding: "9px 16px", background: "#000", color: "#fff",
                display: "flex", alignItems: "center", gap: 8,
              }}
              aria-label="Open menu"
            >
              <span style={{ display: "inline-flex", flexDirection: "column", gap: 3 }}>
                <span style={{ width: 15, height: 2, background: "#fff" }} />
                <span style={{ width: 15, height: 2, background: "#fff" }} />
                <span style={{ width: 15, height: 2, background: "#fff" }} />
              </span>
              <span className="nav-menu-label">MENU</span>
            </button>
          </div>

          {/* CENTER: Logo */}
          <button
            onClick={() => setRoute("home")}
            aria-label="Home"
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <img src="assets/centro-logo.png" alt="" style={{ width: 32, height: 32, objectFit: "contain", display: "block" }} />
            <span className="nav-wordmark" style={{
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontWeight: 900, fontSize: 17,
              letterSpacing: "-0.02em", textTransform: "uppercase",
              lineHeight: 1, whiteSpace: "nowrap",
            }}>
              CENTRO<span style={{ display: "inline-block", margin: "0 0.18em" }}>·</span>STUDIO
            </span>
          </button>

          {/* RIGHT: Language toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            <button
              onClick={() => setLang(lang === "es" ? "en" : "es")}
              style={{
                fontFamily: "var(--sans)", fontWeight: 900, fontSize: 11,
                letterSpacing: "0.06em", textTransform: "uppercase",
                padding: "7px 9px", border: "1.5px solid #000",
              }}
              aria-label="Toggle language"
            >
              {lang === "es" ? "ES/en" : "es/EN"}
            </button>
          </div>
        </div>
      </header>

      <NavOverlay open={open} setOpen={setOpen} route={route} setRoute={setRoute} />

      <style>{`
        @media (max-width: 600px) {
          .nav-menu-label { display: none; }
          .nav-wordmark { display: none !important; }
        }
      `}</style>
    </>
  );
}

function NavOverlay({ open, setOpen, route, setRoute }) {
  const { t, lang, setLang } = useI18n();
  const [tattooOpen, setTattooOpen] = useState(false);

  const go = (r) => { setRoute(r); setOpen(false); setTattooOpen(false); };

  const visibleKeys = NAV_KEYS; // same order as desktop

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 90,
      background: "#000", color: "#fff",
      pointerEvents: open ? "auto" : "none",
      opacity: open ? 1 : 0,
      transition: "opacity .35s ease",
      overflow: "auto",
    }}>
      <div style={{
        position: "sticky", top: 0,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "18px 28px",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
        background: "#000",
      }}>
        <button onClick={() => { go("home"); }} aria-label="Home">
          <Logo size={24} color="#fff" />
        </button>
        <button onClick={() => setOpen(false)} className="mono" style={{ fontWeight: 500, color: "#fff" }}>
          {lang === "es" ? "Cerrar" : "Close"}
        </button>
      </div>

      <div style={{ padding: "48px 28px 80px", maxWidth: 1400, margin: "0 auto" }}>
        <div className="meta" style={{ color: "rgba(255,255,255,0.4)", marginBottom: 32 }}>[ Index ]</div>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {visibleKeys.map((k, i) => {
            if (k === "tattoo") {
              return (
                <li key="tattoo" style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
                  {/* Main tattoo row */}
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                    <button
                      onClick={() => go("tattoo")}
                      style={{
                        flex: 1, padding: "18px 0", color: "#fff", textAlign: "left",
                        transition: "padding .3s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.paddingLeft = "16px"}
                      onMouseLeave={e => e.currentTarget.style.paddingLeft = "0"}
                    >
                      <span className="display" style={{ fontSize: "clamp(32px, 6vw, 80px)" }}>
                        {t.nav.tattoo}
                      </span>
                    </button>
                    <button
                      onClick={() => setTattooOpen(o => !o)}
                      style={{
                        color: "#fff", padding: "8px 12px",
                        fontSize: 18, transition: "transform .22s",
                        transform: tattooOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >▾</button>
                    <span className="mono" style={{ color: "rgba(255,255,255,0.35)", marginLeft: 12 }}>
                      {String(i + 1).padStart(2, "0")} / {String(NAV_KEYS.length).padStart(2, "0")}
                    </span>
                  </div>
                  {/* Sub-items */}
                  <div style={{
                    overflow: "hidden",
                    maxHeight: tattooOpen ? "240px" : "0",
                    transition: "max-height .3s ease",
                  }}>
                    <div style={{ paddingLeft: 24, paddingBottom: 16, display: "grid", gap: 4 }}>
                      {[
                        { k: "quote",     label: t.nav.quote },
                        { k: "guest",     label: t.nav.guest },
                        { k: "aftercare", label: t.nav.aftercare, r: "tattoo" },
                      ].map(item => (
                        <button
                          key={item.k}
                          onClick={() => go(item.r || item.k)}
                          style={{
                            color: "rgba(255,255,255,0.7)",
                            fontFamily: "var(--sans)", fontSize: "clamp(16px, 2.5vw, 22px)",
                            fontWeight: 500, letterSpacing: "-0.01em",
                            textAlign: "left", padding: "8px 0",
                            textTransform: "uppercase",
                            transition: "color .15s",
                          }}
                          onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
                        >
                          — {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </li>
              );
            }

            return (
              <li key={k} style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
                <button
                  onClick={() => go(NAV_ROUTES[k])}
                  style={{
                    width: "100%", padding: "18px 0",
                    display: "flex", alignItems: "baseline", justifyContent: "space-between",
                    color: "#fff", textAlign: "left",
                    transition: "padding .3s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.paddingLeft = "16px"}
                  onMouseLeave={e => e.currentTarget.style.paddingLeft = "0"}
                >
                  <span className="display" style={{ fontSize: "clamp(32px, 6vw, 80px)" }}>
                    {t.nav[k]}
                  </span>
                  <span className="mono" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {String(i + 1).padStart(2, "0")} / {String(NAV_KEYS.length).padStart(2, "0")}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 28, marginTop: 64, color: "rgba(255,255,255,0.65)" }}>
          <div>
            <div className="meta" style={{ color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
              {lang === "es" ? "Dirección" : "Address"}
            </div>
            <div style={{ whiteSpace: "pre-line", lineHeight: 1.6 }}>{t.footer.address}</div>
          </div>
          <div>
            <div className="meta" style={{ color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>{t.footer.contact}</div>
            <div><a href={`mailto:${t.footer.email}`} style={{ color: "#fff" }}>{t.footer.email}</a></div>
            <div style={{ marginTop: 4 }}>
              <a href={t.footer.mapUrl} target="_blank" rel="noopener" style={{ color: "rgba(255,255,255,0.6)" }}>
                {t.footer.maps} ↗
              </a>
            </div>
          </div>
          <div>
            <div className="meta" style={{ color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>{t.footer.follow}</div>
            <div><a href={t.footer.igUrl} target="_blank" rel="noopener" style={{ color: "#fff" }}>{t.footer.ig} ↗</a></div>
          </div>
          <div>
            <div className="meta" style={{ color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Lang</div>
            <button
              onClick={() => setLang(lang === "es" ? "en" : "es")}
              style={{ color: "#fff", fontFamily: "var(--mono)", fontSize: 11 }}
            >
              {lang === "es" ? "→ Switch to English" : "→ Cambiar a Español"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer({ setRoute }) {
  const { t, lang } = useI18n();
  return (
    <footer style={{ background: "#000", color: "#fff", marginTop: 0 }}>
      <div className="container" style={{ padding: "72px 32px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 56, flexWrap: "wrap" }}>
          <Logo size={44} color="#fff" />
          <h2 className="display" style={{
            fontSize: "clamp(24px, 3.5vw, 48px)", margin: 0, color: "#fff",
            fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1,
            display: "inline-flex", alignItems: "baseline", gap: "0.18em",
          }}>
            <span>CENTRO</span>
            <span style={{ fontStyle: "italic", fontWeight: 300 }}>studio</span>
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 36,
          paddingTop: 36,
          borderTop: "1px solid rgba(255,255,255,0.15)",
        }}>
          <div>
            <div className="meta" style={{ color: "rgba(255,255,255,0.45)", marginBottom: 12 }}>
              {lang === "es" ? "[ Visita ]" : "[ Visit ]"}
            </div>
            <div style={{ whiteSpace: "pre-line", lineHeight: 1.65 }}>{t.footer.address}</div>
            <div style={{ marginTop: 10 }}>
              <a href={t.footer.mapUrl} target="_blank" rel="noopener" style={{ color: "#fff", borderBottom: "1px solid rgba(255,255,255,0.35)", paddingBottom: 2 }}>
                {t.footer.maps} ↗
              </a>
            </div>
            <div style={{ marginTop: 8, color: "rgba(255,255,255,0.55)", fontSize: 13 }}>{t.footer.hours}</div>
          </div>
          <div>
            <div className="meta" style={{ color: "rgba(255,255,255,0.45)", marginBottom: 12 }}>[ {t.footer.contact} ]</div>
            <div><a href={`mailto:${t.footer.email}`} style={{ color: "#fff" }}>{t.footer.email}</a></div>
            <div style={{ marginTop: 6 }}>
              <a href={t.footer.igUrl} target="_blank" rel="noopener" style={{ color: "#fff" }}>{t.footer.ig}</a>
            </div>
          </div>
          <div>
            <div className="meta" style={{ color: "rgba(255,255,255,0.45)", marginBottom: 12 }}>[ Index ]</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 5 }}>
              {["tattoo", "blog", "store", "workshops"].map(k => (
                <li key={k}>
                  <button onClick={() => setRoute(NAV_ROUTES[k])} style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>
                    {t.nav[k]}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="meta" style={{ color: "rgba(255,255,255,0.45)", marginBottom: 12 }}>[ {lang === "es" ? "Más" : "More"} ]</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 5 }}>
              {["gallery", "events", "giftcard", "info"].map(k => (
                <li key={k}>
                  <button onClick={() => setRoute(NAV_ROUTES[k])} style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>
                    {t.nav[k]}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="meta" style={{ color: "rgba(255,255,255,0.45)", marginBottom: 12 }}>[ {t.footer.follow} ]</div>
            <a href={t.footer.igUrl} target="_blank" rel="noopener" style={{ color: "#fff", fontSize: 13 }}>
              Instagram — {t.footer.ig} ↗
            </a>
            <div style={{ marginTop: 8, color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
              {lang === "es" ? "Newsletter mensual" : "Monthly newsletter"}
            </div>
          </div>
        </div>

        <div style={{
          display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10,
          paddingTop: 28, marginTop: 52,
          borderTop: "1px solid rgba(255,255,255,0.15)",
          color: "rgba(255,255,255,0.4)",
          fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.05em",
        }}>
          <span>{t.footer.legal}</span>
          <span>{t.footer.colofon}</span>
          <span>—34.5990°S / 58.4380°W</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- PLACEHOLDER ---------------- */
function Placeholder({ label, tag, ratio = "4/5", dark = false, style = {} }) {
  return (
    <div className={"ph" + (dark ? " ph-dark" : "")} style={{ aspectRatio: ratio, width: "100%", ...style }}>
      {tag && <div className="ph-tag">{tag}</div>}
      {label && <div className="ph-label">— {label}</div>}
    </div>
  );
}

/* ---------------- SECTION HEADER ---------------- */
function SectionHeader({ index, kicker, title, intro }) {
  return (
    <div style={{ paddingTop: "clamp(48px, 7vw, 100px)", paddingBottom: 40 }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
          <span className="meta">[ {index} / {kicker} ]</span>
          <span className="meta">— Centro Studio · BA</span>
        </div>
        <h1 className="display" style={{
          fontSize: "clamp(52px, 10vw, 152px)",
          margin: 0,
          display: "flex", alignItems: "flex-start", gap: "0.1em",
          lineHeight: 0.9,
        }}>
          {title}
        </h1>
        {intro && (
          <p style={{
            fontFamily: "var(--sans)", fontSize: 15, lineHeight: 1.6,
            maxWidth: 480, margin: "28px 0 0",
            color: "rgba(0,0,0,0.65)",
          }}>
            {intro}
          </p>
        )}
      </div>
    </div>
  );
}

// expose
Object.assign(window, {
  Logo, Asterisk, I18N, I18nContext, useI18n,
  Navbar, Footer, Placeholder, SectionHeader,
  NAV_KEYS, NAV_ROUTES,
});
