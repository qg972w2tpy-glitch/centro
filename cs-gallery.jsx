// Gallery page — Vol. 48 Entre oro, hielo y hueso — bordo accents, editorial trash

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
      }}>— Apertura Vol. 48 · 09 julio</div>
    </div>
  );
}

const VOL48_OBRAS = [
  { img: "/assets/obras48/melon-manga.jpg",            artist: "Melón Manga",                    ig: "@melon_manga",                        title: "Ventana Interfaz",                        year: 2026, tech: "Instalación — ventana recuperada, 6 monitores CRT de 9\", video monocanal en loop", dims: "—" },
  { img: "/assets/obras48/morena-spagnolo.jpg",        artist: "Morena Spagnolo",                ig: "@______collector",                    title: "S/T",                                     year: 2026, tech: "Acrílico sobre papel",                dims: "120 × 86 cm" },
  { img: "/assets/obras48/rubi-kees.jpg",              artist: "Rubi Kees / Morena Spagnolo",    ig: "@rubi_____________ / @______collector", title: "S/T",                                   year: 2026, tech: "Tropical tricot, pelo artificial, lienzo", dims: "250 × 116 cm" },
  { img: "/assets/obras48/juana-frontera.jpg",         artist: "Juana Frontera",                 ig: "@juanafrontera_",                     title: "Después del bosque",                      year: 2026, tech: "Ensamblaje escultórico",              dims: "160 × 110 cm" },
  { img: "/assets/obras48/pilar-frelliaro.jpg",        artist: "Pilar Frelliaro",                ig: "@pilarfrelliaro",                     title: "el valor de lo sutil",                    year: 2025, tech: "Acrílico sobre lienzo",               dims: "59 × 90 cm" },
  { img: "/assets/obras48/agustin-sirai.jpg",          artist: "Agustín Sirai",                  ig: "@agustinsirai",                       title: "Pieza",                                   year: 2025, tech: "Acrílico sobre papel",                dims: "35 × 42 cm" },
  { img: "/assets/obras48/maruts-ballet.jpg",          artist: "Vladimir Maruts Ballet",         ig: "@maruts_ballet",                      title: "gypsy tunning",                           year: 2025, tech: "Tapizado de colectivo",               dims: "80 × 150 cm" },
  { img: "/assets/obras48/camila-lezcano.jpg",         artist: "Camila Lezcano",                 ig: "@cami.lezca",                         title: "Polvo de estrellas",                      year: 2025, tech: "Acrílico sobre bastidor con marco de cartón", dims: "50 × 60 × 7 cm" },
  { img: "/assets/obras48/guade-estienne.jpg",         artist: "Guadalupe Estienne",             ig: "@guadeeeh",                           title: "Que gane el quiero, la guerra del puedo", year: 2026, tech: "Óleo sobre lienzo",                   dims: "50 × 65 cm" },
  { img: "/assets/obras48/sofia-igenes.jpg",           artist: "Sofía Igenes",                   ig: "@sofiaigenes",                        title: "la promesa del orden",                    year: 2026, tech: "Óleo sobre tela",                     dims: "40 × 20 cm" },
  { img: "/assets/obras48/gustavo-poester.jpg",        artist: "Gustavo Poester",                ig: "@gupoester",                          title: "Catedral",                                year: 2026, tech: "Óleo sobre tela",                     dims: "90 × 120 cm" },
  { img: "/assets/obras48/bruna-izquierdo.jpg",        artist: "Bruna Izquierdo",                ig: "@anurb.izquierdo",                    title: "Objetos de Contacto Alternativo",         year: 2024, tech: "Cerámica",                            dims: "Medidas variables" },
  { img: "/assets/obras48/cassas-oreilly.jpg",         artist: "Ignacio Cassas y Sofía OReilly", ig: "@ignaciocassas / @sofiaoreilly",      title: "Ojalá poder escribir sobre un lago",      year: 2026, tech: "Acrílico sobre lienzo",               dims: "200 × 160 cm" },
  { img: "/assets/obras48/abril-galmes-cultura.jpg",   artist: "Abril Galmes",                   ig: "@abrilgalmes",                        title: "Cultura de lo Nacional",                  year: 2026, tech: "Óleo sobre lienzo",                   dims: "50 × 70 cm" },
  { img: "/assets/obras48/abril-galmes-sin-titulo.jpg", artist: "Abril Galmes",                  ig: "@abrilgalmes",                        title: "Sin título",                              year: 2026, tech: "Óleo sobre lienzo",                   dims: "100 × 150 cm" },
  { img: "/assets/obras48/maria-cuneo.jpg",            artist: "Maria Cuneo",                    ig: "@err0rdetype0",                       title: "El Triunfo de mi muerte",                 year: 2024, tech: "Acrílico sobre lienzo",               dims: "32 × 27 cm" },
  { img: "/assets/obras48/guido-orlando.jpg",          artist: "Guido Orlando",                  ig: "@elfalsificadorr",                    title: "La helada cautiva",                       year: 2026, tech: "Témpera y acuarela sobre papel",      dims: "35 × 50 cm" },
  { img: "/assets/obras48/abril-amorosa.jpg",          artist: "Abril Barboza",                  ig: "@abrilamorosa",                       title: "Para todas aquellas personas que aun amo", year: 2025, tech: "Óleo sobre lienzo",                  dims: "100 × 100 cm" },
  { img: "/assets/obras48/eva-moro-tesoro.jpg",        artist: "Eva Moro Cafiero",               ig: "@evamcaf",                            title: "Tesoro",                                  year: 2025, tech: "Prospección paleontológica sobre impresión 3D, displays recuperados, cemento y videoarte", dims: "25 × 25 × 12 cm" },
  { img: "/assets/obras48/eva-moro-nido.jpg",          artist: "Eva Moro Cafiero",               ig: "@evamcaf",                            title: "Nido de un latido",                       year: 2025, tech: "Prospección paleontológica sobre impresión 3D, displays recuperados, cemento y videoarte", dims: "25 × 12 × 8 cm" },
  { img: "/assets/obras48/kevin-colors.jpg",           artist: "Kevin Colors",                   ig: "@kevin.colors",                       title: "Hell is lovely",                          year: 2026, tech: "Instalación · Técnica mixta",         dims: "170 × 40 × 70 cm" },
  { img: "/assets/obras48/sofia-alfageme.jpg",         artist: "Sofía Alfageme",                 ig: "@alfagememe",                         title: "Gran Hotel Bell Ville",                   year: 2026, tech: "Sublimación de fotografía analógica en tela", dims: "32 × 19 cm" },
  { img: "/assets/obras48/roja-rex-apendices.jpg",     artist: "Roja Rex",                       ig: "@roja_rex",                           title: "Apéndices",                               year: 2025, tech: "Bordado a mano sobre tela de arpillera", dims: "50 × 50 cm" },
  { img: "/assets/obras48/roja-rex-hawaii.jpg",        artist: "Roja Rex",                       ig: "@roja_rex",                           title: "Hawaii",                                  year: 2023, tech: "Bordado a mano sobre tela",           dims: "15 × 15 cm" },
  { img: "/assets/obras48/analia-zalazar.jpg",         artist: "Analía Zalazar",                 ig: "@ana.lia.zalazar",                    title: "Arqueología de recuerdos",                year: 2026, tech: "Papel de seda sobre soportes de hierro", dims: "Medidas variables" },
  { img: "/assets/obras48/camila-poteto.jpg",          artist: "Camila Poteto",                  ig: "@potetocu",                           title: "caza correosa corintia",                  year: 2026, tech: "Óleo sobre tabla",                    dims: "35 × 50 cm" },
  { img: "/assets/obras48/paula-memi.jpg",             artist: "Paula Memi",                     ig: "@visionmagica2",                      title: "S/T",                                     year: 2026, tech: "Óleo sobre fibrofácil",               dims: "30 × 42 cm" },
  { img: "/assets/obras48/matias-la-plata.jpg",        artist: "Matías La Plata",                ig: "@matiaslaplata_",                     title: "La consagración del guaymallen",          year: 2024, tech: "Acrílico sobre lienzo",               dims: "180 × 120 cm" },
  { img: "/assets/obras48/situacion.jpg",              artist: "Situación",                      ig: "@situaciooooooon",                    title: "Juego",                                   year: 2026, tech: "Óleo sobre tela",                     dims: "150 × 100 cm" },
];

