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

/* ============== BLOG HELPERS ============== */
function slugify(title) {
  return title.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/* ============== BLOG RICH TEXT RENDERER ============== */
function renderRichText(node, assets, key) {
  if (!node) return null;
  const ch = (n, k) => (n.content || []).map((c, i) => renderRichText(c, assets, `${k}-${i}`));
  switch (node.nodeType) {
    case "document":
      return React.createElement(React.Fragment, { key }, ch(node, key));
    case "paragraph":
      return React.createElement("p", { key, style: { margin: "0 0 22px", lineHeight: 1.75, fontSize: 17, color: "rgba(0,0,0,0.82)" } }, ch(node, key));
    case "heading-1":
      return React.createElement("h2", { key, className: "display", style: { fontSize: "clamp(28px,3.5vw,52px)", margin: "48px 0 16px", lineHeight: 1.05 } }, ch(node, key));
    case "heading-2":
      return React.createElement("h3", { key, className: "display", style: { fontSize: "clamp(22px,2.8vw,38px)", margin: "40px 0 14px", lineHeight: 1.1 } }, ch(node, key));
    case "heading-3":
      return React.createElement("h4", { key, style: { fontSize: 20, fontWeight: 700, margin: "32px 0 10px", letterSpacing: "-0.02em" } }, ch(node, key));
    case "text": {
      let v = node.value;
      if (!v) return null;
      const marks = (node.marks || []).map(m => m.type);
      if (marks.includes("bold")) v = React.createElement("strong", { key }, v);
      if (marks.includes("italic")) v = React.createElement("em", { key }, v);
      if (marks.includes("underline")) v = React.createElement("u", { key }, v);
      if (marks.includes("code")) v = React.createElement("code", { key, style: { background: "var(--warm)", padding: "2px 7px", fontFamily: "monospace", fontSize: "0.9em" } }, v);
      return v;
    }
    case "hyperlink":
      return React.createElement("a", { key, href: node.data.uri, target: "_blank", rel: "noopener", style: { textDecoration: "underline", color: "inherit" } }, ch(node, key));
    case "unordered-list":
      return React.createElement("ul", { key, style: { paddingLeft: 22, margin: "0 0 22px" } }, ch(node, key));
    case "ordered-list":
      return React.createElement("ol", { key, style: { paddingLeft: 22, margin: "0 0 22px" } }, ch(node, key));
    case "list-item":
      return React.createElement("li", { key, style: { marginBottom: 8, lineHeight: 1.65 } }, ch(node, key));
    case "hr":
      return React.createElement("hr", { key, style: { border: "none", borderTop: "1px solid var(--hair)", margin: "40px 0" } });
    case "blockquote":
      return React.createElement("blockquote", { key, style: { borderLeft: "3px solid #000", paddingLeft: 24, margin: "0 0 24px", fontStyle: "italic", color: "rgba(0,0,0,0.6)" } }, ch(node, key));
    case "embedded-asset-block": {
      const id = node.data && node.data.target && node.data.target.sys ? node.data.target.sys.id : null;
      const url = id ? assets[id] : null;
      if (!url) return null;
      if (/\.(mp4|webm|mov|avi)$/i.test(url)) {
        return React.createElement("video", { key, src: url, controls: true, style: { width: "100%", margin: "32px 0", display: "block" } });
      }
      return React.createElement("img", { key, src: url, alt: "", style: { width: "100%", margin: "32px 0", display: "block" } });
    }
    default:
      if (node.content) return React.createElement(React.Fragment, { key }, ch(node, key));
      return null;
  }
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

function BlogPostDetail({ post, assets, onBack }) {
  React.useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);
  const isRichText = post.body && typeof post.body === "object" && post.body.nodeType === "document";
  const blocks = !isRichText && post.body ? post.body.split(/\n\n+/).filter(Boolean) : [];

  return (
    <div className="page-fade" style={{ paddingTop: 64, paddingBottom: 80 }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 clamp(16px, 5vw, 48px)", boxSizing: "border-box" }}>
        <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 40, fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", cursor: "pointer", background: "none", border: "none", padding: 0 }}>
          ← Volver al blog
        </button>

        {post.cover && (
          <div style={{ marginBottom: 40, aspectRatio: "16/9", overflow: "hidden", background: "var(--warm)" }}>
            <img src={post.cover} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        )}

        <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
          <span className="meta">[ {post.cat} ]</span>
          {post.date && <span className="meta">— {post.date}</span>}
          {post.read && <span className="meta">{post.read} lectura</span>}
        </div>

        <h1 className="display" style={{ fontSize: "clamp(36px, 5vw, 72px)", margin: "0 0 24px", lineHeight: 1 }}>
          {post.title}
        </h1>

        {post.author && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40, paddingBottom: 24, borderBottom: "1px solid var(--hair)" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{post.author.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{post.author}</div>
              <div className="meta">Autor</div>
            </div>
          </div>
        )}

        {post.excerpt && (
          <p style={{ fontSize: 20, lineHeight: 1.5, color: "rgba(0,0,0,0.65)", borderLeft: "3px solid #000", paddingLeft: 20, margin: "0 0 48px", fontStyle: "italic" }}>
            {post.excerpt}
          </p>
        )}

        {isRichText ? (
          <div>{renderRichText(post.body, assets || {}, "rt")}</div>
        ) : blocks.length > 0 ? (
          <div style={{ fontSize: 17, lineHeight: 1.75, color: "rgba(0,0,0,0.82)" }}>
            {blocks.map((block, i) => <p key={i} style={{ margin: "0 0 24px" }}>{block}</p>)}
          </div>
        ) : (
          <p style={{ color: "var(--muted)", fontStyle: "italic" }}>Contenido no disponible.</p>
        )}
      </div>
    </div>
  );
}

function BlogPage() {
  const [cat, setCat] = React.useState("Todas");
  const [entries, setEntries] = React.useState(BLOG_ENTRIES);
  const [selected, setSelected] = React.useState(null);
  const [assets, setAssets] = React.useState({});
  const [pendingSlug] = React.useState(() => {
    const parts = window.location.pathname.replace(/^\//, "").split("/");
    return parts[0] === "blog" && parts[1] ? decodeURIComponent(parts[1]) : null;
  });

  React.useEffect(() => {
    fetch("/api/blog-posts")
      .then(r => r.json())
      .then(d => {
        if (d.ok && d.posts.length > 0) {
          setEntries(d.posts);
          if (d.assets) setAssets(d.assets);
        }
      })
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    if (pendingSlug && !selected) {
      const found = entries.find(e => slugify(e.title) === pendingSlug);
      if (found) setSelected(found);
    }
  }, [pendingSlug, entries]);

  React.useEffect(() => {
    const handler = () => {
      const parts = window.location.pathname.replace(/^\//, "").split("/");
      if (parts[0] === "blog" && !parts[1]) {
        setSelected(null);
        window.scrollTo({ top: 0 });
      }
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const selectPost = (e) => {
    setSelected(e);
    window.history.pushState({}, "", `/blog/${slugify(e.title)}`);
    window.scrollTo({ top: 0 });
  };

  if (selected) {
    return <BlogPostDetail post={selected} assets={assets} onBack={() => {
      setSelected(null);
      window.history.pushState({}, "", "/blog");
      window.scrollTo({ top: 0 });
    }} />;
  }

  const featured = entries[0];
  const rest = entries.slice(1);
  const filtered = cat === "Todas" ? rest : entries.filter(e => e.cat === cat);

  return (
    <div className="page-fade" style={{ paddingTop: 64, paddingBottom: 80 }}>
      <SectionHeader index="01" kicker="Blog" title={<>Diario<Asterisk size={48} /></>}
        intro="Editorial digital del espacio. Entrevistas, notas, procesos y materiales de archivo. Publicado mensualmente." />

      <div className="container" style={{ marginTop: 40 }}>
        <article
          onClick={() => selectPost(featured)}
          style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 32, paddingBottom: 60, borderBottom: "1px solid var(--hair)", cursor: "pointer" }}>
          <div style={{ gridColumn: "span 12" }} className="bf-img">
            {featured.cover
              ? <div style={{ aspectRatio: "16/10", overflow: "hidden", background: "var(--warm)" }}><img src={featured.cover} alt={featured.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /></div>
              : <Placeholder label={"portada — " + featured.title.toLowerCase().slice(0, 40)} tag={featured.cat.toUpperCase()} ratio="16/10" />}
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
            <article key={i} onClick={() => selectPost(e)} style={{ cursor: "pointer" }}>
              <div style={{ position: "relative", overflow: "hidden" }} className="blog-card-img">
                {e.cover
                  ? <div style={{ aspectRatio: "4/5", overflow: "hidden", background: "var(--warm)" }}><img src={e.cover} alt={e.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /></div>
                  : <Placeholder label={e.title.toLowerCase().slice(0, 32)} tag={e.cat.toUpperCase()} ratio="4/5" />}
              </div>
              <div style={{ padding: "16px 0 0" }}>
                <div className="meta" style={{ marginBottom: 8, display: "flex", gap: 12 }}>
                  <span>{e.cat}</span><span>—</span><span>{e.date}</span>
                </div>
                <h3 className="display" style={{ fontSize: 26, lineHeight: 1.15, margin: "0 0 8px" }}>{e.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(0,0,0,0.65)", lineHeight: 1.5, margin: 0 }}>{e.excerpt}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                  <div className="mono" style={{ color: "var(--muted)" }}>{e.read} →</div>
                  {e.author && <div className="meta">{e.author}</div>}
                </div>
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
