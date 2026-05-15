// Guest + Store pages

/* ============== GUEST (Quiero tatuar en Centro) ============== */
const GUEST_WPP_HREF = "https://wa.me/5492804777018?text=" +
  encodeURIComponent("Hola Centro, quiero aplicar como artista guest. Te dejo mi portfolio:");

function GuestPage() {
  const espacio = [
    "assets/espacio/espacio-01.jpg",
    "assets/espacio/espacio-02.jpg",
    "assets/espacio/espacio-03.jpg",
  ];

  return (
    <div className="page-fade" style={{ paddingTop: 64, paddingBottom: 80 }}>
      <SectionHeader index="02" kicker="Guest Program" title={<><em>Tatuá</em> en Centro<Asterisk size={48} /></>}
        intro="Recibimos tatuadores guest en residencias semanales o mensuales. Espacio equipado, comunidad y difusión." />

      {/* Banner with auto-rotating images */}
      <div className="container" style={{ marginTop: 32 }}>
        <AutoBanner
          images={espacio}
          interval={5000}
          ratio="21/9"
          label="Centro Studio · Av. Córdoba 857"
          tag="ESPACIO"
        />
      </div>

      {/* What we offer — sin Difusión, copy revisado en Flujo de clientes */}
      <div className="container" style={{ marginTop: 100 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 32, marginBottom: 32 }}>
          <h2 className="display" style={{ gridColumn: "span 12", fontSize: "clamp(40px, 6vw, 88px)", margin: 0, lineHeight: 1 }}>
            <em>Qué</em> ofrecemos
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 1, background: "var(--hair)", border: "1px solid var(--hair)" }}>
          {[
            { n: "01", k: "Espacio equipado", d: "Camillas, esterilización, materiales descartables y wifi." },
            { n: "02", k: "Flujo de clientes", d: "Comunidad activa que pasa por el estudio cada día." },
            { n: "03", k: "Comunidad", d: "Acceso al ecosistema Centro: artistas, marcas y eventos." },
          ].map(o => (
            <div key={o.n} style={{ background: "#fff", padding: "32px 28px" }}>
              <div className="meta" style={{ marginBottom: 16 }}>{o.n}</div>
              <h3 className="display" style={{ fontSize: 28, margin: "0 0 12px", lineHeight: 1.15 }}>{o.k}</h3>
              <p style={{ fontSize: 14, color: "rgba(0,0,0,0.65)", margin: 0, lineHeight: 1.5 }}>{o.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What we look for */}
      <div className="container" style={{ marginTop: 120 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 48 }}>
          <div style={{ gridColumn: "span 12" }} className="gp-side">
            <h2 className="display" style={{ fontSize: "clamp(40px, 6vw, 80px)", margin: 0, lineHeight: 1 }}>
              <em>Qué</em> buscamos
            </h2>
          </div>
          <div style={{ gridColumn: "span 12" }} className="gp-side">
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                "Portfolio sólido y consistente",
                "Experiencia comprobable",
                "Material propio (máquinas, agujas, tintas)",
              ].map((line, i) => (
                <li key={i} style={{ borderTop: "1px solid var(--hair)", padding: "20px 0", display: "flex", gap: 14 }}>
                  <Asterisk size={12} />
                  <span style={{ fontSize: 18 }}>{line}</span>
                  <span className="mono" style={{ marginLeft: "auto", color: "var(--muted)" }}>{String(i+1).padStart(2,"0")}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <style>{`
          @media (min-width: 900px) {
            .gp-side { grid-column: span 6 !important; }
          }
        `}</style>
      </div>

      {/* CTA */}
      <div className="container" style={{ marginTop: 120 }}>
        <div style={{ background: "#000", color: "#fff", padding: "80px 48px", textAlign: "center" }}>
          <Asterisk size={32} color="#fff" spin />
          <h3 className="display" style={{ fontSize: "clamp(36px, 5vw, 64px)", margin: "32px 0 20px", color: "#fff" }}>
            <em>Mandanos</em> tu portfolio
          </h3>
          <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: 420, margin: "0 auto 32px", fontSize: 16 }}>
            Respondemos a todas las aplicaciones dentro de las 2 semanas.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={GUEST_WPP_HREF} target="_blank" rel="noopener" className="btn btn-dark" style={{ background: "#fff", color: "#000", borderColor: "#fff" }}>
              Contactar por WhatsApp →
            </a>
          </div>
          <div className="mono" style={{ marginTop: 20, color: "rgba(255,255,255,0.45)", fontSize: 11 }}>
            +54 9 280 477 7018
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============== STORE ============== */
const BRANDS = [
  { k: "Simon Raffo",      cat: "Indumentaria",          img: "assets/brands/simon-raffo.jpg" },
  { k: "Barro.vtg",        cat: "Vintage",                img: "assets/brands/barro.jpg" },
  { k: "Misceláneos",      cat: "Vintage",                img: "assets/brands/miscelaneos.jpg" },
  { k: "Deportivo.vtg",    cat: "Vintage",                img: "assets/brands/deportivo.jpg" },
  { k: "Coldsoul",         cat: "Indumentaria",          img: "assets/brands/coldsoul.jpg" },
  { k: "Indawoods",        cat: "Indumentaria",          img: "assets/brands/indawoods.jpg" },
  { k: "Radix",            cat: "Indumentaria",          img: "assets/brands/radix.jpg" },
  { k: "Primitivefuture",  cat: "Indumentaria",          img: "assets/brands/primitivefuture.jpg" },
  { k: "Vision.origen",    cat: "Indumentaria",          img: "assets/brands/visionorigen.jpg" },
  { k: "Sagrada joyas",    cat: "Joyería",                img: "assets/brands/sagrada.jpg" },
  { k: "Nine999",          cat: "Indumentaria",          img: "assets/brands/nine.jpg" },
  { k: "Kuro archives",    cat: "Indumentaria · Chile",  img: "assets/brands/kuro.jpg" },
  { k: "Hesh",             cat: "Indumentaria · Uruguay",img: "assets/brands/hesh.jpg" },
];

function StorePage() {
  const showroom = [
    "assets/showroom/showroom-01.jpg",
    "assets/espacio/espacio-02.jpg",
    "assets/espacio/espacio-03.jpg",
  ];
  return (
    <div className="page-fade" style={{ paddingTop: 64, paddingBottom: 80 }}>
      <SectionHeader index="03" kicker="Centro Store" title={<>Showroom<Asterisk size={48} /></>}
        intro="Marcas seleccionadas en showroom físico. Venta en el espacio y tienda online." />

      <div className="container" style={{ marginTop: 32 }}>
        <AutoBanner
          images={showroom}
          interval={5000}
          ratio="16/9"
          label="Centro Store · Showroom"
          tag="ROOM"
        />
      </div>

      {/* Brands grid */}
      <div className="container" style={{ marginTop: 100 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 32, flexWrap: "wrap", gap: 12, paddingBottom: 24, borderBottom: "1px solid var(--hair)" }}>
          <h2 className="display" style={{ fontSize: "clamp(32px, 4.5vw, 60px)", margin: 0 }}>
            Marcas en rotación <span className="meta" style={{ marginLeft: 8 }}>VOL. 04</span>
          </h2>
          <span className="meta">{BRANDS.length} marcas</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 1, background: "var(--hair)", border: "1px solid var(--hair)" }}>
          {BRANDS.map((b) => (
            <div key={b.k} style={{ background: "#fff", padding: 0, position: "relative", cursor: "pointer", transition: "background .25s" }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--warm)"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
              <div style={{ aspectRatio: "1/1", overflow: "hidden", background: "#0c0c0c", position: "relative" }}>
                <img src={b.img} alt={b.k} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <div className="display" style={{ fontSize: 22 }}>{b.k}</div>
                  <div className="meta" style={{ marginTop: 2 }}>{b.cat}</div>
                </div>
                <span className="mono" style={{ color: "var(--muted)" }}>↗</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40, textAlign: "right" }}>
          <a href="#" className="btn btn-dark">Comprar online →</a>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { GuestPage, StorePage });