function buyMailto(w) {
  const subject = `Consulta — ${w.title} (${w.artist})`;
  const body =
    `Hola Centro,\n\nMe interesa la siguiente obra de la galería Vol. 48 (Entre oro, hielo y hueso):\n\n` +
    `· Artista:   ${w.artist} (${w.ig})\n` +
    `· Obra:      ${w.title} (${w.year})\n` +
    `· Técnica:   ${w.tech}\n` +
    `· Medidas:   ${w.dims}\n` +
    `\nQuisiera saber:\n[ ] precio y disponibilidad\n[ ] medios de pago\n[ ] envío o retiro en el espacio\n[ ] coordinar visita\n\n` +
    `Mis datos:\nNombre:\nTeléfono:\nCiudad:\n\nGracias.`;
  return "mailto:vol48galeria@gmail.com" +
    "?subject=" + encodeURIComponent(subject) +
    "&body=" + encodeURIComponent(body);
}

const EVENT_PHOTOS = [
  "/assets/evento48/evento-01.jpg",
  "/assets/evento48/evento-02.jpg",
  "/assets/evento48/evento-03.jpg",
  "/assets/evento48/evento-04.jpg",
  "/assets/evento48/evento-05.jpg",
  "/assets/evento48/evento-06.jpg",
  "/assets/evento48/evento-07.jpg",
  "/assets/evento48/evento-08.jpg",
];

