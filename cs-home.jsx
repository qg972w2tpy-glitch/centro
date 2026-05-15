// Home — minimal editorial + loading screen with 3D rotating logo (early web aesthetic)
const { useState: useStateH, useEffect: useEffectH, useRef: useRefH } = React;

function useReveal() {
  useEffectH(() => {
    const els = document.querySelectorAll(".reveal:not(.in)");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

/* ---------------- LOADING SCREEN ----------------
   Early-web / analog vibe: monospace system text, grainy CRT scanlines,
   the [ * ] logo rotating in 3D space. */
const LS_VISITED_KEY = "centro_studio_v1";
function LoadingScreen({ onDone }) {
  const isFirstVisit = !localStorage.getItem(LS_VISITED_KEY);
  const [pct, setPct] = useStateH(0);
  const [ready, setReady] = useStateH(false);

  useEffectH(() => {
    document.body.classList.add('loading-active');
    return () => document.body.classList.remove('loading-active');
  }, []);

  useEffectH(() => {
    const dur = isFirstVisit ? 2600 : 1400;
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      setPct(Math.floor(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setReady(true);
        if (!isFirstVisit) {
          setTimeout(() => {
            const el = document.querySelector('.loading-root');
            if (el) { el.classList.add('done'); setTimeout(onDone, 550); }
            else onDone();
          }, 320);
        }
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleEnter = () => {
    localStorage.setItem(LS_VISITED_KEY, "1");
    const el = document.querySelector('.loading-root');
    if (el) { el.classList.add('done'); setTimeout(onDone, 550); }
    else onDone();
  };

  return (
    <div className="loading-root">
      {/* Film photo background */}
      <div className="ls-photo-bg" />
      {/* CRT scanlines + vignette + grain */}
      <div className="crt-scanlines" />
      <div className="crt-vignette" />
      <div className="crt-grain" />

      {/* Top bar — system chrome */}
      <div className="ls-topbar">
        <span>file://centro_studio/index — booting</span>
        <span className="ls-blink">●</span>
      </div>

      {/* Center — 3D logo */}
      <div className="ls-stage">
        <div className="ls-3d">
          <div className="ls-cube">
            {/* 6 faces of a flat-ish disc — rotates around Y */}
            <div className="ls-face ls-face-f"><img src="assets/centro-logo.png" alt="" /></div>
            <div className="ls-face ls-face-b"><img src="assets/centro-logo.png" alt="" /></div>
            <div className="ls-face ls-face-l"><img src="assets/centro-logo.png" alt="" /></div>
            <div className="ls-face ls-face-r"><img src="assets/centro-logo.png" alt="" /></div>
          </div>
        </div>
        <div className="ls-shadow" />
      </div>

      {/* Bottom — progress + meta */}
      <div className="ls-bottom">
        <div className="ls-progress-row">
          <span>LOADING</span>
          <div className="ls-bar"><div className="ls-bar-fill" style={{ width: `${pct}%` }} /></div>
          <span className="ls-pct">{String(pct).padStart(3, "0")}%</span>
        </div>
        <div className="ls-meta">
          <span>v.48 · BA</span>
          <span>conexión estable</span>
          <span>2026 © centro studio</span>
        </div>
        {ready && isFirstVisit && (
          <div className="ls-enter">
            <button className="ls-enter-btn" onClick={handleEnter}>
              [ ENTRAR ]
            </button>
          </div>
        )}
      </div>

      <style>{`
        .ls-photo-bg {
          position: absolute; inset: 0; z-index: 1;
          background-image: url('assets/film-bg.jpg');
          background-size: cover; background-position: center;
          filter: brightness(0.38) grayscale(0.4) contrast(1.1);
        }
        .loading-root {
          position: fixed; inset: 0; z-index: 9999;
          background: #111;
          color: #f0ebe0;
          font-family: "Courier New", "Andale Mono", monospace;
          overflow: hidden;
          animation: lsOut .55s ease .04s both;
          animation-play-state: paused;
        }
        .loading-root.done { animation-play-state: running; }
        @keyframes lsOut { to { opacity: 0; transform: scale(0.98); } }

        .crt-scanlines {
          position: absolute; inset: 0; pointer-events: none; z-index: 3;
          background: repeating-linear-gradient(
            to bottom,
            rgba(0,0,0,0.05) 0px,
            rgba(0,0,0,0.05) 1px,
            transparent 1px,
            transparent 3px
          );
          mix-blend-mode: multiply;
        }
        .crt-vignette {
          position: absolute; inset: 0; pointer-events: none; z-index: 2;
          background: radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.35) 100%);
        }
        .crt-grain {
          position: absolute; inset: -20%; pointer-events: none; z-index: 4;
          opacity: 0.22;
          mix-blend-mode: multiply;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
          animation: grainShift .35s steps(3) infinite;
        }
        @keyframes grainShift {
          0% { transform: translate(0, 0); }
          33% { transform: translate(-4%, 2%); }
          66% { transform: translate(3%, -3%); }
        }

        .ls-topbar {
          position: absolute; top: 0; left: 0; right: 0;
          padding: 14px 18px;
          font-size: 11px; letter-spacing: 0.06em;
          display: flex; justify-content: space-between; align-items: center;
          border-bottom: 1px solid rgba(255,255,255,0.18);
          background: rgba(0,0,0,0.55);
          z-index: 5;
        }
        .ls-blink { animation: blink 1s steps(2) infinite; color: #8a1a16; }
        @keyframes blink { 50% { opacity: 0; } }

        .ls-stage {
          position: absolute;
          top: 44px; left: 0; right: 0; bottom: 100px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          z-index: 6;
          perspective: 900px;
        }
        .ls-3d {
          transform-style: preserve-3d;
          width: clamp(180px, 28vmin, 320px);
          height: clamp(180px, 28vmin, 320px);
          position: relative;
        }
        .ls-cube {
          position: absolute; inset: 0;
          transform-style: preserve-3d;
          animation: spin3d 3.4s cubic-bezier(.55,.05,.45,.95) infinite;
        }
        @keyframes spin3d {
          0%   { transform: rotateY(0deg)    rotateX(8deg); }
          100% { transform: rotateY(360deg)  rotateX(8deg); }
        }
        .ls-face {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          backface-visibility: hidden;
        }
        .ls-face img {
          width: 100%; height: 100%; object-fit: contain;
          filter: invert(1) contrast(1.08);
        }
        .ls-face-f { transform: translateZ(60px); }
        .ls-face-b { transform: translateZ(-60px) rotateY(180deg); }
        .ls-face-l { transform: rotateY(-90deg) translateZ(60px); opacity: 0.18; }
        .ls-face-r { transform: rotateY(90deg)  translateZ(60px); opacity: 0.18; }

        .ls-shadow {
          width: clamp(140px, 22vmin, 260px);
          height: 18px;
          margin-top: 32px;
          background: radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, transparent 70%);
          filter: blur(2px);
          animation: shadowPulse 3.4s cubic-bezier(.55,.05,.45,.95) infinite;
        }
        @keyframes shadowPulse {
          0%, 100% { opacity: 0.55; transform: scaleX(1); }
          50% { opacity: 0.25; transform: scaleX(0.6); }
        }

        .ls-bottom {
          position: absolute; left: 0; right: 0; bottom: 0;
          padding: 18px 18px 22px;
          border-top: 1px solid rgba(255,255,255,0.18);
          background: rgba(0,0,0,0.55);
          z-index: 5;
          font-size: 11px; letter-spacing: 0.06em;
        }
        .ls-progress-row {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 10px;
        }
        .ls-bar {
          flex: 1; height: 8px;
          border: 1px solid rgba(0,0,0,0.5);
          padding: 1px;
          background: rgba(255,255,255,0.4);
        }
        .ls-bar-fill {
          height: 100%;
          background: repeating-linear-gradient(
            90deg,
            #1a1612 0 6px,
            transparent 6px 8px
          );
          transition: width .12s linear;
        }
        .ls-pct {
          min-width: 5ch; text-align: right; font-variant-numeric: tabular-nums;
        }
        .ls-meta {
          display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap;
          color: rgba(255,255,255,0.45);
        }
        .ls-enter {
          display: flex; justify-content: center;
          padding-top: 16px;
        }
        .ls-enter-btn {
          background: #1a1612; color: #efe9dd;
          border: 3px outset #7a6e5e;
          padding: 12px 36px;
          font-family: "Courier New", "Andale Mono", monospace;
          font-size: 15px; letter-spacing: 0.3em; text-transform: uppercase;
          cursor: pointer;
          box-shadow: 3px 3px 0 #000, inset 1px 1px 0 rgba(255,255,255,0.15);
          animation: enterBlink 1.4s steps(2) infinite;
        }
        .ls-enter-btn:hover {
          background: #efe9dd; color: #1a1612; border-style: inset;
          animation: none;
        }
        .ls-enter-btn:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0 #000; }
        @keyframes enterBlink { 50% { opacity: 0.55; } }
        body.loading-active header { display: none !important; }
      `}</style>
    </div>
  );
}

function HomePage({ setRoute }) {
  const { t } = useI18n();
  const [time, setTime] = useStateH(() => new Date());
  const [loaded, setLoaded] = useStateH(false);
  useReveal();

  useEffectH(() => {
    const id = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const tStr = time.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Argentina/Buenos_Aires" });

  return (
    <div className="page-fade">
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}
      <Hero setRoute={setRoute} time={tStr} t={t} />
      <Disciplines setRoute={setRoute} t={t} />
      <NextEvent setRoute={setRoute} t={t} />
    </div>
  );
}

/* ---------------- HERO ---------------- */
function Hero({ setRoute, time, t }) {
  return (
    <section style={{
      minHeight: "100vh",
      paddingTop: 84,
      background: "#fff",
      position: "relative",
      display: "flex",
      flexDirection: "column",
    }}>
      <div className="hero-grid" style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: "1fr",
        alignItems: "stretch",
      }}>

        {/* TYPE COLUMN */}
        <div style={{
          padding: "32px clamp(16px, 5vw, 36px) 32px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 40,
          position: "relative",
          minHeight: "calc(100vh - 84px)",
        }}>

          {/* Top meta */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 24,
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontWeight: 600,
            lineHeight: 1.5,
          }}>
            <span>{t.home.heroSub}</span>
            <span style={{ textAlign: "right" }}>
              {t.location}<br/>{time}h · −34.59° / −58.43°
            </span>
          </div>

          {/* Wordmark — the identity moment */}
          <div style={{ alignSelf: "stretch" }}>
            <h1 style={{
              fontFamily: "var(--display)",
              fontWeight: 900,
              fontSize: "clamp(72px, 17vw, 264px)",
              lineHeight: 0.82,
              letterSpacing: "-0.055em",
              textTransform: "uppercase",
              margin: 0,
              display: "flex",
              alignItems: "center",
              flexWrap: "nowrap",
              gap: "0.04em",
            }}>
              <span>Centro</span>
              <span style={{ display: "inline-flex", alignItems: "center", lineHeight: 0 }}>
                <Asterisk size="0.62em" spin />
              </span>
            </h1>
            <div style={{
              fontFamily: "var(--display)",
              fontWeight: 200,
              fontStyle: "italic",
              fontSize: "clamp(72px, 17vw, 264px)",
              lineHeight: 0.82,
              letterSpacing: "-0.045em",
              margin: "0.02em 0 0 0",
              color: "#000",
            }}>
              studio
            </div>
          </div>

          {/* Bottom row */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 24,
            flexWrap: "wrap",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <LinkArrow onClick={() => setRoute("quote")} label={t.nav.quote} />
              <LinkArrow onClick={() => setRoute("info")} label={t.home.cta} />
              <LinkArrow onClick={() => setRoute("gallery")} label={t.nav.gallery} />
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 10.5,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontWeight: 600,
              color: "rgba(0,0,0,0.55)",
            }}>
              <span>scroll</span>
              <span style={{ width: 1, height: 36, background: "#000" }} />
            </div>
          </div>
        </div>

        {/* PHOTO COLUMN — appears on wider screens */}
        <div className="hero-img" style={{
          display: "none",
          position: "relative",
          background: "#000",
          overflow: "hidden",
        }}>
          <img src="assets/espacio/espacio-01.jpg" alt="" style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "grayscale(1) contrast(1.08) brightness(0.95)",
            display: "block",
          }} />
          <div style={{
            position: "absolute",
            left: 20,
            bottom: 20,
            color: "#fff",
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 600,
            mixBlendMode: "difference",
          }}>
            <div>Fig. 01 — Centro Studio</div>
            <div style={{ opacity: 0.7, marginTop: 4 }}>Av. Córdoba 857 · Retiro, CABA</div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .hero-grid { grid-template-columns: 1.55fr 1fr !important; }
          .hero-img { display: block !important; }
        }
        @media (min-width: 1200px) {
          .hero-grid { grid-template-columns: 1.75fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function LinkArrow({ onClick, label, href, target }) {
  const Tag = href ? "a" : "button";
  const props = href
    ? { href, target, rel: target === "_blank" ? "noopener" : undefined }
    : { onClick };
  return (
    <Tag {...props}
      className="link-arrow"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: 0,
        fontSize: 15,
        fontWeight: 500,
        textAlign: "left",
        background: "none",
        border: "none",
        color: "inherit",
        cursor: "pointer",
        textDecoration: "none",
        fontFamily: "var(--sans)",
      }}>
      <span className="link-arrow-bar" style={{
        width: 22,
        height: 1,
        background: "#000",
        flexShrink: 0,
        transition: "width .25s ease",
      }} />
      <span style={{ borderBottom: "1px solid transparent", paddingBottom: 1, transition: "border-color .2s" }}>
        {label}
      </span>
    </Tag>
  );
}

/* ---------------- DISCIPLINES ---------------- */
function Disciplines({ setRoute, t }) {
  const [hover, setHover] = useStateH(null);
  const routes = ["quote", "gallery", "store", "workshops"];
  const items = (t.home.areas || []).map((a, i) => ({ ...a, route: routes[i] }));

  return (
    <section style={{ background: "#fff", padding: "clamp(56px, 10vw, 140px) 0 60px", borderTop: "1px solid #000" }}>
      <div style={{ padding: "0 clamp(16px, 5vw, 36px)" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 56,
          gap: 16,
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontWeight: 600,
        }}>
          <span>I — {t.home.areaIntro || "Disciplinas"}</span>
          <span style={{ color: "rgba(0,0,0,0.45)" }}>04 · {t.home.eyebrow || "espacios"}</span>
        </div>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {items.map((a, i) => {
            const active = hover === i;
            return (
              <li key={a.num}
                className="disc-item"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setRoute(a.route)}
                style={{
                  borderTop: "1px solid rgba(0,0,0,0.18)",
                  padding: "28px 0",
                  display: "grid",
                  gridTemplateColumns: "60px 1fr auto",
                  gap: 24,
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "padding-left .35s cubic-bezier(.2,.6,.2,1)",
                  paddingLeft: active ? 24 : 0,
                }}>
                <span style={{
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: "rgba(0,0,0,0.5)",
                }}>
                  {a.num}
                </span>
                <span style={{
                  fontFamily: "var(--display)",
                  fontWeight: 900,
                  fontSize: "clamp(40px, 8vw, 120px)",
                  letterSpacing: "-0.045em",
                  lineHeight: 0.95,
                  textTransform: "uppercase",
                  transition: "transform .35s ease",
                  transform: active ? "translateX(8px)" : "none",
                }}>
                  {a.k}
                </span>
                <span className="disc-desc" style={{
                  fontSize: 13,
                  maxWidth: 260,
                  textAlign: "right",
                  color: active ? "#000" : "rgba(0,0,0,0.5)",
                  transition: "color .25s",
                }}>
                  {a.d}
                  <span style={{
                    display: "inline-block",
                    marginLeft: 10,
                    opacity: active ? 1 : 0,
                    transition: "opacity .25s",
                  }}>→</span>
                </span>
              </li>
            );
          })}
          <li style={{ borderTop: "1px solid rgba(0,0,0,0.18)" }} />
        </ul>
      </div>
    </section>
  );
}

/* ---------------- NEXT EVENT ---------------- */
function NextEvent({ setRoute, t }) {
  return (
    <section style={{ background: "#fff", padding: "clamp(56px, 10vw, 140px) 0 clamp(56px, 10vw, 140px)", borderTop: "1px solid rgba(0,0,0,0.18)" }}>
      <div style={{ padding: "0 clamp(16px, 5vw, 36px)" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 56,
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontWeight: 600,
        }}>
          <span>II — {t.home.featured || "Próximo"}</span>
          <span style={{ color: "rgba(0,0,0,0.45)" }}>13.06.26 · expo centro</span>
        </div>

        <div className="next-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 40,
          alignItems: "end",
        }}>
          <div className="next-img" style={{ aspectRatio: "4 / 5", overflow: "hidden", background: "#0a0a0a" }}>
            <img src="assets/event/event-03.jpg" alt="expo centro" style={{
              width: "100%", height: "100%", objectFit: "cover",
              filter: "grayscale(1) contrast(1.05)",
            }} />
          </div>

          <div className="next-text" style={{ paddingBottom: 12 }}>
            <h2 style={{
              fontFamily: "var(--display)",
              fontWeight: 900,
              fontSize: "clamp(48px, 8vw, 128px)",
              lineHeight: 0.9,
              letterSpacing: "-0.045em",
              textTransform: "uppercase",
              margin: 0,
            }}>
              Expo<br/>
              <span style={{ fontWeight: 200, fontStyle: "italic", textTransform: "lowercase" }}>centro</span>
            </h2>

            <div style={{ marginTop: 28, display: "grid", gap: 16, maxWidth: 460 }}>
              <p style={{ fontSize: 16, lineHeight: 1.55, color: "rgba(0,0,0,0.78)", margin: 0 }}>
                Día de puertas abiertas: estudio, galería y showroom funcionando en simultáneo. Comunidad, marcas y obras nuevas.
              </p>

              <dl style={{ margin: "12px 0 0", display: "grid", gridTemplateColumns: "auto 1fr", rowGap: 8, columnGap: 24, fontSize: 13 }}>
                <dt style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(0,0,0,0.5)" }}>Fecha</dt>
                <dd style={{ margin: 0 }}>Sábado 13 Junio 2026</dd>
                <dt style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(0,0,0,0.5)" }}>Próximo</dt>
                <dd style={{ margin: 0 }}>09 Jul · 2da presentación Vol. 48</dd>
                <dt style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(0,0,0,0.5)" }}>Lugar</dt>
                <dd style={{ margin: 0 }}>Av. Córdoba 857 · Retiro, CABA</dd>
              </dl>

              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                <LinkArrow onClick={() => setRoute("events")} label="Ver agenda completa" />
                <LinkArrow onClick={() => setRoute("gallery")} label="Galería · Vol. 48 en curso" />
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (min-width: 900px) {
            .next-grid { grid-template-columns: 1fr 1.1fr !important; gap: 80px !important; }
            .next-img { aspect-ratio: 4 / 5 !important; }
          }
        `}</style>
      </div>
    </section>
  );
}

Object.assign(window, { HomePage });
