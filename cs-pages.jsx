// Remaining pages: Blog, Guest, Store, Workshops, Gallery, Events, Info

/* ---------------- AUTO-ROTATING BANNER ---------------- */
function AutoBanner({ images, interval = 5000, ratio = "21/9", label, tag }) {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    if (!images || images.length <= 1) return;
    const id = setInterval(() => setI(x => (x + 1) % images.length), interval);
    return () => clearInterval(id);
  }, [images, interval]);

  return (
    <div style={{
      position: "relative", aspectRatio: ratio, overflow: "hidden",
      background: "#0c0c0c", border: "1px solid #000",
    }}>
      {images.map((src, idx) => (
        <img key={src} src={src} alt=""
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%", objectFit: "cover",
            opacity: idx === i ? 1 : 0,
            transition: "opacity 1.2s ease",
            display: "block",
          }}
        />
      ))}
      {tag && (
        <span className="mono" style={{
          position: "absolute", top: 14, right: 14, zIndex: 2,
          background: "#fff", border: "1px solid #000",
          padding: "5px 9px", fontSize: 10, letterSpacing: "0.08em",
        }}>{tag}</span>
      )}
      {label && (
        <div className="mono" style={{
          position: "absolute", bottom: 14, left: 14, zIndex: 2,
          background: "rgba(0,0,0,0.65)", color: "#fff",
          padding: "6px 10px", fontSize: 10, letterSpacing: "0.1em",
        }}>— {label}</div>
      )}
      {images.length > 1 && (
        <div style={{
          position: "absolute", bottom: 14, right: 14, zIndex: 2,
          display: "flex", gap: 6,
        }}>
          {images.map((_, idx) => (
            <span key={idx} style={{
              width: idx === i ? 18 : 8, height: 4,
              background: idx === i ? "#fff" : "rgba(255,255,255,0.4)",
              transition: "all .3s",
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ============== BLOG ============== */
const BLOG_ENTRIES = [
  { cat: "Entrevista", title: "Lucía Vega: dibujar en piel como acto de presencia", excerpt: "La residente del estudio reflexiona sobre fine line, intuición y la importancia del primer trazo.", read: "8 min", date: "28 Abr 2026", featured: true },
  { cat: "Procesos", title: "Cómo se prepara una muestra en Galería Vol. 48", excerpt: "Del concepto curatorial a la apertura — un mes detrás de escena.", read: "5 min", date: "21 Abr 2026" },
  { cat: "Notas", title: "Retiro: barrio, comunidad y espacios cruzados", excerpt: "Una crónica del barrio que aloja a Centro y a su escena vecina.", read: "6 min", date: "12 Abr 2026" },
  { cat: "Artistas", title: "Sol Berón en residencia — microrealismo y memoria", excerpt: "La artista guest comparte su semana de trabajo en el estudio.", read: "7 min", date: "04 Abr 2026" },
  { cat: "Procesos", title: "Cuidados del tatuaje, explicados", excerpt: "Una guía visual para antes, durante y después del turno.", read: "4 min", date: "29 Mar 2026" },
  { cat: "Entrevista", title: "Mateo Río: el lettering como caligrafía contemporánea", excerpt: "Conversación sobre tipografía, ritmo y disciplina.", read: "9 min", date: "21 Mar 2026" },
  { cat: "Notas", title: "Marcas independientes: por qué el showroom rota", excerpt: "Pensamos el Centro Store como un editorial de objetos.", read: "5 min", date: "14 Mar 2026" },
];
const CATS = ["Todas", "Entrevista", "Notas", "Procesos", "Artistas"];

function BlogPage() {
  useReveal();
  const [cat, setCat] = React.useState("Todas");
  const [entries, setEntries] = React.useState(BLOG_ENTRIES);

  React.useEffect(() => {
    fetch("/api/blog-posts")
      .then(r => r.json())
      .then(d => { if (d.ok && d.posts.length > 0) setEntries(d.posts); })
      .catch(() => {});
  }, []);

  const featured = entries[0];
  const rest = entries.slice(1);
  const filtered = cat === "Todas" ? rest : rest.filter(e => e.cat === cat);

  return (
    <div className="page-fade" style={{ paddingTop: 64, paddingBottom: 80 }}>
      <SectionHeader index="01" kicker="Blog" title={<>Diario<Asterisk size={48} /></>}
        intro="Editorial digital del espacio. Entrevistas, notas, procesos y materiales de archivo. Publicado mensualmente." />

      <div className="container" style={{ marginTop: 40 }}>
        <article style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 32, paddingBottom: 60, borderBottom: "1px solid var(--hair)", cursor: "pointer" }}>
          <div style={{ gridColumn: "span 12" }} className="bf-img">
            <Placeholder label={"portada — " + featured.title.toLowerCase().slice(0, 40)} tag={featured.cat.toUpperCase()} ratio="16/10" />
          </div>
          <div style={{ gridColumn: "span 12" }} className="bf-text">
            <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
              <span className="meta">[ Featured ]</span>
              <span className="meta">— {featured.cat}</span>
              <span className="meta">{featured.date}</span>
            </div>
            <h2 className="display" style={{ fontSize: "clamp(36px, 5vw, 64px)", margin: "0 0 20px", lineHeight: 1.05 }}>
              {featured.title}
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.55, color: "rgba(0,0,0,0.7)", maxWidth: 540 }}>
              {featured.excerpt}
            </p>
            <div className="mono" style={{ marginTop: 20, color: "var(--muted)" }}>
              {featured.read} lectura · Leer nota →
            </div>
          </div>
        </article>
        <style>{`
          @media (min-width: 900px) {
            .bf-img { grid-column: 1 / span 7 !important; }
            .bf-text { grid-column: 8 / span 5 !important; padding-top: 20px; }
          }
        `}</style>
      </div>

      <div className="container" style={{ marginTop: 60, display: "flex", gap: 8, flexWrap: "wrap", borderBottom: "1px solid var(--hair)", paddingBottom: 24 }}>
        {CATS.map(c => (
          <button key={c} className={"pill" + (cat === c ? " active" : "")} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
        <span className="meta" style={{ marginLeft: "auto", alignSelf: "center" }}>
          {filtered.length} {filtered.length === 1 ? "entrada" : "entradas"}
        </span>
      </div>

      <div className="container" style={{ marginTop: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32 }}>
          {filtered.map((e, i) => (
            <article key={i} style={{ cursor: "pointer" }}>
              <div style={{ position: "relative", overflow: "hidden" }} className="blog-card-img">
                <Placeholder label={e.title.toLowerCase().slice(0, 32)} tag={e.cat.toUpperCase()} ratio="4/5" />
              </div>
              <div style={{ padding: "16px 0 0" }}>
                <div className="meta" style={{ marginBottom: 8, display: "flex", gap: 12 }}>
                  <span>{e.cat}</span><span>—</span><span>{e.date}</span>
                </div>
                <h3 className="display" style={{ fontSize: 26, lineHeight: 1.15, margin: "0 0 8px" }}>{e.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(0,0,0,0.65)", lineHeight: 1.5, margin: 0 }}>{e.excerpt}</p>
                <div className="mono" style={{ marginTop: 12, color: "var(--muted)" }}>{e.read} →</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============== GIFT CARD ============== */
const WPP_GC = "5492804777018";
const CARD_W = 320, CARD_H = 202;
const chipGrad = "linear-gradient(135deg, #c8922a 0%, #f0c85a 40%, #c8922a 100%)";

function GiftCardFace({ fg, logoFilter }) {
  return (
    <div style={{
      position: "absolute", inset: 0,
      backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
      borderRadius: 14, overflow: "hidden",
      background: "#F5F2EE", color: fg,
      boxShadow: "0 28px 64px rgba(0,0,0,0.38), 0 6px 16px rgba(0,0,0,0.16)",
    }}>
      <div style={{ position: "absolute", left: 22, top: 16, fontSize: 8, letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.45, fontFamily: "var(--mono)" }}>Gift Card</div>
      <img src="assets/centro-logo.png" alt="" style={{ position: "absolute", right: 20, top: 13, height: 24, filter: logoFilter, opacity: 0.85 }} />
      <div style={{ position: "absolute", left: 22, top: 46, width: 38, height: 29, borderRadius: 4, background: chipGrad, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)" }}>
        <div style={{ position: "absolute", inset: "4px 5px", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 2 }} />
      </div>
      <div style={{ position: "absolute", left: 22, bottom: 36, fontFamily: '"Courier New", monospace', fontSize: 9.5, letterSpacing: "0.07em", opacity: 0.7 }}>MONTO LIBRE</div>
      <div style={{ position: "absolute", left: 22, right: 22, bottom: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 6, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.38, marginBottom: 2, fontFamily: "var(--mono)" }}>Portador</div>
          <div style={{ fontFamily: '"Courier New", monospace', fontSize: 9, letterSpacing: "0.04em" }}>CENTRO STUDIO</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 6, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.38, marginBottom: 2, fontFamily: "var(--mono)" }}>Válido hasta</div>
          <div style={{ fontFamily: '"Courier New", monospace', fontSize: 9 }}>12/27</div>
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, transparent 55%)" }} />
    </div>
  );
}

function GiftCardBack() {
  return (
    <div style={{
      position: "absolute", inset: 0,
      backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
      transform: "rotateY(180deg)",
      borderRadius: 14, overflow: "hidden",
      background: "#111",
      boxShadow: "0 28px 64px rgba(0,0,0,0.38), 0 6px 16px rgba(0,0,0,0.16)",
    }}>
      <div style={{ position: "absolute", top: 24, left: 0, right: 0, height: 38, background: "linear-gradient(to bottom, #1a1a1a, #000 50%, #1a1a1a)" }} />
      <div style={{ position: "absolute", left: 20, right: 60, top: 82, height: 26, borderRadius: 2, background: "repeating-linear-gradient(90deg, #e6e2de 0 2px, #f0ece8 2px 4px)", display: "flex", alignItems: "center", paddingLeft: 8, overflow: "hidden" }}>
        <span style={{ fontFamily: '"Brush Script MT", cursive', fontSize: 13, color: "#333", opacity: 0.55 }}>Centro</span>
      </div>
      <div style={{ position: "absolute", right: 20, top: 82, width: 34, height: 26, borderRadius: 2, background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 5.5, color: "#000", opacity: 0.4, marginBottom: 1, fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.04em" }}>CVV</div>
        <div style={{ fontFamily: '"Courier New", monospace', fontSize: 9.5, color: "#000" }}>•••</div>
      </div>
      <div style={{ position: "absolute", left: 20, right: 20, bottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: '"Courier New", monospace', fontSize: 8, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>•••• •••• •••• XXXX</div>
        <img src="assets/centro-logo.png" alt="" style={{ height: 14, filter: "invert(1)", opacity: 0.28 }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 3, fontSize: 5.5, letterSpacing: "0.04em", color: "rgba(255,255,255,0.14)", fontFamily: "var(--sans)", textAlign: "center" }}>
        centrostudio.ar · Retiro, CABA
      </div>
    </div>
  );
}

function GiftCard() {
  const spinnerRef = React.useRef(null);
  const wrapperRef = React.useRef(null);
  const angleRef = React.useRef(0);
  const hoveredRef = React.useRef(false);
  const modeRef = React.useRef("spinning");
  const [mode, setMode] = React.useState("spinning");
  const [customAmount, setCustomAmount] = React.useState("");
  const [customError, setCustomError] = React.useState("");

  React.useEffect(() => { modeRef.current = mode; }, [mode]);

  React.useEffect(() => {
    let rafId;
    const tick = () => {
      if (modeRef.current === "spinning") {
        const speed = hoveredRef.current ? 0.35 : 1.9;
        angleRef.current += speed;
        if (spinnerRef.current) {
          spinnerRef.current.style.transform = `rotateY(${angleRef.current}deg)`;
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handleTap = () => {
    if (modeRef.current !== "spinning") return;
    modeRef.current = "snapping";
    setMode("snapping");
    const normalized = Math.round(angleRef.current / 360) * 360;
    angleRef.current = normalized;
    if (spinnerRef.current) {
      spinnerRef.current.style.transition = "transform 0.42s cubic-bezier(0.2,0.8,0.2,1)";
      spinnerRef.current.style.transform = `rotateY(${normalized}deg)`;
    }
    setTimeout(() => {
      if (spinnerRef.current) spinnerRef.current.style.transition = "";
      modeRef.current = "floating";
      setMode("floating");
    }, 450);
  };

  const handleConfirmCard = () => {
    const n = parseInt(customAmount);
    if (!customAmount || isNaN(n) || n < 50000) { setCustomError("El monto mínimo es $50.000"); return; }
    setCustomError("");
    const formatted = n.toLocaleString("es-AR");
    const msg = `Hola! Quiero pedir una Gift Card de Centro Studio.\n\nMonto elegido: $${formatted}\n\nGracias!`;
    window.open("https://wa.me/" + WPP_GC + "?text=" + encodeURIComponent(msg), "_blank");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <style>{`
        @keyframes gcFloat {
          0%, 100% { transform: translateY(0px) rotate(-0.4deg); }
          50% { transform: translateY(-14px) rotate(0.4deg); }
        }
      `}</style>
      <div
        ref={wrapperRef}
        onClick={handleTap}
        onMouseEnter={() => { hoveredRef.current = true; }}
        onMouseLeave={() => { hoveredRef.current = false; }}
        style={{
          perspective: "900px",
          cursor: mode === "spinning" ? "pointer" : "default",
          animation: mode === "floating" ? "gcFloat 3.8s ease-in-out infinite" : "none",
        }}
      >
        <div
          ref={spinnerRef}
          style={{
            width: CARD_W, height: CARD_H,
            position: "relative",
            transformStyle: "preserve-3d",
          }}
        >
          <GiftCardFace fg="#000" logoFilter="none" />
          <GiftCardBack />
        </div>
      </div>

      {mode === "floating" && (
        <div style={{ marginTop: 36, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: 22, fontWeight: 700 }}>$</span>
            <input
              type="number" min="50000" step="1000" placeholder="50.000"
              value={customAmount}
              onChange={e => { setCustomAmount(e.target.value); if (customError) setCustomError(""); }}
              autoFocus
              style={{
                background: "transparent", border: "none", borderBottom: "2px solid #000",
                outline: "none", fontSize: 32, fontFamily: '"Courier New", monospace',
                fontWeight: 700, width: 180, padding: "2px 0",
                letterSpacing: "-0.01em", color: "#000",
              }}
            />
          </div>
          {customError
            ? <div style={{ fontSize: 10.5, color: "#8a1a16", fontFamily: "var(--mono)", letterSpacing: "0.06em" }}>{customError}</div>
            : <div className="meta" style={{ fontSize: 10 }}>mínimo $50.000</div>
          }
          <button
            onClick={handleConfirmCard}
            className="btn btn-dark"
            style={{ marginTop: 8, fontSize: 13.5, padding: "16px 40px", letterSpacing: "0.08em" }}
          >
            Pedir mi Gift Card &nbsp;→
          </button>
        </div>
      )}

      {mode === "spinning" && (
        <div className="meta" style={{ marginTop: 20, fontSize: 10 }}>Tocá la tarjeta para personalizar</div>
      )}
    </div>
  );
}

function GiftcardPage() {
  return (
    <div className="page-fade" style={{ paddingTop: 64, paddingBottom: 100 }}>
      <SectionHeader
        index="09"
        kicker="Centro · Gift Card"
        title={<>Gift<Asterisk size={48} /></>}
        intro="Un regalo para canjear por cualquier servicio u objeto de Centro Studio: tatuajes, ropa, accesorios, merch, talleres y más. Sin fecha de vencimiento. Válida en el espacio físico."
      />

      <div className="container" style={{ marginTop: 80, display: "flex", justifyContent: "center" }}>
        <GiftCard />
      </div>

      <div className="container" style={{ marginTop: 120 }}>
        <div style={{ borderTop: "2px solid #000", paddingTop: 48, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40 }}>
          {[
            { n: "01", t: "Elegís el monto", d: "Ingresá el monto que querés regalar desde $50.000." },
            { n: "02", t: "Lo mandamos por WhatsApp", d: "Recibís el código de canje en menos de 24h." },
            { n: "03", t: "Presentás en el estudio", d: "Mostrás el código en el mostrador o en el turno de tatuaje." },
            { n: "04", t: "Canjeás por lo que quieras", d: "Tatuaje, ropa, taller, accesorios — lo que más te guste." },
          ].map(s => (
            <div key={s.n}>
              <div className="meta" style={{ marginBottom: 12 }}>[ {s.n} ]</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{s.t}</div>
              <div style={{ fontSize: 14, color: "rgba(0,0,0,0.6)", lineHeight: 1.55 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { BlogPage, AutoBanner, GiftcardPage });