const VISIT_MAILTO = "mailto:vol48galeria@gmail.com" +
  "?subject=" + encodeURIComponent("Visita a la galería — Vol. 48 Entre oro, hielo y hueso") +
  "&body=" + encodeURIComponent(
    "Hola Centro!\n\nQuiero visitar la galería Vol. 48 — Entre oro, hielo y hueso.\n\n" +
    "Días y horarios en los que puedo:\n\nCantidad de personas:\n\nNombre:\n\nGracias!"
  );

/* ============== CATÁLOGO — flipbook ============== */
const CATALOG_PAGES = Array.from({ length: 54 }, (_, i) =>
  `/assets/catalogo48/page-${String(i + 1).padStart(2, "0")}.jpg`);

function CatalogViewer({ onClose }) {
  const bookRef = React.useRef(null);
  const flipRef = React.useRef(null);
  const scrollRef = React.useRef(null);
  const wrapRef = React.useRef(null);
  const zoomLabelRef = React.useRef(null);
  const zoomRef = React.useRef(1);
  const pendingScrollRef = React.useRef(null);
  const [ready, setReady] = React.useState(false);
  const [pageNum, setPageNum] = React.useState(0);
  const [zoom, setZoom] = React.useState(1);

  const clampZoom = (z) => Math.min(3, Math.max(1, z));

  // Commit de zoom manteniendo fijo el punto focal (focalX/Y relativos al viewport del scroller)
  const commitZoom = (newZ, focalX, focalY) => {
    const sc = scrollRef.current;
    if (!sc) return;
    const z0 = zoomRef.current;
    const z1 = clampZoom(newZ);
    if (z1 === z0) return;
    const fx = focalX != null ? focalX : sc.clientWidth / 2;
    const fy = focalY != null ? focalY : sc.clientHeight / 2;
    pendingScrollRef.current = {
      left: (sc.scrollLeft + fx) * (z1 / z0) - fx,
      top: (sc.scrollTop + fy) * (z1 / z0) - fy,
    };
    zoomRef.current = z1;
    setZoom(z1);
  };

  // Tras el re-layout: PageFlip (size: stretch) se recalcula con el resize
  // de window, y recién después reposicionamos el scroll al punto focal.
  React.useEffect(() => {
    window.dispatchEvent(new Event("resize"));
    const pending = pendingScrollRef.current;
    if (!pending) return;
    pendingScrollRef.current = null;
    requestAnimationFrame(() => {
      const sc = scrollRef.current;
      if (!sc) return;
      sc.scrollLeft = pending.left;
      sc.scrollTop = pending.top;
    });
  }, [zoom]);

  // Pinch: preview con transform (fluido, sin re-layout) y commit al soltar.
  React.useEffect(() => {
    const sc = scrollRef.current;
    if (!sc) return;
    let pinch = null;

    const dist = (e) => Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    const midpoint = (e) => {
      const rect = sc.getBoundingClientRect();
      return {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top,
      };
    };

    const onStart = (e) => {
      if (e.touches.length !== 2) return;
      const m = midpoint(e);
      pinch = { d0: dist(e), z0: zoomRef.current, fx: m.x, fy: m.y, s: 1 };
      const wrap = wrapRef.current;
      if (wrap) {
        wrap.style.transformOrigin = `${sc.scrollLeft + m.x}px ${sc.scrollTop + m.y}px`;
        wrap.style.willChange = "transform";
      }
      if (bookRef.current) bookRef.current.style.pointerEvents = "none";
    };
    const onMove = (e) => {
      if (!pinch || e.touches.length !== 2) return;
      e.preventDefault();
      const raw = pinch.z0 * (dist(e) / pinch.d0);
      pinch.s = clampZoom(raw) / pinch.z0;
      const wrap = wrapRef.current;
      if (wrap) wrap.style.transform = `scale(${pinch.s})`;
      if (zoomLabelRef.current) {
        zoomLabelRef.current.textContent = `${Math.round(pinch.z0 * pinch.s * 100)}%`;
      }
    };
    const onEnd = (e) => {
      if (!pinch || e.touches.length >= 2) return;
      const { z0, s, fx, fy } = pinch;
      pinch = null;
      const wrap = wrapRef.current;
      if (wrap) {
        wrap.style.transform = "";
        wrap.style.willChange = "";
      }
      if (bookRef.current) bookRef.current.style.pointerEvents = "";
      commitZoom(z0 * s, fx, fy);
    };
    // captura: PageFlip no debe ver el segundo dedo
    const swallow = (e) => {
      if (e.touches.length >= 2) e.stopPropagation();
    };

    sc.addEventListener("touchstart", swallow, { capture: true, passive: true });
    sc.addEventListener("touchstart", onStart, { passive: true });
    sc.addEventListener("touchmove", onMove, { passive: false });
    sc.addEventListener("touchend", onEnd);
    sc.addEventListener("touchcancel", onEnd);
    return () => {
      sc.removeEventListener("touchstart", swallow, { capture: true });
      sc.removeEventListener("touchstart", onStart);
      sc.removeEventListener("touchmove", onMove);
      sc.removeEventListener("touchend", onEnd);
      sc.removeEventListener("touchcancel", onEnd);
    };
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    const init = () => {
      if (cancelled || flipRef.current || !bookRef.current || !window.St) return;
      const pf = new St.PageFlip(bookRef.current, {
        width: 504, height: 714,
        size: "stretch",
        minWidth: 130, maxWidth: 1100,
        minHeight: 184, maxHeight: 1558,
        usePortrait: false,
        showCover: true,
        maxShadowOpacity: 0.35,
        flippingTime: 700,
        mobileScrollSupport: true,
      });
      pf.loadFromImages(CATALOG_PAGES);
      pf.on("flip", (e) => setPageNum(e.data));
      flipRef.current = pf;
      setReady(true);
    };
    if (window.St && window.St.PageFlip) {
      init();
    } else {
      let s = document.getElementById("pageflip-lib");
      if (!s) {
        s = document.createElement("script");
        s.id = "pageflip-lib";
        s.src = "https://unpkg.com/page-flip@2.0.7/dist/js/page-flip.browser.js";
        document.head.appendChild(s);
      }
      s.addEventListener("load", init);
    }
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && flipRef.current) flipRef.current.flipNext();
      if (e.key === "ArrowLeft" && flipRef.current) flipRef.current.flipPrev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      cancelled = true;
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      if (flipRef.current) { try { flipRef.current.destroy(); } catch (err) {} }
    };
  }, []);

  return ReactDOM.createPortal(
    <div style={{
      position: "fixed", inset: 0, zIndex: 998,
      background: "rgba(8,8,8,0.97)",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 20px", color: "#fff", gap: 12, flexWrap: "wrap",
      }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: "0.1em", color: "rgba(255,255,255,0.8)" }}>
          CATÁLOGO · VOL. 48 — ENTRE ORO, HIELO Y HUESO
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <a href="/assets/catalogo-vol48.pdf" target="_blank" rel="noopener"
            className="mono" style={{ color: "rgba(255,255,255,0.6)", fontSize: 10.5, textDecoration: "underline" }}>
            Descargar PDF
          </a>
          <button onClick={onClose} aria-label="Cerrar"
            style={{ color: "#fff", fontSize: 28, lineHeight: 1 }}>×</button>
        </div>
      </div>

      <div ref={scrollRef} style={{
        flex: 1, overflow: "auto", minHeight: 0,
        display: "flex", padding: "0 12px",
        touchAction: "pan-x pan-y",
        overscrollBehavior: "contain",
      }}>
        <div ref={wrapRef} style={{
          width: `calc(min(94vw, 1140px) * ${zoom})`,
          height: `calc(min(72vh, 800px) * ${zoom})`,
          margin: "auto", flexShrink: 0,
        }}>
          <div ref={bookRef} />
        </div>
      </div>

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 12, padding: "12px 12px 16px", color: "#fff", flexWrap: "wrap",
      }}>
        <button onClick={() => flipRef.current && flipRef.current.flipPrev()}
          className="mono" style={{ color: "#fff", fontSize: 12, padding: "8px 14px", border: "1px solid rgba(255,255,255,0.35)" }}>
          ← Anterior
        </button>
        <span className="mono" style={{ fontSize: 10.5, color: "rgba(255,255,255,0.55)", minWidth: 62, textAlign: "center" }}>
          {ready ? `${pageNum + 1} / ${CATALOG_PAGES.length}` : "Cargando…"}
        </span>
        <button onClick={() => flipRef.current && flipRef.current.flipNext()}
          className="mono" style={{ color: "#fff", fontSize: 12, padding: "8px 14px", border: "1px solid rgba(255,255,255,0.35)" }}>
          Siguiente →
        </button>
        <span style={{ width: 10 }} />
        <button onClick={() => commitZoom(zoomRef.current - 0.5)} aria-label="Alejar"
          className="mono" style={{ color: "#fff", fontSize: 15, padding: "8px 13px", border: "1px solid rgba(255,255,255,0.35)", opacity: zoom <= 1 ? 0.4 : 1 }}>
          −
        </button>
        <span ref={zoomLabelRef} className="mono" style={{ fontSize: 10.5, color: "rgba(255,255,255,0.55)", minWidth: 42, textAlign: "center" }}>
          {Math.round(zoom * 100)}%
        </span>
        <button onClick={() => commitZoom(zoomRef.current + 0.5)} aria-label="Acercar"
          className="mono" style={{ color: "#fff", fontSize: 15, padding: "8px 13px", border: "1px solid rgba(255,255,255,0.35)", opacity: zoom >= 3 ? 0.4 : 1 }}>
          +
        </button>
        {zoom > 1 && (
          <button onClick={() => commitZoom(1)}
            className="mono" style={{ color: "rgba(255,255,255,0.6)", fontSize: 10.5, padding: "8px 10px", textDecoration: "underline" }}>
            Restablecer
          </button>
        )}
      </div>
      <div className="mono" style={{ textAlign: "center", fontSize: 9.5, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", padding: "0 16px 14px" }}>
        ARRASTRÁ LAS ESQUINAS PARA PASAR DE HOJA · PELLIZCÁ PARA HACER ZOOM · CON ZOOM, UN DEDO PANEA Y LOS BOTONES PASAN DE HOJA
      </div>
    </div>,
    document.body
  );
}

