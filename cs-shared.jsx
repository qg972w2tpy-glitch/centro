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
      blog: "Blog",
      quote: "Cotizá un tatuaje",
      guest: "Quiero tatuar en Centro",
      store: "Centro Store",
      workshops: "Talleres",
      gallery: "Galería",
      events: "Eventos",
      giftcard: "Gift Card",
      info: "Más info",
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
      visitBody: "Pasaje sin nombre 482 — Villa Crespo, Buenos Aires. Lunes a sábados, 12 a 20h.",
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
      legal: "© 2026 Centro Studio. Todos los derechos reservados.",
      colofon: "Sitio diseñado en Buenos Aires.",
    },
  },
  en: {
    tagline: "A space where the scene lives together",
    location: "Buenos Aires — AR",
    nav: {
      blog: "Journal",
      quote: "Tattoo Quote",
      guest: "Guest at Centro",
      store: "Centro Store",
      workshops: "Workshops",
      gallery: "Gallery",
      events: "Events",
      giftcard: "Gift Card",
      info: "More",
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
      visitBody: "Pasaje sin nombre 482 — Villa Crespo, Buenos Aires. Mon to Sat, 12 — 8pm.",
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
      legal: "© 2026 Centro Studio. All rights reserved.",
      colofon: "Designed in Buenos Aires.",
    },
  },
};

const I18nContext = createContext({ lang: "es", t: I18N.es, setLang: () => {} });
function useI18n() { return useContext(I18nContext); }

