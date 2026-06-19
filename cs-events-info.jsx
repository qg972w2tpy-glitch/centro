// Events + Info pages

const UPCOMING_EVENTS = [
  { k: "Galería Vol. 49 · Segunda edición", date: "Por confirmar", time: "19 a 00hs", desc: "Segunda edición del ciclo. Galería, showroom y comunidad en simultáneo.", cat: "Galería" },
  { k: "Segunda presentación · Galería Vol. 48", date: "09 Julio 2026", time: "20h", desc: "Cierre de Re-colección con nueva lectura de obra y comunidad.", cat: "Galería" },
];

const PAST_EVENTS = [
  { k: "Mercado Central Vol. 1", date: "13 Junio 2026", time: "—", desc: "Primera edición del mercado de marcas, arte y comunidad en Centro Studio.", cat: "Mercado", video: "/assets/event/videoevento.mp4" },
  { k: "Inauguración Galería Vol. 48", date: "09 Mayo 2026", time: "20h", desc: "Apertura de Re-colección. Cuatro semanas de obra y comunidad.", cat: "Galería" },
  { k: "Inauguración Centro Studio", date: "21 Febrero 2026", time: "—", desc: "Apertura del nuevo espacio en Av. Córdoba 857 · Retiro.", cat: "Apertura" },
];