function GalleryPage() {
  const bordo = "#8a1a16";
  const dorado = "#b8860b";
  const celeste = "#5e9ec4";
  const crema = "#f0e6d2";
  const [lightbox, setLightbox] = React.useState(null);
  const [catalogOpen, setCatalogOpen] = React.useState(false);

  React.useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  return (
    <div className="page-fade" style={{ paddingTop: 64, paddingBottom: 80 }}>
      <SectionHeader index="05" kicker="Galería · Vol. 48" title={<>Galería<Asterisk size={48} /></>}
        intro="Vol. 48 — Entre oro, hielo y hueso. Una lectura de la argentinidad llevada a textura. Inauguró el 9 de julio. Visitas con cita previa." />

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
            <img src="/assets/vol48-logo.png" alt="Vol. 48"
              style={{ height: 64, filter: "brightness(0) invert(1)" }} />
            <div>
              <div className="mono" style={{ fontSize: 11, letterSpacing: "0.1em" }}>
                <span style={{ opacity: 0.8 }}>VOL. 48 · ENTRE </span>
                <span style={{ color: "#e7c55a" }}>ORO</span>
                <span style={{ opacity: 0.8 }}>, </span>
                <span style={{ color: "#a8d8f0" }}>HIELO</span>
                <span style={{ opacity: 0.8 }}> Y </span>
                <span style={{ color: crema }}>HUESO</span>
              </div>
              <div className="display" style={{ fontSize: "clamp(18px, 2vw, 26px)", lineHeight: 1.1, marginTop: 4, maxWidth: 620 }}>
                Un muestrario para identificar <em style={{ fontWeight: 300 }}>nuestros colores llevados a textura.</em>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
            <div style={{ textAlign: "right", fontSize: 12, fontFamily: "var(--mono)" }}>
              <div>Apertura · 09 Jul 26</div>
              <div style={{ opacity: 0.85 }}>En curso · cita previa</div>
            </div>
            <button onClick={() => setCatalogOpen(true)}
              className="btn"
              style={{ background: "transparent", color: "#fff", borderColor: "#fff", padding: "10px 16px", fontSize: 11.5 }}>
              Ver catálogo →
            </button>
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
            <div className="meta" style={{ marginBottom: 14, color: bordo }}>[ Texto curatorial · entre oro, hielo y hueso ]</div>
            <p className="display" style={{ fontSize: "clamp(22px, 2.4vw, 32px)", lineHeight: 1.3, margin: "0 0 20px", maxWidth: 560 }}>
              Habitamos una identidad construida de <em style={{ color: bordo }}>sensaciones heterogéneas</em>.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(0,0,0,0.78)", maxWidth: 560, margin: "0 0 14px" }}>
              Los símbolos más aclamados en el arte fueron una herencia europea que se inculcó en Argentina y se nos ha enseñado a digerir y avalar. Hoy en día, la iconografía que conforma el imaginario de nuestro país se compone de fragmentos que se recrean desde nuestro propio lenguaje. Por eso conformamos un muestrario para identificar nuestros colores llevados a textura:
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(0,0,0,0.78)", maxWidth: 560, margin: "0 0 14px" }}>
              <strong style={{ color: dorado }}>El oro</strong>, que es brillante por naturaleza, se presenta resignificado a un objeto íntimo. <strong style={{ color: celeste }}>El hielo</strong> actúa como el detenimiento de un cambio potencial: materializa al frío para luego derramarse y cambiar de forma. <strong style={{ background: crema, padding: "1px 6px" }}>El hueso</strong> es la reducción pura del ser humano, el archivo antropológico del hecho de que algo contuvo vida.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(0,0,0,0.78)", maxWidth: 560, margin: 0 }}>
              Proponemos leer la argentinidad en las nuevas formas de comunicar y de expresarse. <em style={{ color: bordo }}>El énfasis está en defender una Nación que buscan que sea disuelta y recordar nuestra soberanía a pesar de las circunstancias.</em>
            </p>
            <div style={{ display: "flex", gap: 28, marginTop: 32, paddingTop: 24, borderTop: `1px solid ${bordo}40` }}>
              <div>
                <div className="meta">Apertura</div>
                <div className="display" style={{ fontSize: 22, marginTop: 4 }}>09 Jul 26</div>
              </div>
              <div>
                <div className="meta">Visitas</div>
                <div className="display" style={{ fontSize: 22, marginTop: 4, color: bordo }}>Cita previa</div>
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

      {/* Visitá la galería */}
      <div className="container" style={{ marginTop: 80 }}>
        <div className="ga-block" style={{
          display: "grid", gridTemplateColumns: "1fr", gap: 28,
          padding: "36px 22px", border: `2px solid ${bordo}`,
          background: "#0c0c0c", color: "#fff",
        }}>
          <div className="ga-side">
            <div className="meta" style={{ marginBottom: 16, color: `${bordo}cc`, letterSpacing: "0.12em" }}>[ Visitas · Vol. 48 ]</div>
            <h3 className="display" style={{ fontSize: "clamp(32px, 4.5vw, 58px)", margin: "0 0 12px", lineHeight: 1, color: "#fff" }}>
              La muestra está abierta <em style={{ color: "#e87070" }}>y te esperamos.</em>
            </h3>
          </div>
          <div className="ga-side">
            <p style={{ fontSize: 16, lineHeight: 1.65, color: "rgba(255,255,255,0.75)", margin: "0 0 10px", maxWidth: 500 }}>
              Podés recorrer Vol. 48 — Entre <span style={{ color: "#e7c55a" }}>oro</span>, <span style={{ color: "#a8d8f0" }}>hielo</span> y <span style={{ color: crema }}>hueso</span> en el espacio de Centro Studio.
              Las visitas se coordinan <strong style={{ color: "#fff" }}>con cita previa</strong>, escribinos y armamos el encuentro.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.55, color: "rgba(255,255,255,0.5)", margin: "0 0 28px", maxWidth: 500 }}>
              La entrada es libre. También podés consultar por obras disponibles durante tu visita.
            </p>
            <a
              href={VISIT_MAILTO}
              className="btn"
              style={{ background: "#fff", color: "#000", borderColor: "#fff", textDecoration: "none", display: "inline-flex" }}
            >
              Quiero visitar la galería →
            </a>
          </div>
        </div>
        <style>{`
          @media (min-width: 900px) {
            .ga-block { grid-template-columns: repeat(12, 1fr) !important; padding: 60px 48px !important; gap: 32px !important; }
            .ga-side { grid-column: span 6 !important; }
          }
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

        <div className="obra-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 32, marginTop: 40 }}>
          {VOL48_OBRAS.map((w, i) => (
            <article key={i} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div
                onClick={() => setLightbox(w)}
                title="Ver en alta calidad"
                style={{
                  position: "relative",
                  background: "#0c0c0c",
                  aspectRatio: "3/4",
                  overflow: "hidden",
                  border: `1px solid ${bordo}30`,
                  cursor: "zoom-in",
                }}>
                <img src={w.img} alt={w.title} loading="lazy"
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
                  background: w.vendido ? "#222" : "#fff",
                  color: w.vendido ? "#fff" : "#000",
                  border: w.vendido ? "1px solid #222" : "1px solid #000",
                  padding: "4px 8px", fontSize: 10, letterSpacing: "0.08em",
                }}>
                  {w.vendido ? "● VENDIDO" : "● DISPONIBLE"}
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

              {w.vendido ? (
                <span className="btn mono" style={{
                  fontSize: 12, padding: "10px 14px",
                  borderColor: "#999", color: "#999",
                  alignSelf: "flex-start", cursor: "default", opacity: 0.6,
                }}>
                  Vendido
                </span>
              ) : (
                <a href={buyMailto(w)} className="btn" style={{
                  textDecoration: "none", fontSize: 12, padding: "10px 14px",
                  borderColor: bordo, color: bordo,
                  alignSelf: "flex-start",
                }}>
                  Consultar / Comprar →
                </a>
              )}
            </article>
          ))}
        </div>
        <style>{`
          @media (max-width: 767px) {
            .obra-grid { grid-template-columns: 1fr 1fr !important; gap: 14px !important; }
            .obra-grid article header div:first-child { font-size: 13px !important; }
            .obra-grid dl { font-size: 10.5px !important; grid-template-columns: 52px 1fr !important; column-gap: 8px !important; }
            .obra-grid .btn { font-size: 10px !important; padding: 8px 10px !important; }
          }
        `}</style>
      </div>

      {/* Lightbox — obra en alta calidad (portal: el transform de .page-fade rompe position:fixed) */}
      {lightbox && ReactDOM.createPortal(
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 999,
            background: "rgba(0,0,0,0.94)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "24px 16px", cursor: "zoom-out",
          }}>
          <img
            src={lightbox.img.replace("/obras48/", "/obras48-full/")}
            alt={lightbox.title}
            style={{
              maxWidth: "94vw", maxHeight: "82vh",
              objectFit: "contain", display: "block",
              boxShadow: "0 20px 80px rgba(0,0,0,0.6)",
            }} />
          <div style={{ marginTop: 18, textAlign: "center", color: "#fff", maxWidth: 600 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{lightbox.artist}</div>
            <div className="meta" style={{ color: "rgba(255,255,255,0.65)", marginTop: 4 }}>
              <em>{lightbox.title}</em>, {lightbox.year} — {lightbox.dims}
            </div>
          </div>
          <button
            onClick={() => setLightbox(null)}
            aria-label="Cerrar"
            style={{
              position: "fixed", top: 18, right: 22,
              color: "#fff", fontSize: 30, lineHeight: 1,
              fontFamily: "var(--sans)",
            }}>
            ×
          </button>
        </div>,
        document.body
      )}

      {/* Catálogo flipbook */}
      {catalogOpen && <CatalogViewer onClose={() => setCatalogOpen(false)} />}

    </div>
  );
}

Object.assign(window, { GalleryPage });
