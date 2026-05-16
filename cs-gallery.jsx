// Gallery page — Vol. 48 Re-colección — bordo accents, editorial trash

function GalleryCarousel({ images, interval = 3000 }) {
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    if (!images || images.length <= 1) return;
    const id = setInterval(() => setIdx(x => (x + 1) % images.length), interval);
    return () => clearInterval(id);
  }, [images, interval]);
  return (
    <div style={{ position: "relative", aspectRatio: "3/2", overflow: "hidden", background: "#0c0c0c" }}>
      {images.map((src, i) => (
        <img key={src} src={src} alt=""
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%", objectFit: "cover",
            opacity: i === idx ? 1 : 0,
            transition: "opacity 1.2s ease",
            display: "block",
          }}
        />
      ))}
      <div style={{
        position: "absolute", bottom: 14, right: 14, zIndex: 2,
        display: "flex", gap: 6,
      }}>
        {images.map((_, i) => (
          <span key={i} style={{
            width: i === idx ? 18 : 8, height: 4,
            background: i === idx ? "#fff" : "rgba(255,255,255,0.4)",
            transition: "all .3s",
          }} />
        ))}
      </div>
      <div style={{
        position: "absolute", bottom: 14, left: 14, zIndex: 2,
        background: "rgba(0,0,0,0.65)", color: "#fff",
        padding: "6px 10px", fontSize: 10, letterSpacing: "0.1em",
        fontFamily: "var(--mono)", textTransform: "uppercase",
      }}>— Apertura Vol. 48 · 09 mayo</div>
    </div>
  );
}

const VOL48_OBRAS = [
  { img: "assets/obras/abril-amorosa.png",    artist: "Abril Barboza",         ig: "@abrilamorosa",       title: "Nunca volví a sentirme inmortal", year: 2024, tech: "Acrílico sobre lienzo",       dims: "140 × 70 cm",  trastienda: false },
  { img: "assets/obras/lara-belaglovski.png", artist: "Lara Belaglovsky",      ig: "@bravelar4",          title: "El tercer piso",                  year: 2024, tech: "Óleo sobre tela",             dims: "65 × 50 cm",   trastienda: false, rotation: 180 },
  { img: "assets/obras/carbon-based-kid.png", artist: "Julián Caprara Gatti",  ig: "@carbon.based.kid",   title: "Mi amor, mi amor",                year: 2024, tech: "Óleo sobre madera",           dims: "23 × 20 cm",   trastienda: false, rotation: -90 },
  { img: "assets/obras/coti.png",             artist: "Costanza Rossi",        ig: "@cowgirlcoti",        title: "Primicias del ritual",            year: 2026, tech: "Óleo sobre lienzo",           dims: "60 × 70 cm",   trastienda: false },
  { img: "assets/obras/cronico.png",          artist: "Nahuel Olivera",        ig: "@_cronico_",          title: "Mi ira en HD",                    year: 2025, tech: "Acrílico sobre lienzo",       dims: "100 × 80 cm",  trastienda: false },
  { img: "assets/obras/ailen-guerra.png",     artist: "Ailen Guerra",          ig: "@ailenguerraart",     title: "Ignorant",                        year: 2024, tech: "Óleo sobre lienzo de algodón",dims: "150 × 150 cm", trastienda: false },
  { img: "assets/obras/miguel.png",           artist: "M. Kittlein",           ig: "@m_kittlein",         title: "Lachechism",                      year: "2021/2026", tech: "Óleo sobre tela",      dims: "180 × 100 cm", trastienda: false },
  { img: "assets/obras/sofia-igenes.png",     artist: "Sofía Igenes",          ig: "@sofiaigenes",        title: "Concepción del hogar",            year: 2025, tech: "Óleo sobre tela",             dims: "50 × 50 cm",   trastienda: false, rotation: 180 },
  { img: "assets/obras/invloon.png",          artist: "Valentina Sol Andrés",  ig: "@invloon",            title: "Panteón de los heridos",          year: 2024, tech: "Óleo sobre plástico",         dims: "23 × 39 cm",   trastienda: true  },
  { img: "assets/obras/guadeeh.jpg",          artist: "Guade Estienne",        ig: "@guadeeeh",           title: "El mar entre nosotros",           year: 2025, tech: "Óleo sobre tela",             dims: "60 × 60 cm",   trastienda: true  },
  { img: "assets/obras/pilar-frelliaro.png",  artist: "Pilar Frelliaro",       ig: "@pilarfrelliaro",     title: "Todo esto es efímero",            year: 2025, tech: "Acrílico sobre MDF entelado", dims: "41 × 29 cm",   trastienda: false },
  { img: "assets/obras/willy-fishman.png",    artist: "Willy Fishman",         ig: "@willy_fishman",      title: "Bananafishbones",                 year: 2026, tech: "Acuarela sobre papel",        dims: "30 × 13 cm",   trastienda: true  },
  { img: "assets/obras/collector.png",        artist: "Mox S. (Collector)",    ig: "@______collector",    title: "GeneSis",                         year: 2026, tech: "Técnica mixta",               dims: "51 × 59 cm",   trastienda: false },
  { img: "assets/obras/carlitos-wake.png",    artist: "Carlos Wake Carrera",   ig: "@carlitos_wake",      title: "Mahakala 1",                      year: 2025, tech: "Tinta y acuarela sobre papel",dims: "50 × 70 cm",   trastienda: true  },
  { img: "assets/obras/skate-rat.png",        artist: "Skate Rat",             ig: "@skate.rat.tattoo",   title: "S/T",                             year: 2026, tech: "Aerógrafo y acrílico s/papel madera", dims: "76 × 55 cm", trastienda: true },
  { img: "assets/obras/lauta-suas.png",       artist: "Lautaro Suasnabar",     ig: "@lauta_suas",         title: "Ensalada de frutas",              year: 2026, tech: "Acuarela y tinta china",      dims: "70 × 50 cm",   trastienda: false },
  { img: "assets/obras/maxis.png",            artist: "Maxis",                 ig: "@maxis.sb",           title: "Relación sana",                   year: 2025, tech: "Lapicera sobre papel",        dims: "50 × 40 cm",   trastienda: false },
  { img: "assets/obras/situacion.png",        artist: "Situación",             ig: "@situaciooooooon",    title: "Situaciones paralelas",           year: 2026, tech: "Técnica mixta",               dims: "—",            trastienda: true  },
];

function buyMailto(w) {
  const subject = `Consulta — ${w.title} (${w.artist})`;
  const body =
    `Hola Centro,\n\nMe interesa la siguiente obra de la galería Vol. 48 (Re-colección):\n\n` +
    `· Artista:   ${w.artist} (${w.ig})\n` +
    `· Obra:      ${w.title} (${w.year})\n` +
    `· Técnica:   ${w.tech}\n` +
    `· Medidas:   ${w.dims}\n` +
    `${w.trastienda ? "· Disponible en trastienda\n" : ""}` +
    `\nQuisiera saber:\n[ ] precio y disponibilidad\n[ ] medios de pago\n[ ] envío o retiro en el espacio\n[ ] coordinar visita\n\n` +
    `Mis datos:\nNombre:\nTeléfono:\nCiudad:\n\nGracias.`;
  return "mailto:abrilmilenabarboza@gmail.com" +
    "?subject=" + encodeURIComponent(subject) +
    "&body=" + encodeURIComponent(body);
}

const EVENT_PHOTOS = [
  "assets/event/event-03.jpg",
  "assets/event/event-04.jpg",
  "assets/event/event-05.jpg",
  "assets/event/event-06.jpg",
  "assets/event/event-07.jpg",
  "assets/event/event-01.jpg",
  "assets/event/event-02.jpg",
];

