// Workshops page

function WorkshopsPage() {
  const slots = [
    { day: "Miércoles", time: "Mañana" },
    { day: "Miércoles", time: "Tarde" },
    { day: "Viernes",   time: "Mañana" },
    { day: "Viernes",   time: "Tarde" },
  ];

  return (
    <div className="page-fade" style={{ paddingTop: 64, paddingBottom: 80 }}>
      <SectionHeader index="04" kicker="Talleres" title={<>Programa<Asterisk size={48} /></>}
        intro="Talleres abiertos al público dentro del Centro. Programación rotativa con foco en arte, dibujo y procesos." />

      <div className="container" style={{ marginTop: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12, paddingBottom: 20, borderBottom: "1px solid var(--hair)" }}>
          <h2 className="display" style={{ fontSize: "clamp(28px, 3.4vw, 44px)", margin: 0 }}>En curso</h2>
          <span className="meta">01 TALLER ACTIVO · Inscripciones abiertas</span>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 40,
          marginTop: 40, paddingBottom: 60, borderBottom: "1px solid var(--hair)"
        }}>
          {/* Smaller image — flyer */}
          <div style={{ gridColumn: "span 12" }} className="ws-img">
            <div style={{ aspectRatio: "4 / 5", overflow: "hidden", background: "#0c0c0c", border: "1px solid #000" }}>
              <img src="assets/taller-coti.jpg" alt="Taller de pintura — Costanza Rossi"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          </div>

          {/* Info */}
          <div style={{ gridColumn: "span 12" }} className="ws-info">
            <div className="meta" style={{ marginBottom: 14 }}>[ 01 — Pintura ]</div>
            <h3 className="display" style={{ fontSize: "clamp(44px, 6vw, 88px)", lineHeight: 0.95, letterSpacing: "-0.02em", margin: "0 0 8px" }}>
              Taller de <em>pintura</em>
            </h3>
            <div className="display" style={{ fontSize: "clamp(20px, 2vw, 26px)", color: "var(--muted)", margin: "0 0 28px" }}>
              con Costanza Rossi
            </div>

            <p style={{ fontSize: 16, lineHeight: 1.6, color: "rgba(0,0,0,0.75)", margin: "0 0 32px", maxWidth: 480 }}>
              Espacio de práctica continua, abierto a todos los niveles. Trabajo sobre tela y papel, con foco en gesto, materia y desarrollo de proyecto personal.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", border: "1px solid var(--hair)" }}>
              {slots.map((s, i) => (
                <div key={i} style={{
                  padding: "20px 18px",
                  borderRight: i % 2 === 0 ? "1px solid var(--hair)" : "none",
                  borderBottom: i < 2 ? "1px solid var(--hair)" : "none",
                }}>
                  <div className="mono" style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>TURNO {String(i+1).padStart(2,"0")}</div>
                  <div className="display" style={{ fontSize: 22, lineHeight: 1.1 }}>{s.day}</div>
                  <div style={{ fontSize: 15, marginTop: 4 }}>{s.time}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24, marginTop: 32, paddingTop: 28, borderTop: "1px solid var(--hair)" }}>
              <div>
                <div className="meta" style={{ marginBottom: 4 }}>Frecuencia</div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>1 vez por semana</div>
              </div>
              <div>
                <div className="meta" style={{ marginBottom: 4 }}>Estado</div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Inscripciones abiertas</div>
              </div>
            </div>

            <a href={"mailto:Rossi5costanza@gmail.com?subject=" + encodeURIComponent("Inscripción — Taller de pintura") + "&body=" + encodeURIComponent("Hola Costanza,\n\nQuiero inscribirme al taller de pintura.\n\nTurno preferido:\n[ ] Miércoles mañana\n[ ] Miércoles tarde\n[ ] Viernes mañana\n[ ] Viernes tarde\n\nNombre:\nTeléfono:\nExperiencia previa (opcional):\n\nGracias.")}
              className="btn btn-dark" style={{ marginTop: 32, display: "inline-flex", textDecoration: "none" }}>
              Inscribirme →
            </a>
            <div className="meta" style={{ marginTop: 12 }}>
              o enviános un mp a <a href="https://www.instagram.com/centro__studio/" target="_blank" rel="noopener" style={{ color: "inherit", textDecoration: "underline" }}>@centro__studio</a>
            </div>
          </div>
        </div>

        <style>{`
          @media (min-width: 900px) {
            .ws-img  { grid-column: 1 / span 4 !important; }
            .ws-info { grid-column: 6 / span 7 !important; }
          }
        `}</style>
      </div>

      <div className="container" style={{ marginTop: 80 }}>
        <div style={{
          padding: "32px 28px", border: "1px dashed var(--hair)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 16
        }}>
          <div>
            <div className="meta" style={{ marginBottom: 6 }}>[ Próximamente ]</div>
            <div className="display" style={{ fontSize: 22 }}>Más talleres en preparación</div>
          </div>
          <span className="mono" style={{ color: "var(--muted)" }}>// programa otoño 26</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { WorkshopsPage });
