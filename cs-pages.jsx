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
  const [cat, setCat] = React.useState("Todas");
  const featured = BLOG_ENTRIES[0];
  const rest = BLOG_ENTRIES.slice(1);
  const filtered = cat === "Todas" ? rest : rest.filter(e => e.cat === cat);

  return (
    <div className="page-fade" style={{ paddingTop: 64, paddingBottom: 80 }}>
      <SectionHeader index="01" kicker="Blog" title={<>Diario<Asterisk size={48} /></>}
        intro="Editorial digital del espacio. Entrevistas, notas, procesos y materiales de archivo. Publicado mensualmente." />

      <div className="container" style={{ marginTop: 40 }}>
        <article style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 32, paddingBottom: 60, borderBottom: "1px solid var(--hair)", cursor: "pointer" }}
          className="reveal">
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
            <article key={i} className="reveal" style={{ cursor: "pointer" }}>
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

function GiftCard({ value, frontBg, backBg, frontColor, accentColor, lastFour, isSelected, isDimmed, onSelect, isCustom, customAmount, onCustomChange, customError, large }) {
  const [pressed, setPressed] = React.useState(false);
  const spinnerRef = React.useRef(null);
  const angleRef = React.useRef(0);
  const hoveredRef = React.useRef(false);
  const frozenRef = React.useRef(false);

  React.useEffect(() => { frozenRef.current = isDimmed; }, [isDimmed]);

  React.useEffect(() => {
    let rafId;
    const tick = () => {
      if (!frozenRef.current) {
        const spd = hoveredRef.current ? 0.1 : 0.65;
        angleRef.current = (angleRef.current + spd) % 360;
        if (spinnerRef.current) {
          spinnerRef.current.style.transform = `rotateY(${angleRef.current}deg)`;
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const isLight = frontBg.startsWith("#F") || frontBg.startsWith("#E");
  const fg = frontColor || (isLight ? "#000" : "#fff");
  const logoFilter = fg === "#fff" ? "invert(1)" : "none";
  const chipGrad = "linear-gradient(135deg, #c8922a 0%, #f0c85a 40%, #c8922a 100%)";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Filter wrapper for dimming */}
      <div style={{
        filter: isDimmed ? "grayscale(1) brightness(0.32)" : "none",
        transform: isSelected ? "scale(1.06)" : "scale(1)",
        transition: "filter 0.35s ease, transform 0.3s cubic-bezier(0.2,0.8,0.2,1)",
      }}>
        <div style={{ perspective: "900px" }}>
          <div
            style={{
              transform: pressed ? "translateY(-18px) scale(1.02)" : "translateY(0) scale(1)",
              transition: "transform 0.28s cubic-bezier(0.2,0.8,0.2,1)",
            }}
            onMouseEnter={() => { hoveredRef.current = true; }}
            onMouseLeave={() => { hoveredRef.current = false; setPressed(false); }}
            onMouseDown={() => { setPressed(true); onSelect(); }}
            onMouseUp={() => setPressed(false)}
            onTouchStart={() => { setPressed(true); onSelect(); }}
            onTouchEnd={() => { setPressed(false); hoveredRef.current = false; }}
          >
            <div ref={spinnerRef} style={{
              width: large ? 320 : 260, height: large ? 202 : 164,
              position: "relative",
              transformStyle: "preserve-3d",
              cursor: "pointer",
            }}>

              {/* ── FRONT ── */}
              <div style={{
                position: "absolute", inset: 0,
                backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
                borderRadius: 11, overflow: "hidden",
                background: frontBg, color: fg,
                boxShadow: "0 20px 52px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.2)",
              }}>
                <div style={{ position: "absolute", left: 20, top: 15, fontSize: 7.5, letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.5, fontFamily: "var(--mono)" }}>Gift Card</div>
                <img src="assets/centro-logo.png" alt="" style={{ position: "absolute", right: 18, top: 12, height: 22, filter: logoFilter, opacity: 0.8 }} />
                <div style={{ position: "absolute", left: 20, top: 42, width: 34, height: 26, borderRadius: 4, background: chipGrad, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)" }}>
                  <div style={{ position: "absolute", inset: "4px 5px", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 2, background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 100%)" }} />
                </div>
                <div style={{ position: "absolute", left: 20, bottom: 34, fontFamily: '"Courier New", monospace', fontSize: isCustom ? 8.5 : 10, letterSpacing: isCustom ? "0.05em" : "0.18em", opacity: 0.75 }}>
                  {isCustom ? "MONTO LIBRE" : `•••• •••• •••• ${lastFour}`}
                </div>
                <div style={{ position: "absolute", left: 20, right: 20, bottom: 10, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div>
                    <div style={{ fontSize: 5.5, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.4, marginBottom: 1, fontFamily: "var(--mono)" }}>Portador</div>
                    <div style={{ fontFamily: '"Courier New", monospace', fontSize: 8.5, letterSpacing: "0.05em" }}>CENTRO STUDIO</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 5.5, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.4, marginBottom: 1, fontFamily: "var(--mono)" }}>Válido hasta</div>
                    <div style={{ fontFamily: '"Courier New", monospace', fontSize: 8.5 }}>12/27</div>
                  </div>
                </div>
                {accentColor && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: accentColor }} />}
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 55%)" }} />
              </div>

              {/* ── BACK ── */}
              <div style={{
                position: "absolute", inset: 0,
                backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                borderRadius: 11, overflow: "hidden",
                background: backBg || "#111",
                boxShadow: "0 20px 52px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.2)",
              }}>
                {accentColor && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: accentColor }} />}
                <div style={{ position: "absolute", top: 22, left: 0, right: 0, height: 34, background: "linear-gradient(to bottom, #1a1a1a, #000 50%, #1a1a1a)" }} />
                <div style={{ position: "absolute", left: 18, right: 56, top: 76, height: 24, borderRadius: 2, background: "repeating-linear-gradient(90deg, #e6e2de 0 2px, #f0ece8 2px 4px)", display: "flex", alignItems: "center", paddingLeft: 7, overflow: "hidden" }}>
                  <span style={{ fontFamily: '"Brush Script MT", cursive', fontSize: 12, color: "#333", opacity: 0.6 }}>Centro</span>
                </div>
                <div style={{ position: "absolute", right: 18, top: 76, width: 32, height: 24, borderRadius: 2, background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontSize: 5.5, color: "#000", opacity: 0.4, letterSpacing: "0.05em", marginBottom: 1, fontFamily: "var(--mono)", textTransform: "uppercase" }}>CVV</div>
                  <div style={{ fontFamily: '"Courier New", monospace', fontSize: 9, color: "#000" }}>•••</div>
                </div>
                <div style={{ position: "absolute", left: 18, right: 18, bottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontFamily: '"Courier New", monospace', fontSize: 7.5, color: "rgba(255,255,255,0.38)", letterSpacing: "0.1em" }}>
                    {isCustom ? "•••• •••• •••• XXXX" : `•••• •••• •••• ${lastFour}`}
                  </div>
                  <img src="assets/centro-logo.png" alt="" style={{ height: 13, filter: "invert(1)", opacity: 0.32 }} />
                </div>
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 3, fontSize: 5.5, letterSpacing: "0.04em", color: "rgba(255,255,255,0.16)", fontFamily: "var(--sans)", textAlign: "center" }}>
                  centrostudio.ar · Retiro, CABA
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Value / Custom input — outside the dimming wrapper */}
      <div style={{ marginTop: 22, textAlign: "center", minHeight: 68 }}>
        {isCustom ? (
          isSelected ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 20, fontWeight: 700 }}>$</span>
                <input
                  type="number"
                  min="50000"
                  step="1000"
                  placeholder="50.000"
                  value={customAmount}
                  onChange={e => onCustomChange(e.target.value)}
                  onClick={e => e.stopPropagation()}
                  style={{
                    background: "transparent", border: "none", borderBottom: "2px solid #000",
                    outline: "none", fontSize: 28, fontFamily: '"Courier New", monospace',
                    fontWeight: 700, width: 160, padding: "2px 0",
                    letterSpacing: "-0.01em", color: "#000",
                  }}
                />
              </div>
              {customError
                ? <div style={{ fontSize: 10.5, color: "#8a1a16", fontFamily: "var(--mono)", letterSpacing: "0.06em" }}>{customError}</div>
                : <div className="meta" style={{ fontSize: 10 }}>mínimo $50.000</div>
              }
            </div>
          ) : (
            <div style={{ cursor: "pointer" }} onClick={onSelect}>
              <div className="display" style={{ fontSize: 32, letterSpacing: "-0.03em", opacity: 0.38 }}>$—</div>
              <div className="meta" style={{ marginTop: 4, fontSize: 10 }}>Monto personalizado</div>
            </div>
          )
        ) : (
          <div className="display" style={{ fontSize: 32, letterSpacing: "-0.03em", cursor: "pointer" }} onClick={onSelect}>{value}</div>
        )}
      </div>
    </div>
  );
}