function EventsPage() {
  return (
    <div className="page-fade" style={{ paddingTop: 64, paddingBottom: 80 }}>
      <SectionHeader index="06" kicker="Events" title={<>Calendario<Asterisk size={48} /></>}
        intro="Aperturas y presentaciones del año. Programación rotativa." />

      {/* Próximo destacado */}
      <div className="container" style={{ marginTop: 40 }}>
        <div className="meta" style={{ marginBottom: 24 }}>[ Próximo ]</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 32 }}>
          <div style={{ gridColumn: "span 12" }} className="ev-img">
            <div style={{ aspectRatio: "3/2", overflow: "hidden", background: "#0a0a0a", border: "1px solid #000" }}>
              <img src="/assets/event/event-03.jpg" alt={UPCOMING_EVENTS[0].k} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          </div>
          <div style={{ gridColumn: "span 12" }} className="ev-text">
            <div className="meta" style={{ marginBottom: 14 }}>[ Próximo · 01 ]</div>
            <h2 className="display" style={{ fontSize: "clamp(36px, 5vw, 64px)", margin: 0, lineHeight: 1.05 }}>
              {UPCOMING_EVENTS[0].k}
            </h2>
            <div className="display" style={{ fontSize: 28, marginTop: 16, fontStyle: "italic" }}>
              {UPCOMING_EVENTS[0].date} · {UPCOMING_EVENTS[0].time}
            </div>
            <p style={{ fontSize: 16, lineHeight: 1.55, color: "rgba(0,0,0,0.7)", marginTop: 24, maxWidth: 460 }}>
              {UPCOMING_EVENTS[0].desc}
            </p>
          </div>
        </div>
        <style>{`
          @media (min-width: 900px) {
            .ev-img { grid-column: 1 / span 7 !important; }
            .ev-text { grid-column: 8 / span 5 !important; padding-top: 40px; }
          }
        `}</style>
      </div>

      {/* Resto de próximos */}
      {UPCOMING_EVENTS.slice(1).length > 0 && (
        <div className="container" style={{ marginTop: 60 }}>
          <div className="meta" style={{ marginBottom: 16 }}>[ Agenda ]</div>
          {UPCOMING_EVENTS.slice(1).map((e, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 32, alignItems: "baseline", padding: "32px 0", borderTop: "1px solid var(--hair)" }}>
              <div style={{ minWidth: 160 }}>
                <div className="display" style={{ fontSize: 32, lineHeight: 1 }}>{e.date.split(" ")[0]} {e.date.split(" ")[1]}</div>
                <div className="meta" style={{ marginTop: 6 }}>{e.time}</div>
              </div>
              <div>
                <div className="meta" style={{ marginBottom: 6 }}>{e.cat}</div>
                <div className="display" style={{ fontSize: "clamp(24px, 3vw, 36px)", lineHeight: 1.1 }}>{e.k}</div>
                <p style={{ fontSize: 14, color: "rgba(0,0,0,0.65)", marginTop: 10, maxWidth: 540 }}>{e.desc}</p>
              </div>
              <span className="mono" style={{ color: "var(--muted)", whiteSpace: "nowrap" }}>{e.date.split(" ")[2]}</span>
            </div>
          ))}
        </div>
      )}

      {/* Pasados */}
      <div className="container" style={{ marginTop: 100 }}>
        <div className="meta" style={{ marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--hair)" }}>[ Pasados ]</div>

        {/* Video destacado — Mercado Central Vol. 1 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 32, marginTop: 40 }}>
          <div style={{ gridColumn: "span 12" }} className="ev-past-vid">
            {(() => {
              const [muted, setMuted] = React.useState(true);
              return (
                <div style={{ position: "relative" }}>
                  <video
                    src={PAST_EVENTS[0].video}
                    autoPlay
                    playsInline
                    loop
                    muted={muted}
                    style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block", background: "#0a0a0a", border: "1px solid #000" }}
                  />
                  <button
                    onClick={() => setMuted(m => !m)}
                    style={{
                      position: "absolute", bottom: 14, right: 14,
                      background: "rgba(0,0,0,0.65)", color: "#fff",
                      border: "1px solid rgba(255,255,255,0.3)",
                      padding: "6px 12px", fontSize: 11,
                      fontFamily: "var(--mono)", letterSpacing: "0.08em",
                      cursor: "pointer",
                    }}>
                    {muted ? "🔇 SIN SONIDO" : "🔊 CON SONIDO"}
                  </button>
                </div>
              );
            })()}
          </div>
          <div style={{ gridColumn: "span 12" }} className="ev-past-text">
            <div className="meta" style={{ marginBottom: 14 }}>[ Edición pasada · {PAST_EVENTS[0].date} ]</div>
            <h2 className="display" style={{ fontSize: "clamp(36px, 5vw, 64px)", margin: 0, lineHeight: 1.05 }}>
              {PAST_EVENTS[0].k}
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.55, color: "rgba(0,0,0,0.7)", marginTop: 24, maxWidth: 460 }}>
              {PAST_EVENTS[0].desc}
            </p>
          </div>
        </div>
        <style>{`
          @media (min-width: 900px) {
            .ev-past-vid { grid-column: 1 / span 7 !important; }
            .ev-past-text { grid-column: 8 / span 5 !important; padding-top: 40px; }
          }
        `}</style>

        {/* Resto del archivo */}
        {PAST_EVENTS.slice(1).map((e, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 32, alignItems: "baseline", padding: "32px 0", borderTop: "1px solid var(--hair)", marginTop: i === 0 ? 60 : 0 }}>
            <div style={{ minWidth: 160 }}>
              <div className="display" style={{ fontSize: 32, lineHeight: 1 }}>{e.date.split(" ")[0]} {e.date.split(" ")[1]}</div>
              <div className="meta" style={{ marginTop: 6 }}>{e.time}</div>
            </div>
            <div>
              <div className="meta" style={{ marginBottom: 6 }}>{e.cat}</div>
              <div className="display" style={{ fontSize: "clamp(24px, 3vw, 36px)", lineHeight: 1.1 }}>{e.k}</div>
              <p style={{ fontSize: 14, color: "rgba(0,0,0,0.65)", marginTop: 10, maxWidth: 540 }}>{e.desc}</p>
            </div>
            <span className="mono" style={{ color: "var(--muted)", whiteSpace: "nowrap" }}>{e.date.split(" ")[2]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============== INFO ============== */
function InfoPage({ subroute, setSubroute }) {
  return (
    <div className="page-fade" style={{ paddingTop: 64, paddingBottom: 80 }}>
      <SectionHeader index="07" kicker="Más info" title={<>Información<Asterisk size={48} /></>}
        intro="Sobre el espacio y contacto." />

      <div className="container" style={{ marginTop: 32, display: "flex", gap: 8, flexWrap: "wrap", borderBottom: "1px solid var(--hair)", paddingBottom: 20 }}>
        {[
          { k: "about", l: "A · Sobre Centro" },
          { k: "contact", l: "B · Contacto" },
        ].map(t => (
          <button key={t.k}
            className={"pill" + (subroute === t.k ? " active" : "")}
            onClick={() => setSubroute(t.k)}>
            {t.l}
          </button>
        ))}
      </div>

      {subroute === "about" && <About />}
      {subroute === "contact" && <Contact />}
    </div>
  );
}

function About() {
  return (
    <div className="container" style={{ marginTop: 60 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 32 }}>
        <div style={{ gridColumn: "span 12" }} className="ab-side">
          <div className="meta" style={{ marginBottom: 16 }}>[ A · Sobre Centro ]</div>
          <h2 className="display" style={{ fontSize: "clamp(40px, 6vw, 80px)", margin: 0, lineHeight: 0.98 }}>
            Un espacio<br/>
            <em>que convive</em><br/>
            con la escena.<Asterisk size={28} />
          </h2>
        </div>
        <div style={{ gridColumn: "span 12" }} className="ab-side">
          <div style={{ display: "grid", gap: 24 }}>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: "rgba(0,0,0,0.8)", margin: 0 }}>
              <strong>Centro nace en 2022</strong> como estudio de tatuaje y showroom de indumentaria. Este año redoblamos la apuesta con un espacio casi tres veces más grande.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: "rgba(0,0,0,0.8)", margin: 0 }}>
              Actualmente funciona como <em>estudio de tattoo, tienda de ropa, galería de arte, espacio cultural y taller</em>, colaborando con artistas de varias disciplinas.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 24, marginTop: 16, paddingTop: 24, borderTop: "1px solid var(--hair)" }}>
              {[
                { k: "2022", v: "Año de apertura" },
                { k: "3×",   v: "Tamaño actual del espacio" },
                { k: "05",   v: "Disciplinas" },
              ].map(s => (
                <div key={s.k}>
                  <div className="display" style={{ fontSize: 36, lineHeight: 1 }}>{s.k}</div>
                  <div className="meta" style={{ marginTop: 6 }}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 80 }}>
        <div style={{ aspectRatio: "21/9", overflow: "hidden", background: "#0a0a0a", border: "1px solid #000" }}>
          <img src="/assets/espacio/espacio-01.jpg" alt="Centro Studio" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      </div>
      <style>{`
        @media (min-width: 900px) {
          .ab-side { grid-column: span 6 !important; }
        }
      `}</style>
    </div>
  );
}