/* ---------------- NAVBAR ---------------- */
const NAV_KEYS = ["blog", "quote", "guest", "store", "workshops", "gallery", "events", "giftcard", "info"];
const NAV_ROUTES = {
  blog: "blog",
  quote: "quote",
  guest: "guest",
  store: "store",
  workshops: "workshops",
  gallery: "gallery",
  events: "events",
  giftcard: "giftcard",
  info: "info",
};

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
        height: 84,
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center",
          height: "100%",
          padding: "0 24px",
          gap: 28,
        }}>
          {/* LEFT: Logo + wordmark */}
          <button
            onClick={() => setRoute("home")}
            aria-label="Home"
            style={{
              display: "flex", alignItems: "center", gap: 14,
              flexShrink: 0,
            }}
          >
            <img src="assets/centro-logo.png" alt="" style={{ width: 38, height: 38, objectFit: "contain", display: "block" }} />
            <span className="nav-wordmark" style={{
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontWeight: 900,
              fontSize: 20,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}>
              CENTRO<span style={{ display: "inline-block", margin: "0 0.2em" }}>·</span>STUDIO
            </span>
          </button>

          {/* CENTER: Desktop nav */}
          <nav className="nav-desktop" style={{ display: "none", justifyContent: "center", alignItems: "center", gap: 4 }}>
            {NAV_KEYS.map(k => {
              const active = route === NAV_ROUTES[k];
              return (
                <button
                  key={k}
                  onClick={() => setRoute(NAV_ROUTES[k])}
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: 13,
                    fontWeight: active ? 900 : 700,
                    letterSpacing: "-0.005em",
                    textTransform: "uppercase",
                    padding: "8px 12px",
                    background: active ? "#000" : "transparent",
                    color: active ? "#fff" : "#000",
                    transition: "all .15s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#F4F2EE"; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
                >
                  {t.nav[k]}
                </button>
              );
            })}
          </nav>

          {/* RIGHT */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <button
              onClick={() => setLang(lang === "es" ? "en" : "es")}
              style={{
                fontFamily: "var(--sans)",
                fontWeight: 900,
                fontSize: 12,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "8px 10px",
                border: "1.5px solid #000",
              }}
              aria-label="Toggle language"
            >
              {lang === "es" ? "ES/en" : "es/EN"}
            </button>
            <button
              onClick={() => setOpen(true)}
              className="menu-btn"
              style={{
                fontFamily: "var(--sans)",
                fontWeight: 900,
                fontSize: 14,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                padding: "10px 18px",
                background: "#000",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
              aria-label="Open menu"
            >
              <span style={{ display: "inline-flex", flexDirection: "column", gap: 3 }}>
                <span style={{ width: 16, height: 2, background: "#fff" }} />
                <span style={{ width: 16, height: 2, background: "#fff" }} />
                <span style={{ width: 16, height: 2, background: "#fff" }} />
              </span>
              MENU
            </button>
          </div>
        </div>
      </header>

      <NavOverlay open={open} setOpen={setOpen} route={route} setRoute={setRoute} />

      <style>{`
        @media (min-width: 1180px) { .nav-desktop { display: flex !important; } }
        @media (max-width: 520px) { .nav-wordmark { display: none !important; } }
      `}</style>
    </>
  );
}

function NavOverlay({ open, setOpen, route, setRoute }) {
  const { t, lang, setLang } = useI18n();
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
        padding: "20px 32px",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
        background: "#000",
      }}>
        <button onClick={() => { setRoute("home"); setOpen(false); }} aria-label="Home">
          <Logo size={26} color="#fff" />
        </button>
        <button onClick={() => setOpen(false)} className="mono" style={{ fontWeight: 500 }}>Cerrar / Close</button>
      </div>

      <div style={{ padding: "60px 32px 80px", maxWidth: 1400, margin: "0 auto" }}>
        <div className="meta" style={{ color: "rgba(255,255,255,0.5)", marginBottom: 40 }}>
          [ Index ]
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {NAV_KEYS.map((k, i) => (
            <li key={k} style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
              <button
                onClick={() => { setRoute(NAV_ROUTES[k]); setOpen(false); }}
                style={{
                  width: "100%", padding: "22px 0",
                  display: "flex", alignItems: "baseline", justifyContent: "space-between",
                  color: "#fff", textAlign: "left",
                  transition: "padding .3s",
                }}
                onMouseEnter={e => e.currentTarget.style.paddingLeft = "20px"}
                onMouseLeave={e => e.currentTarget.style.paddingLeft = "0"}
              >
                <span className="display" style={{ fontSize: "clamp(40px, 7vw, 92px)" }}>
                  {t.nav[k]}
                </span>
                <span className="mono" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {String(i + 1).padStart(2, "0")} / 08
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 32, marginTop: 80, color: "rgba(255,255,255,0.7)" }}>
          <div>
            <div className="meta" style={{ color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>Dirección</div>
            <div style={{ whiteSpace: "pre-line" }}>{t.footer.address}</div>
          </div>
          <div>
            <div className="meta" style={{ color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>{t.footer.contact}</div>
            <div><a href={`mailto:${t.footer.email}`} style={{ color: "#fff" }}>{t.footer.email}</a></div>
            <div style={{ marginTop: 4 }}><a href={t.footer.mapUrl} target="_blank" rel="noopener" style={{ color: "rgba(255,255,255,0.7)" }}>Ver en Google Maps ↗</a></div>
          </div>
          <div>
            <div className="meta" style={{ color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>{t.footer.follow}</div>
            <div><a href={t.footer.igUrl} target="_blank" rel="noopener" style={{ color: "#fff" }}>{t.footer.ig} ↗</a></div>
          </div>
          <div>
            <div className="meta" style={{ color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>Lang</div>
            <button
              onClick={() => setLang(lang === "es" ? "en" : "es")}
              style={{ color: "#fff", fontFamily: "var(--mono)", fontSize: 12 }}
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
  const { t } = useI18n();
  return (
    <footer style={{ background: "#000", color: "#fff", marginTop: 0 }}>
      <div className="container" style={{ padding: "80px 32px 36px" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          marginBottom: 64,
          flexWrap: "wrap",
        }}>
          <Logo size={48} color="#fff" />
          <h2 className="display" style={{
            fontSize: "clamp(28px, 4vw, 56px)",
            margin: 0,
            color: "#fff",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            lineHeight: 1,
            display: "inline-flex",
            alignItems: "baseline",
            gap: "0.18em",
          }}>
            <span>CENTRO</span>
            <span style={{ fontStyle: "italic", fontWeight: 300 }}>studio</span>
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 40,
          paddingTop: 40,
          borderTop: "1px solid rgba(255,255,255,0.18)",
        }}>
          <div>
            <div className="meta" style={{ color: "rgba(255,255,255,0.5)", marginBottom: 14 }}>[ Visit ]</div>
            <div style={{ whiteSpace: "pre-line", lineHeight: 1.6 }}>{t.footer.address}</div>
            <div style={{ marginTop: 10 }}>
              <a href={t.footer.mapUrl} target="_blank" rel="noopener" style={{ color: "#fff", borderBottom: "1px solid rgba(255,255,255,0.4)", paddingBottom: 2 }}>
                Google Maps ↗
              </a>
            </div>
            <div style={{ marginTop: 8, color: "rgba(255,255,255,0.6)" }}>{t.footer.hours}</div>
          </div>
          <div>
            <div className="meta" style={{ color: "rgba(255,255,255,0.5)", marginBottom: 14 }}>[ Contact ]</div>
            <div><a href={`mailto:${t.footer.email}`} style={{ color: "#fff" }}>{t.footer.email}</a></div>
            <div style={{ marginTop: 6 }}>
              <a href={t.footer.igUrl} target="_blank" rel="noopener" style={{ color: "#fff" }}>{t.footer.ig}</a>
            </div>
          </div>
          <div>
            <div className="meta" style={{ color: "rgba(255,255,255,0.5)", marginBottom: 14 }}>[ Index ]</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 4 }}>
              {NAV_KEYS.slice(0,4).map(k => (
                <li key={k}>
                  <button onClick={() => setRoute(NAV_ROUTES[k])} style={{ color: "rgba(255,255,255,0.85)" }}>
                    {t.nav[k]}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="meta" style={{ color: "rgba(255,255,255,0.5)", marginBottom: 14 }}>[ More ]</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 4 }}>
              {NAV_KEYS.slice(4).map(k => (
                <li key={k}>
                  <button onClick={() => setRoute(NAV_ROUTES[k])} style={{ color: "rgba(255,255,255,0.85)" }}>
                    {t.nav[k]}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="meta" style={{ color: "rgba(255,255,255,0.5)", marginBottom: 14 }}>[ Follow ]</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 }}>
              <li>
                <a href={t.footer.igUrl} target="_blank" rel="noopener" style={{ color: "#fff" }}>
                  Instagram — {t.footer.ig} ↗
                </a>
              </li>
              <li style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>Newsletter mensual</li>
            </ul>
          </div>
        </div>

        <div style={{
          display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
          paddingTop: 32, marginTop: 60,
          borderTop: "1px solid rgba(255,255,255,0.18)",
          color: "rgba(255,255,255,0.5)",
          fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.05em",
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
function SectionHeader({ index, kicker, title, intro, route }) {
  return (
    <div style={{ paddingTop: "clamp(56px, 8vw, 120px)", paddingBottom: 48 }}>
      <div className="container">
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 32,
          alignItems: "end",
        }}>
          <div style={{ gridColumn: "span 12" }} className="sh-meta-row">
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 32 }}>
              <span className="meta">[ {index} / {kicker} ]</span>
              <span className="meta">— Centro Studio · BA</span>
            </div>
          </div>
          <h1 className="display sh-title" style={{
            gridColumn: "span 12",
            fontSize: "clamp(56px, 11vw, 168px)",
            margin: 0,
            display: "flex", alignItems: "flex-start", gap: "0.1em",
          }}>
            {title}
          </h1>
          {intro && (
            <p style={{
              gridColumn: "12 / span 12",
              fontFamily: "var(--sans)", fontSize: 16, lineHeight: 1.55,
              maxWidth: 560, margin: "32px 0 0",
            }} className="sh-intro">
              {intro}
            </p>
          )}
        </div>
      </div>
      <style>{`
        @media (min-width: 900px) {
          .sh-intro { grid-column: 8 / span 5 !important; margin-top: -120px !important; }
        }
      `}</style>
    </div>
  );
}

// expose
Object.assign(window, {
  Logo, Asterisk, I18N, I18nContext, useI18n,
  Navbar, Footer, Placeholder, SectionHeader,
  NAV_KEYS, NAV_ROUTES,
});