function GalleryPage() {
  const bordo = "#8a1a16";

  return (
    <div className="page-fade" style={{ paddingTop: 64, paddingBottom: 80 }}>
      <SectionHeader index="05" kicker="Galería · Vol. 48" title={<>Galería<Asterisk size={48} /></>}
        intro="Vol. 48 — Re-colección. Cuatro semanas de obra en convivencia con la práctica del tatuaje. En curso hasta el 9 de julio." />

      {/* Vol48 brand strip — bordo */}
      <div className="container" style={{ marginTop: 24 }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 28, flexWrap: "wrap",
          background: bordo, color: "#fff",
          padding: "20px 28px",
          border: `1px solid ${bordo}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
            <img src="assets/vol48-logo.png" alt="Vol. 48"
              style={{ height: 64, filter: "brightness(0) invert(1)" }} />
            <div>
              <div className="mono" style={{ fontSize: 11, letterSpacing: "0.1em", opacity: 0.8 }}>VOL. 48 · RE-COLECCIÓN</div>
              <div className="display" style={{ fontSize: "clamp(18px, 2vw, 26px)", lineHeight: 1.1, marginTop: 4, maxWidth: 620 }}>
                Coleccionar arte para la clase trabajadora <em style={{ fontWeight: 300 }}>es coleccionar tatuajes.</em>
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right", fontSize: 12, fontFamily: "var(--mono)" }}>
            <div>Apertura · 09 May 26</div>
            <div style={{ opacity: 0.85 }}>Cierre · 09 Jul 26</div>
          </div>
        </div>
      </div>

      {/* Curatorial text */}
      <div className="container" style={{ marginTop: 80 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 32 }}>
          <div style={{ gridColumn: "span 12" }} className="gl-img">
            <div style={{ border: `1px solid ${bordo}`, overflow: "hidden" }}>
              <GalleryCarousel images={EVENT_PHOTOS} interval={3000} />
            </div>
          </div>
          <div style={{ gridColumn: "span 12" }} className="gl-text">
            <div className="meta" style={{ marginBottom: 14, color: bordo }}>[ Texto curatorial · re-colección ]</div>
            <p className="display" style={{ fontSize: "clamp(22px, 2.4vw, 32px)", lineHeight: 1.3, margin: "0 0 20px", maxWidth: 560 }}>
              Vol. 48 invita a la relectura del espacio del tatuaje como un <em style={{ color: bordo }}>taller de constante creación de arte</em>.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(0,0,0,0.78)", maxWidth: 560, margin: "0 0 14px" }}>
              En un contexto donde la lógica de apropiación material se intensifica, el cuerpo aparece como el último territorio de pertenencia. El tatuaje se vuelve una forma contemporánea de coleccionar arte.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(0,0,0,0.78)", maxWidth: 560, margin: "0 0 14px" }}>
              Desde un lugar underground, proponemos reactivar la circulación del objeto artístico en convivencia con la producción de arte contemporáneo. <em style={{ color: bordo }}>¿Coleccionar arte puede dejar de ser un privilegio de clase?</em>
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(0,0,0,0.78)", maxWidth: 560, margin: 0 }}>
              <strong>Re-colección</strong> es la relectura del coleccionismo como arte-objeto y arte-piel. Sin un emisor y un receptor no hay diálogo. Por eso, los invitamos a convivir.
            </p>
            <div style={{ display: "flex", gap: 28, marginTop: 32, paddingTop: 24, borderTop: `1px solid ${bordo}40` }}>
              <div>
                <div className="meta">Apertura</div>
                <div className="display" style={{ fontSize: 22, marginTop: 4 }}>09 May 26</div>
              </div>
              <div>
                <div className="meta">Cierre</div>
                <div className="display" style={{ fontSize: 22, marginTop: 4, color: bordo }}>09 Jul 26</div>
              </div>
            </div>
          </div>
        </div>
        <style>{`
          @media (min-width: 900px) {
            .gl-img { grid-column: 1 / span 7 !important; }
            .gl-text { grid-column: 8 / span 5 !important; }
          }
        `}</style>
      </div>

      {/* Open Call */}
      <div className="container" style={{ marginTop: 80 }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 32,
          padding: "60px 48px", border: `2px solid ${bordo}`,
          background: "#0c0c0c", color: "#fff",
        }}>
          <div style={{ gridColumn: "span 12" }} className="ga-side">
            <div className="meta" style={{ marginBottom: 16, color: `${bordo}cc`, letterSpacing: "0.12em" }}>[ Open call · Vol. 49 ]</div>
            <h3 className="display" style={{ fontSize: "clamp(32px, 4.5vw, 58px)", margin: "0 0 12px", lineHeight: 1, color: "#fff" }}>
              Ya tenemos fecha para <em style={{ color: "#e87070" }}>el próximo volumen.</em>
            </h3>
          </div>
          <div style={{ gridColumn: "span 12" }} className="ga-side">
            <p style={{ fontSize: 16, lineHeight: 1.65, color: "rgba(255,255,255,0.75)", margin: "0 0 10px", maxWidth: 500 }}>
              Estamos buscando artistas para formar parte de la próxima exposición de Centro.
              Si hacés obra — pintura, ilustración, fotografía, objeto, técnica mixta — y te gustaría mostrarla en el espacio, este es tu momento.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.55, color: "rgba(255,255,255,0.5)", margin: "0 0 28px", maxWidth: 500 }}>
              Completá el formulario con tu propuesta. Las respuestas están abiertas hasta cubrir el cupo.
            </p>
            <a
              href="https://docs.google.com/forms/d/1LKYjOX2kKbuXIE7LM7i4GhrisQz65tlJVyEp_4xIchs/edit"
              target="_blank" rel="noopener"
              className="btn"
              style={{ background: "#fff", color: "#000", borderColor: "#fff", textDecoration: "none", display: "inline-flex" }}
            >
              Aplicar al Vol. 49 →
            </a>
          </div>
        </div>
        <style>{`
          @media (min-width: 900px) { .ga-side { grid-column: span 6 !important; } }
        `}</style>
      </div>

      {/* Selección de obras */}
      <div className="container" style={{ marginTop: 80 }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
          paddingBottom: 24, borderBottom: `2px solid ${bordo}`, flexWrap: "wrap", gap: 12,
        }}>
          <h2 className="display" style={{ fontSize: "clamp(36px, 5vw, 72px)", margin: 0 }}>
            Selección de <em style={{ color: bordo }}>obras</em>
          </h2>
          <span className="mono" style={{ color: bordo }}>{VOL48_OBRAS.length} obras en circulación</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 32, marginTop: 40 }}>
          {VOL48_OBRAS.map((w, i) => (
            <article key={i} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{
                position: "relative",
                background: "#0c0c0c",
                aspectRatio: "3/4",
                overflow: "hidden",
                border: `1px solid ${bordo}30`,
              }}>
                <img src={w.img} alt={w.title}
                  style={{
                    width: "100%", height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transform: w.rotation
                      ? `rotate(${w.rotation}deg)${Math.abs(w.rotation) % 180 !== 0 ? ' scale(1.5)' : ''}`
                      : 'none',
                  }} />
                <span className="mono" style={{
                  position: "absolute", top: 10, left: 10,
                  background: w.trastienda ? bordo : "#fff",
                  color: w.trastienda ? "#fff" : "#000",
                  border: w.trastienda ? `1px solid ${bordo}` : "1px solid #000",
                  padding: "4px 8px", fontSize: 10, letterSpacing: "0.08em",
                }}>
                  {w.trastienda ? "● TRASTIENDA" : "● DISPONIBLE"}
                </span>
              </div>

              <header>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{w.artist}</div>
                <div className="meta" style={{ marginTop: 2 }}>
                  <em>{w.title}</em>, {w.year}
                </div>
                <div className="mono" style={{ fontSize: 10, color: "var(--muted)", marginTop: 4 }}>{w.ig}</div>
              </header>

              <dl style={{
                margin: 0, display: "grid", gridTemplateColumns: "70px 1fr",
                rowGap: 4, columnGap: 12, fontSize: 12, color: "rgba(0,0,0,0.7)",
                paddingTop: 10, borderTop: "1px solid var(--hair)",
              }}>
                <dt className="meta">Técnica</dt><dd style={{ margin: 0 }}>{w.tech}</dd>
                <dt className="meta">Medidas</dt><dd style={{ margin: 0 }} className="mono">{w.dims}</dd>
              </dl>

              <a href={buyMailto(w)} className="btn" style={{
                textDecoration: "none", fontSize: 12, padding: "10px 14px",
                borderColor: bordo, color: bordo,
                alignSelf: "flex-start",
              }}>
                Consultar / Comprar →
              </a>
            </article>
          ))}
        </div>
      </div>


    </div>
  );
}

Object.assign(window, { GalleryPage });