function GiftcardPage() {
  const [selectedIdx, setSelectedIdx] = React.useState(null);
  const [customAmount, setCustomAmount] = React.useState("");
  const [customError, setCustomError] = React.useState("");

  const CARDS = [
    { id: 0, value: "$100.000", frontBg: "#F5F2EE", backBg: "#111",    frontColor: "#000",  lastFour: "1001" },
    { id: 1, value: "$200.000", frontBg: "#111111", backBg: "#0a0a0a", frontColor: "#fff",  lastFour: "2002" },
    { id: 2, value: "$300.000", frontBg: "#0c0c0c", backBg: "#0a0a0a", frontColor: "#fff",  accentColor: "#8a1a16", lastFour: "3003" },
    { id: 3, value: null,       frontBg: "#F5F2EE", backBg: "#111",    frontColor: "#000",  lastFour: "XXXX", isCustom: true, large: true },
  ];

  const handleSelect = (idx) => {
    setSelectedIdx(prev => (prev === idx ? null : idx));
    setCustomError("");
  };

  const handleCustomChange = (val) => {
    setCustomAmount(val);
    if (customError && val && parseInt(val) >= 50000) setCustomError("");
  };

  const getAmount = () => {
    if (selectedIdx === null) return null;
    if (selectedIdx === 3) { const n = parseInt(customAmount); return (!isNaN(n) && n >= 50000) ? n : null; }
    return [100000, 200000, 300000][selectedIdx];
  };

  const handleConfirm = () => {
    if (selectedIdx === null) return;
    if (selectedIdx === 3) {
      const n = parseInt(customAmount);
      if (!customAmount || isNaN(n) || n < 50000) { setCustomError("El monto mínimo es $50.000"); return; }
    }
    const amount = getAmount();
    if (!amount) return;
    const formatted = amount.toLocaleString("es-AR");
    const msg = `Hola! Quiero pedir una Gift Card de Centro Studio.\n\nMonto elegido: $${formatted}\n\nGracias!`;
    window.open("https://wa.me/" + WPP_GC + "?text=" + encodeURIComponent(msg), "_blank");
  };

  const canConfirm = getAmount() !== null;

  return (
    <div className="page-fade" style={{ paddingTop: 64, paddingBottom: 100 }}>
      <SectionHeader
        index="09"
        kicker="Centro · Gift Card"
        title={<>Gift<Asterisk size={48} /></>}
        intro="Un regalo para canjear por cualquier servicio u objeto de Centro Studio: tatuajes, ropa, accesorios, merch, talleres y más. Sin fecha de vencimiento. Válida en el espacio físico."
      />

      {/* Cards grid */}
      <div className="container" style={{ marginTop: 80 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "52px 32px",
          justifyItems: "center",
        }}>
          {CARDS.map((card, idx) => (
            <GiftCard
              key={card.id}
              {...card}
              isSelected={selectedIdx === idx}
              isDimmed={selectedIdx !== null && selectedIdx !== idx}
              onSelect={() => handleSelect(idx)}
              customAmount={customAmount}
              onCustomChange={handleCustomChange}
              customError={idx === 3 ? customError : ""}
            />
          ))}
        </div>

        {/* Confirm CTA */}
        <div style={{ marginTop: 64, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="btn btn-dark"
            style={{ fontSize: 13.5, padding: "18px 44px", letterSpacing: "0.08em", opacity: canConfirm ? 1 : 0.28, transition: "opacity 0.3s ease" }}
          >
            Confirmar — Pedir mi Gift Card &nbsp;
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ display: "inline", verticalAlign: "middle" }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.125.557 4.122 1.529 5.855L0 24l6.335-1.509C8.021 23.465 9.977 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.634-.511-5.131-1.397l-.367-.218-3.762.896.957-3.67-.239-.378C2.54 15.556 2 13.84 2 12 2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
          </button>
          {selectedIdx === null && (
            <div className="meta" style={{ fontSize: 10 }}>Seleccioná una tarjeta para continuar</div>
          )}
        </div>
      </div>

      {/* How it works */}
      <div className="container" style={{ marginTop: 120 }}>
        <div style={{ borderTop: "2px solid #000", paddingTop: 48, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40 }}>
          {[
            { n: "01", t: "Elegís el monto", d: "Tres valores fijos o ingresá el tuyo desde $50.000." },
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