function Contact() {
  return (
    <div className="container" style={{ marginTop: 60 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 32 }}>
        <div style={{ gridColumn: "span 12" }} className="ct-side">
          <div className="meta" style={{ marginBottom: 16 }}>[ B · Visitanos ]</div>
          <h2 className="display" style={{ fontSize: "clamp(40px, 6vw, 80px)", margin: "0 0 32px", lineHeight: 1 }}>
            Av. Córdoba<br/><em>857</em>
          </h2>
          <div style={{ display: "grid", gap: 20 }}>
            {[
              { k: "Dirección", v: "Av. Córdoba 857\nRetiro, CABA" },
              { k: "Horarios", v: "Miércoles a sábado\n14:00 — 19:00" },
              { k: "Email",    v: "centrostudio.ar@gmail.com" },
              { k: "WhatsApp", v: "+54 9 280 477 7018" },
              { k: "Instagram", v: "@centro__studio" },
            ].map(r => (
              <div key={r.k} style={{ paddingBottom: 16, borderBottom: "1px solid var(--hair)" }}>
                <div className="meta" style={{ marginBottom: 4 }}>{r.k}</div>
                <div style={{ whiteSpace: "pre-line", fontSize: 16, lineHeight: 1.5 }}>{r.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ gridColumn: "span 12" }} className="ct-side">
          <div style={{ aspectRatio: "3/4", overflow: "hidden", background: "#0a0a0a" }}>
            <img src="/assets/espacio/espacio-02.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        </div>
      </div>
      <style>{`
        @media (min-width: 900px) {
          .ct-side { grid-column: span 6 !important; }
        }
      `}</style>
    </div>
  );
}

function Care() {
  const before = [
    { k: "Comer bien", d: "Desayuno o almuerzo completo antes del turno. No vengas en ayunas." },
    { k: "Hidratarse", d: "Tomar agua durante el día previo y el día del turno." },
    { k: "Hidratar la piel", d: "Crema neutra los días previos. Piel sana = mejor cicatrización." },
    { k: "Sin alcohol", d: "Evitar alcohol al menos 24h antes." },
    { k: "Descansar", d: "Dormir bien la noche anterior." },
    { k: "Ropa cómoda", d: "Que permita acceso fácil a la zona del tatuaje." },
  ];
  const after = [
    { k: "3 días en seco", d: "Dejar secar el tatuaje los primeros 3 días. No tapar después de las primeras horas." },
    { k: "Crema desde el día 3", d: "Aplicar crema hidratante hipoalergénica con vitamina A." },
    { k: "Capas finas", d: "Nunca saturar. Mejor poco y seguido que mucho de una vez." },
    { k: "No rascar", d: "No remover costras ni piel suelta. Caen solas." },
    { k: "Sin sol", d: "Evitar exposición directa hasta cicatrización completa." },
    { k: "Protector solar", d: "Una vez cicatrizado, FPS 50+ siempre que se exponga." },
    { k: "Sin pileta ni mar", d: "Mínimo 14 días. El cloro y la sal arruinan la cicatrización." },
    { k: "Higiene", d: "Lavar con jabón neutro, agua tibia, secar con toalla limpia o de papel." },
  ];

  return (
    <div className="container" style={{ marginTop: 60 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 32, marginBottom: 60 }}>
        <div style={{ gridColumn: "span 12" }} className="ca-side">
          <div className="meta" style={{ marginBottom: 16 }}>[ C · Guía rápida ]</div>
          <h2 className="display" style={{ fontSize: "clamp(40px, 6vw, 80px)", margin: 0, lineHeight: 1 }}>
            Cuidados<br/>del <em>tatuaje</em><Asterisk size={36} />
          </h2>
        </div>
        <div style={{ gridColumn: "span 12" }} className="ca-side">
          <p style={{ fontSize: 17, lineHeight: 1.6, color: "rgba(0,0,0,0.7)", maxWidth: 460, margin: 0 }}>
            Pensada para compartir. Si recién te tatuaste con nosotros, podés mandarle este link a alguien que te acompañe.
          </p>
        </div>
        <style>{`
          @media (min-width: 900px) {
            .ca-side { grid-column: span 6 !important; }
          }
        `}</style>
      </div>

      <CareBlock label="Antes del turno" num="01" items={before} />
      <CareBlock label="Después del turno" num="02" items={after} />

      <div style={{
        marginTop: 80, padding: "40px 32px",
        background: "#000", color: "#fff",
        display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap",
      }}>
        <Asterisk size={20} color="#fff" spin />
        <div>
          <div className="meta" style={{ color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>Si algo no va bien</div>
          <div style={{ fontSize: 17 }}>Si notás enrojecimiento excesivo, dolor, fiebre o pus, escribinos por WhatsApp inmediatamente.</div>
        </div>
        <a href="https://wa.me/5492804777018" target="_blank" rel="noopener" className="btn" style={{ background: "#fff", color: "#000", borderColor: "#fff", marginLeft: "auto" }}>
          +54 9 280 477 7018 →
        </a>
      </div>
    </div>
  );
}

function CareBlock({ label, num, items }) {
  return (
    <div style={{ marginTop: 60 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--hair)" }}>
        <span className="meta">{num}</span>
        <h3 className="display" style={{ fontSize: "clamp(28px, 3.5vw, 40px)", margin: 0 }}>{label}</h3>
        <span className="meta" style={{ marginLeft: "auto" }}>{items.length} pasos</span>
      </div>
      <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 0, border: "1px solid var(--hair)", background: "var(--hair)" }}>
        {items.map((it, i) => (
          <li key={i} style={{ background: "#fff", padding: "28px 24px", display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{
              width: 36, height: 36, flexShrink: 0,
              border: "1px solid #000",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600,
            }}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{it.k}</div>
              <div style={{ fontSize: 14, color: "rgba(0,0,0,0.65)", lineHeight: 1.5 }}>{it.d}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

Object.assign(window, { EventsPage, InfoPage });
