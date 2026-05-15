// Wizard: 9-step tattoo quote
const { useState: useStateW, useRef: useRefW } = React;

function Wizard({ setRoute, preselectedArtist }) {
  const { t, lang } = useI18n();
  const T = lang === "es" ? wzES : wzEN;
  const [step, setStep] = useStateW(0);
  const [data, setData] = useStateW({
    first: null,
    style: null,
    size: null,
    zone: null,
    hasDesign: null,
    refs: [],
    artist: preselectedArtist || null,
    dates: { from: "", to: "" },
    contact: { name: "", email: "", phone: "", notes: "" },
  });
  const [submitted, setSubmitted] = useStateW(false);

  const total = 9;
  const set = (k, v) => setData(d => ({ ...d, [k]: v }));

  const canSubmit = data.contact.name && data.contact.email;
  const filled = (() => {
    switch (step) {
      case 0: return data.first !== null;
      case 1: return data.style !== null;
      case 2: return data.size !== null;
      case 3: return data.zone !== null;
      case 4: return data.hasDesign !== null;
      case 5: return data.refs.length > 0;
      case 6: return data.artist !== null;
      case 7: return data.dates.from !== "";
      case 8: return canSubmit;
      default: return false;
    }
  })();

  const next = () => { if (step < total - 1) setStep(s => s + 1); };
  const prev = () => { if (step > 0) setStep(s => s - 1); };

  // Build mailto on submit
  const submit = () => {
    if (!canSubmit) return;
    const T2 = wzES;
    const subj = `Cotizá un tatuaje — ${data.contact.name}`;
    const body =
      `Hola Centro,\n\n` +
      `Cotizo un tatuaje. Estos son los datos:\n\n` +
      `· Primer tatuaje: ${data.first === null ? "—" : (data.first ? "Sí" : "No")}\n` +
      `· Estilo:         ${data.style || "—"}\n` +
      `· Tamaño:         ${data.size || "—"}\n` +
      `· Zona:           ${data.zone || "—"}\n` +
      `· Diseño:         ${data.hasDesign || "—"}\n` +
      `· Referencias:    ${data.refs.length} archivo(s) (las envío adjuntas en este mismo mail)\n` +
      `· Artista:        ${data.artist || "—"}\n` +
      `· Fechas:         ${data.dates.from || "—"}${data.dates.to ? " → " + data.dates.to : ""}\n\n` +
      `── Contacto ──\n` +
      `Nombre:   ${data.contact.name}\n` +
      `Email:    ${data.contact.email}\n` +
      `Teléfono: ${data.contact.phone || "—"}\n\n` +
      `── Notas ──\n` +
      `${data.contact.notes || "—"}\n\n` +
      `Gracias.`;
    const url = "mailto:centrostudio.ar@gmail.com" +
      "?subject=" + encodeURIComponent(subj) +
      "&body=" + encodeURIComponent(body);
    // open mail client; also mark submitted so UI confirms
    window.location.href = url;
    setSubmitted(true);
  };

  const setAndAdvance = (k, v) => {
    setData(d => ({ ...d, [k]: v }));
    if (step < total - 1) {
      setTimeout(() => setStep(s => s + 1), 280);
    }
  };

  if (submitted) return <WizardDone setRoute={setRoute} T={T} data={data} />;

  return (
    <div className="page-fade" style={{ paddingTop: 64, minHeight: "100vh", background: "#fff" }}>
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 1200 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
          <span className="meta">[ {T.title} ]</span>
          <span className="meta">— Paso {String(step + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        </div>
        <h1 className="display" style={{ fontSize: "clamp(36px, 5vw, 64px)", margin: "12px 0 8px", lineHeight: 1 }}>
          <em>{T.h1a}</em> {T.h1b}
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: `repeat(${total}, 1fr)`, gap: 6, margin: "32px 0 60px" }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{
              height: 3,
              background: i <= step ? "#000" : "var(--hair)",
              transition: "background .3s",
            }} />
          ))}
        </div>

        <div key={step} className="page-fade" style={{ minHeight: 380 }}>
          {step === 0 && <Step01 data={data} set={set} setAndAdvance={setAndAdvance} T={T} />}
          {step === 1 && <Step02 data={data} set={set} setAndAdvance={setAndAdvance} T={T} />}
          {step === 2 && <Step03 data={data} set={set} setAndAdvance={setAndAdvance} T={T} />}
          {step === 3 && <Step04 data={data} set={set} setAndAdvance={setAndAdvance} T={T} />}
          {step === 4 && <Step05 data={data} set={set} setAndAdvance={setAndAdvance} T={T} />}
          {step === 5 && <Step06 data={data} set={set} T={T} />}
          {step === 6 && <Step07 data={data} set={set} setAndAdvance={setAndAdvance} T={T} preselectedArtist={preselectedArtist} />}
          {step === 7 && <Step08 data={data} set={set} T={T} />}
          {step === 8 && <Step09 data={data} set={set} T={T} />}
        </div>

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginTop: 60, paddingTop: 28, borderTop: "1px solid var(--hair)",
          gap: 12, flexWrap: "wrap",
        }}>
          <button onClick={prev} disabled={step === 0} className="btn btn-ghost" style={{ opacity: step === 0 ? 0.3 : 1 }}>
            ← {T.back}
          </button>
          <span className="mono" style={{ color: "var(--muted)" }}>
            <Asterisk size={10} /> {filled ? T.ready : T.optional}
          </span>
          {step < total - 1 ? (
            <button onClick={next} className="btn btn-ghost">
              {filled ? T.next : T.skip} →
            </button>
          ) : (
            <button onClick={submit} disabled={!canSubmit} className="btn btn-dark" style={{ opacity: canSubmit ? 1 : 0.3 }}>
              {T.submit} <Asterisk size={10} color="#fff" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepHeader({ num, q, sub }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div className="meta" style={{ marginBottom: 14 }}>[ Pregunta {num} ]</div>
      <h2 className="display" style={{ fontSize: "clamp(28px, 3.4vw, 44px)", margin: 0, lineHeight: 1.1, maxWidth: 720 }}>
        {q}
      </h2>
      {sub && <p style={{ marginTop: 16, color: "var(--muted)", fontSize: 15, maxWidth: 520 }}>{sub}</p>}
    </div>
  );
}

function ChoiceGrid({ children, cols = 2 }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(auto-fit, minmax(${cols === 2 ? 240 : 140}px, 1fr))`,
      gap: 12,
    }}>
      {children}
    </div>
  );
}

function Step01({ data, setAndAdvance, T }) {
  return (
    <div>
      <StepHeader num="01" q={T.q1} />
      <ChoiceGrid>
        {[{ v: true, l: T.yes, sub: T.firstYes }, { v: false, l: T.no, sub: T.firstNo }].map(o => (
          <button key={String(o.v)}
            className={"choice" + (data.first === o.v ? " selected" : "")}
            onClick={() => setAndAdvance("first", o.v)}>
            <span className="num">{o.v ? "01.A" : "01.B"}</span>
            <span className="display" style={{ fontSize: 32, lineHeight: 1 }}>{o.l}</span>
            <span style={{ fontSize: 13, opacity: 0.7 }}>{o.sub}</span>
          </button>
        ))}
      </ChoiceGrid>
    </div>
  );
}

function Step02({ data, setAndAdvance, T }) {
  return (
    <div>
      <StepHeader num="02" q={T.q2} sub={T.q2sub} />
      <ChoiceGrid cols={3}>
        {T.styles.map((s, i) => (
          <button key={s.k}
            className={"choice" + (data.style === s.k ? " selected" : "")}
            onClick={() => setAndAdvance("style", s.k)}
            style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ aspectRatio: "1/1", overflow: "hidden", background: "#0c0c0c" }}>
              <img src={s.img} alt={s.k} style={{
                width: "100%", height: "100%", objectFit: "cover",
                display: "block",
              }} />
            </div>
            <div style={{ padding: "14px 16px" }}>
              <div className="num">{String(i+1).padStart(2,"0")}</div>
              <div style={{ fontWeight: 600, fontSize: 15, marginTop: 4 }}>{s.k}</div>
              <div style={{ fontSize: 12, opacity: 0.65, marginTop: 2 }}>{s.d}</div>
            </div>
          </button>
        ))}
      </ChoiceGrid>
    </div>
  );
}

function Step03({ data, setAndAdvance, T }) {
  return (
    <div>
      <StepHeader num="03" q={T.q3} sub={T.q3sub} />
      <ChoiceGrid cols={3}>
        {T.sizes.map((s, i) => (
          <button key={s.k}
            className={"choice" + (data.size === s.k ? " selected" : "")}
            onClick={() => setAndAdvance("size", s.k)}>
            <span className="num">{String(i+1).padStart(2,"0")} · {s.cm}</span>
            <span className="display" style={{ fontSize: 28, lineHeight: 1 }}>{s.k}</span>
            <div style={{
              height: 4, width: `${30 + i * 30}%`,
              background: data.size === s.k ? "rgba(255,255,255,0.7)" : "#000",
              marginTop: 8,
            }} />
            <span style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>{s.d}</span>
          </button>
        ))}
      </ChoiceGrid>
    </div>
  );
}

function Step04({ data, setAndAdvance, T }) {
  const [view, setView] = React.useState("front");
  const [pending, setPending] = React.useState(data.zone);
  const viewZones = T.zones.filter(z => z.v === view);
  return (
    <div>
      <StepHeader num="04" q={T.q4} sub={T.q4sub} />
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, alignItems: "start" }} className="zone-grid">
        <BodyDiagram selected={pending} onSelect={setPending} view={view} setView={setView} T={T} />
        <div style={{ display: "grid", gap: 6, maxHeight: 480, overflowY: "auto" }}>
          {viewZones.map(z => (
            <button key={z.k + z.v}
              onClick={() => setPending(z.k)}
              style={{
                textAlign: "left", padding: "12px 16px",
                border: "1px solid var(--hair)",
                background: pending === z.k ? "#000" : "#fff",
                color: pending === z.k ? "#fff" : "#000",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                transition: "all .15s",
              }}>
              <span style={{ fontSize: 14 }}>{z.label || z.k}</span>
              <span className="mono" style={{ fontSize: 10, opacity: 0.6 }}>
                {pending === z.k ? "●" : "○"}
              </span>
            </button>
          ))}
        </div>
      </div>
      {pending && (
        <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => setAndAdvance("zone", pending)}
            className="btn btn-dark"
            style={{ fontSize: 13, padding: "14px 36px", letterSpacing: "0.06em" }}
          >
            {T.confirmZone || "Confirmar zona"} →
          </button>
        </div>
      )}
      <style>{`
        @media (max-width: 720px) {
          .zone-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function BodyDiagram({ selected, onSelect, view, setView, T }) {
  const [hovered, setHovered] = React.useState(null);

  const FRONT_DOTS = [
    { k: "Cabeza",      x: 50,  y: 7  },
    { k: "Cuello",      x: 50,  y: 15 },
    { k: "Hombro",      x: 22,  y: 22 },
    { k: "Pecho",       x: 50,  y: 29 },
    { k: "Costilla",    x: 27,  y: 38 },
    { k: "Abdomen",     x: 50,  y: 47 },
    { k: "Brazo",       x: 17,  y: 33 },
    { k: "Antebrazo",   x: 14,  y: 43 },
    { k: "Mano",        x: 13,  y: 53 },
    { k: "Muslo",       x: 38,  y: 62 },
    { k: "Rodilla",     x: 38,  y: 72 },
    { k: "Pantorrilla", x: 38,  y: 82 },
    { k: "Pie",         x: 38,  y: 92 },
  ];

  const BACK_DOTS = [
    { k: "Nuca",         x: 50, y: 10 },
    { k: "Hombro",       x: 22, y: 22 },
    { k: "Espalda alta", x: 50, y: 28 },
    { k: "Brazo",        x: 17, y: 33 },
    { k: "Antebrazo",    x: 14, y: 43 },
    { k: "Mano",         x: 13, y: 53 },
    { k: "Lumbar",       x: 50, y: 44 },
    { k: "Glúteo",       x: 37, y: 56 },
    { k: "Isquio",       x: 38, y: 66 },
    { k: "Rodilla",      x: 38, y: 73 },
    { k: "Pantorrilla",  x: 38, y: 83 },
    { k: "Tobillo",      x: 38, y: 92 },
  ];

  const dots = view === "front" ? FRONT_DOTS : BACK_DOTS;
  const bgPos = view === "front" ? "0% 0%" : "100% 0%";

  return (
    <div style={{ background: "var(--warm)", border: "1px solid var(--hair)", position: "relative" }}>
      <div style={{ display: "flex", gap: 8, padding: "12px 14px 0" }}>
        <button
          className={"pill" + (view === "front" ? " active" : "")}
          onClick={() => setView("front")}
          style={{ fontSize: 10.5 }}
        >{T.viewFront || "Frente"}</button>
        <button
          className={"pill" + (view === "back" ? " active" : "")}
          onClick={() => setView("back")}
          style={{ fontSize: 10.5 }}
        >{T.viewBack || "Dorso"}</button>
      </div>

      <div style={{
        position: "relative",
        margin: "8px auto 4px",
        width: "100%",
        maxWidth: 200,
        aspectRatio: "1/2",
        backgroundImage: "url(assets/body-3views.png)",
        backgroundSize: "300% auto",
        backgroundPosition: bgPos,
        backgroundRepeat: "no-repeat",
        transition: "background-position 0.35s ease",
        overflow: "hidden",
      }}>
        {dots.map(dot => {
          const isSel = selected === dot.k;
          const isHov = hovered === dot.k;
          const zLabel = (T.zones.find(z => z.k === dot.k && z.v === view) || {}).label || dot.k;
          return (
            <button
              key={dot.k + view}
              title={zLabel}
              onClick={() => onSelect(dot.k)}
              onMouseEnter={() => setHovered(dot.k)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: "absolute",
                left: `${dot.x}%`, top: `${dot.y}%`,
                transform: "translate(-50%, -50%)",
                width: isSel ? 18 : (isHov ? 15 : 11),
                height: isSel ? 18 : (isHov ? 15 : 11),
                borderRadius: "50%",
                background: isSel ? "#000" : (isHov ? "rgba(0,0,0,0.75)" : "rgba(0,0,0,0.38)"),
                border: isSel ? "2px solid #fff" : "1.5px solid rgba(0,0,0,0.55)",
                boxShadow: isSel ? "0 0 0 3px #000" : (isHov ? "0 0 0 2px rgba(0,0,0,0.3)" : "none"),
                cursor: "pointer",
                transition: "all 0.15s ease",
                padding: 0,
              }}
            />
          );
        })}
      </div>

      {selected && (
        <div style={{
          margin: "0 14px 14px",
          background: "#000", color: "#fff",
          padding: "9px 14px", fontSize: 11, fontWeight: 700,
          letterSpacing: "0.08em", textTransform: "uppercase",
          display: "flex", justifyContent: "space-between",
        }}>
          <span>[ {T.zoneLabel || "Zona"} ]</span>
          <span style={{ fontStyle: "italic", fontWeight: 400 }}>{selected}</span>
        </div>
      )}
    </div>
  );
}

function Step05({ data, setAndAdvance, T }) {
  return (
    <div>
      <StepHeader num="05" q={T.q5} sub={T.q5sub} />
      <ChoiceGrid>
        {[
          { v: "have", l: T.q5a, d: T.q5aD },
          { v: "create", l: T.q5b, d: T.q5bD },
          { v: "open", l: T.q5c, d: T.q5cD },
        ].map(o => (
          <button key={o.v}
            className={"choice" + (data.hasDesign === o.v ? " selected" : "")}
            onClick={() => setAndAdvance("hasDesign", o.v)}>
            <span className="num">— {o.v}</span>
            <span className="display" style={{ fontSize: 26, lineHeight: 1.1 }}>{o.l}</span>
            <span style={{ fontSize: 13, opacity: 0.7 }}>{o.d}</span>
          </button>
        ))}
      </ChoiceGrid>
    </div>
  );
}

function Step06({ data, set, T }) {
  const inputRef = useRefW(null);
  const [over, setOver] = useStateW(false);

  const handleFiles = (files) => {
    const arr = Array.from(files).slice(0, 6).map(f => ({
      name: f.name, size: f.size, type: f.type,
      url: URL.createObjectURL(f),
    }));
    set("refs", [...data.refs, ...arr].slice(0, 6));
  };

  return (
    <div>
      <StepHeader num="06" q={T.q6} sub={T.q6sub} />
      <div
        onDragOver={e => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={e => { e.preventDefault(); setOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `1.5px dashed ${over ? "#000" : "var(--hair-strong)"}`,
          background: "var(--warm)",
          padding: "60px 20px", textAlign: "center",
          cursor: "pointer", transition: "all .2s",
        }}>
        <Asterisk size={28} spin={over} />
        <div className="display" style={{ fontSize: 28, marginTop: 16 }}>{T.dropTitle}</div>
        <div style={{ color: "var(--muted)", fontSize: 14, marginTop: 8 }}>{T.dropSub}</div>
        <input ref={inputRef} type="file" multiple accept="image/*" hidden onChange={e => handleFiles(e.target.files)} />
      </div>
      {data.refs.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8, marginTop: 20 }}>
          {data.refs.map((r, i) => (
            <div key={i} style={{ position: "relative", aspectRatio: "1/1", background: "#000", overflow: "hidden" }}>
              <img src={r.url} alt={r.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button onClick={(e) => { e.stopPropagation(); set("refs", data.refs.filter((_, j) => j !== i)); }}
                style={{ position: "absolute", top: 6, right: 6, background: "#fff", padding: "2px 6px", fontSize: 10, fontFamily: "var(--mono)" }}>
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Step07({ data, setAndAdvance, T, preselectedArtist }) {
  const artists = T.artists;

  if (preselectedArtist) {
    const artist = artists.find(a => a.k === preselectedArtist);
    if (artist) {
      return (
        <div>
          <StepHeader num="07" q={T.q7} sub={T.q7sub} />
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 280 }}>
            <div style={{ border: "2px solid #000", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 10, right: 10, zIndex: 2, background: "#000", color: "#fff", padding: "4px 10px", fontSize: 9, fontFamily: "var(--mono)", letterSpacing: "0.1em" }}>● SEL.</div>
              <div style={{ aspectRatio: "1/1", overflow: "hidden", background: "#f3efe8" }}>
                <img src={artist.img} alt={artist.k} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ padding: "14px 16px" }}>
                <div className="num">{artist.role}</div>
                <div style={{ fontWeight: 600, fontSize: 16, marginTop: 4 }}>{artist.k}</div>
                {artist.sub && <div style={{ fontSize: 11, opacity: 0.5, marginTop: 2 }}>{artist.sub}</div>}
                <div style={{ fontSize: 12, opacity: 0.65, marginTop: 5 }}>{artist.styles}</div>
              </div>
            </div>
            <div className="meta" style={{ fontSize: 11, lineHeight: 1.5 }}>
              {T.lockedArtistNote || "Llegaste desde este perfil. Usá Atrás para cambiar."}
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div>
      <StepHeader num="07" q={T.q7} sub={T.q7sub} />
      <ChoiceGrid cols={3}>
        <button
          className={"choice" + (data.artist === "any" ? " selected" : "")}
          onClick={() => setAndAdvance("artist", "any")}>
          <span className="num">— Sin preferencia</span>
          <span className="display" style={{ fontSize: 26 }}>{T.anyArtist}</span>
          <span style={{ fontSize: 13, opacity: 0.7 }}>{T.anyArtistD}</span>
        </button>
        {artists.map((a, i) => {
          const away = a.away === true;
          return (
            <button key={a.k}
              disabled={away}
              aria-disabled={away}
              className={"choice" + (data.artist === a.k ? " selected" : "") + (away ? " is-away" : "")}
              onClick={() => { if (!away) setAndAdvance("artist", a.k); }}
              style={{ padding: 0, position: "relative", cursor: away ? "not-allowed" : "pointer", overflow: "hidden" }}>
              <div style={{ position: "relative" }}>
                <div style={{
                  aspectRatio: "1 / 1", overflow: "hidden",
                  background: "#f3efe8",
                  filter: away ? "grayscale(1)" : "none",
                  opacity: away ? 0.55 : 1
                }}>
                  <img src={a.img} alt={a.k} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                {away && (
                  <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    pointerEvents: "none"
                  }}>
                    <span className="mono" style={{
                      background: "#000", color: "#fff",
                      padding: "6px 12px", fontSize: 11, letterSpacing: "0.08em",
                      transform: "rotate(-4deg)", border: "1px solid #000"
                    }}>
                      ✱ DE VIAJE — NO DISPONIBLE
                    </span>
                  </div>
                )}
              </div>
              <div style={{ padding: "14px 16px", textAlign: "left" }}>
                <div className="num">{String(i+1).padStart(2,"0")} · {a.role}</div>
                <div style={{ fontWeight: 600, fontSize: 15, marginTop: 4 }}>{a.k}</div>
                {a.sub && (
                  <div style={{ fontSize: 11, opacity: 0.5, marginTop: 1 }}>{a.sub}</div>
                )}
                <div style={{ fontSize: 12, opacity: 0.65, marginTop: 4 }}>{a.styles}</div>
                {away && (
                  <div className="mono" style={{ fontSize: 10, opacity: 0.6, marginTop: 6 }}>
                    {T.awayNote || "Vuelve pronto"}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </ChoiceGrid>
    </div>
  );
}

function Step08({ data, set, T }) {
  return (
    <div>
      <StepHeader num="08" q={T.q8} sub={T.q8sub} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 28, maxWidth: 720 }}>
        <div>
          <label className="meta" style={{ display: "block", marginBottom: 8 }}>{T.dateFrom}</label>
          <input type="date" className="field" value={data.dates.from}
            onChange={e => set("dates", { ...data.dates, from: e.target.value })} />
        </div>
        <div>
          <label className="meta" style={{ display: "block", marginBottom: 8 }}>{T.dateTo}</label>
          <input type="date" className="field" value={data.dates.to}
            onChange={e => set("dates", { ...data.dates, to: e.target.value })} />
        </div>
      </div>
      <div style={{ marginTop: 32, padding: "20px 24px", background: "var(--warm)", display: "flex", gap: 14, alignItems: "flex-start" }}>
        <Asterisk size={14} />
        <div style={{ fontSize: 14, color: "var(--muted)" }}>
          {T.dateNote}
        </div>
      </div>
    </div>
  );
}

function Step09({ data, set, T }) {
  const update = (k, v) => set("contact", { ...data.contact, [k]: v });
  return (
    <div>
      <StepHeader num="09" q={T.q9} sub={T.q9sub} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32, maxWidth: 880 }}>
        <div style={{ display: "grid", gap: 20 }}>
          <div>
            <label className="meta" style={{ display: "block", marginBottom: 4 }}>{T.fName} *</label>
            <input className="field" value={data.contact.name} onChange={e => update("name", e.target.value)} placeholder="Tu nombre" />
          </div>
          <div>
            <label className="meta" style={{ display: "block", marginBottom: 4 }}>{T.fEmail} *</label>
            <input className="field" type="email" value={data.contact.email} onChange={e => update("email", e.target.value)} placeholder="tu@email.com" />
          </div>
          <div>
            <label className="meta" style={{ display: "block", marginBottom: 4 }}>{T.fPhone}</label>
            <input className="field" value={data.contact.phone} onChange={e => update("phone", e.target.value)} placeholder="+54 11 ..." />
          </div>
          <div>
            <label className="meta" style={{ display: "block", marginBottom: 4 }}>{T.fNotes}</label>
            <textarea className="field" value={data.contact.notes} onChange={e => update("notes", e.target.value)} rows={3} />
          </div>
        </div>
        <Summary data={data} T={T} />
      </div>
      <div style={{
        marginTop: 28, padding: "16px 22px", background: "var(--warm)",
        display: "flex", gap: 14, alignItems: "flex-start",
        fontSize: 13, color: "var(--muted)",
      }}>
        <Asterisk size={14} />
        <div>
          Al enviar abrimos tu cliente de mail con todos los datos pre-cargados — vas a tener que sumar las imágenes de referencia como adjuntas y darle <em>Enviar</em>.
          El destinatario es <strong>centrostudio.ar@gmail.com</strong>.
        </div>
      </div>
    </div>
  );
}

function Summary({ data, T }) {
  const rows = [
    [T.sumFirst, data.first === null ? "—" : (data.first ? T.yes : T.no)],
    [T.sumStyle, data.style || "—"],
    [T.sumSize, data.size || "—"],
    [T.sumZone, data.zone || "—"],
    [T.sumDesign, data.hasDesign || "—"],
    [T.sumRefs, data.refs.length + " " + T.files],
    [T.sumArtist, data.artist || "—"],
    [T.sumDates, data.dates.from || "—"],
  ];
  return (
    <div style={{ border: "1px solid var(--hair)", padding: 28, background: "var(--warm)" }}>
      <div className="meta" style={{ marginBottom: 16 }}>[ {T.summary} ]</div>
      <div style={{ display: "grid", gap: 0 }}>
        {rows.map(([k, v]) => (
          <div key={k} style={{
            display: "flex", justifyContent: "space-between",
            padding: "10px 0", borderTop: "1px solid var(--hair)",
            fontSize: 13,
          }}>
            <span style={{ color: "var(--muted)", textTransform: "uppercase", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.06em" }}>{k}</span>
            <span style={{ fontWeight: 500, textAlign: "right" }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WizardDone({ setRoute, T, data }) {
  return (
    <div className="page-fade" style={{ paddingTop: 64, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="container" style={{ textAlign: "center", maxWidth: 720, padding: "80px 32px" }}>
        <Asterisk size={56} spin />
        <h1 className="display" style={{ fontSize: "clamp(48px, 7vw, 96px)", margin: "32px 0 16px", lineHeight: 1 }}>
          <em>{T.thanksA}</em><br/>{T.thanksB}
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.5, color: "var(--muted)", maxWidth: 480, margin: "0 auto 16px" }}>
          {T.thanksBody}
        </p>
        <p style={{ fontSize: 14, color: "var(--muted)", margin: "0 0 36px" }}>
          {T.thanksTime}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="https://wa.me/5492804777018" target="_blank" rel="noopener" className="btn btn-dark">
            {T.thanksWA} →
          </a>
          <button className="btn" onClick={() => setRoute("home")}>{T.thanksHome}</button>
        </div>
      </div>
    </div>
  );
}

const wzES = {
  title: "Cotizá un tatuaje",
  h1a: "Contanos",
  h1b: "tu idea",
  back: "Atrás", next: "Siguiente", skip: "Saltear", submit: "Enviar por mail",
  ready: "listo · podés avanzar", optional: "opcional · podés saltearlo",
  yes: "Sí", no: "No",
  q1: "¿Es tu primer tatuaje?",
  firstYes: "Te acompañamos en cada paso del proceso.",
  firstNo: "Buenísimo, vamos al grano.",
  q2: "¿Qué estilo te interesa?",
  q2sub: "Elegí uno. Si tenés dudas, en el paso 5 podés dejarlo abierto.",
  styles: [
    { k: "Fine line",          d: "Líneas finas, detalle delicado",        img: "assets/styles/fineline.jpg" },
    { k: "Blackwork",          d: "Negro sólido, fuerte presencia",         img: "assets/styles/blackwork.jpg" },
    { k: "Tradicional negro",  d: "Old school, paleta cerrada en negro",    img: "assets/styles/tradicional-negro.jpg" },
    { k: "Tradicional color",  d: "Old school clásico con paleta a color",  img: "assets/styles/tradicional-color.jpg" },
    { k: "Tribal / Ornamental", d: "Líneas decorativas, simbología",          img: "assets/styles/tribal.jpg" },
    { k: "Lettering",          d: "Tipografía y caligrafía",                img: "assets/styles/lettering.jpg" },
    { k: "Ilustrativo",        d: "Composición narrativa",                  img: "assets/styles/ilustrativo.jpg" },
    { k: "Orgánico",           d: "Formas que acompañan la anatomía",       img: "assets/styles/organico.jpg" },
  ],
  q3: "¿Tamaño aproximado?",
  q3sub: "Una referencia general — lo afinamos en consulta.",
  sizes: [
    { k: "Pequeño", cm: "—5cm", d: "Chico, discreto" },
    { k: "Mediano", cm: "5—15cm", d: "Tamaño estándar" },
    { k: "Grande", cm: "15cm+", d: "Brazo, espalda, panel" },
  ],
  q4: "¿Zona del cuerpo?",
  q4sub: "Tocá la silueta o elegí de la lista.",
  viewFront: "Frente",
  viewBack: "Dorso",
  zoneLabel: "Zona seleccionada",
  confirmZone: "Confirmar zona",
  zones: [
    { k: "Cabeza",       v: "front", label: "Cabeza" },
    { k: "Cuello",       v: "front", label: "Cuello" },
    { k: "Hombro",       v: "front", label: "Hombro" },
    { k: "Pecho",        v: "front", label: "Pecho" },
    { k: "Costilla",     v: "front", label: "Costilla" },
    { k: "Abdomen",      v: "front", label: "Abdomen" },
    { k: "Brazo",        v: "front", label: "Brazo" },
    { k: "Antebrazo",    v: "front", label: "Antebrazo" },
    { k: "Mano",         v: "front", label: "Mano" },
    { k: "Muslo",        v: "front", label: "Muslo" },
    { k: "Rodilla",      v: "front", label: "Rodilla" },
    { k: "Pantorrilla",  v: "front", label: "Pantorrilla" },
    { k: "Pie",          v: "front", label: "Pie" },
    { k: "Nuca",         v: "back",  label: "Nuca" },
    { k: "Espalda alta", v: "back",  label: "Espalda alta" },
    { k: "Hombro",       v: "back",  label: "Hombro" },
    { k: "Brazo",        v: "back",  label: "Brazo" },
    { k: "Antebrazo",    v: "back",  label: "Antebrazo" },
    { k: "Mano",         v: "back",  label: "Mano" },
    { k: "Lumbar",       v: "back",  label: "Lumbar" },
    { k: "Glúteo",       v: "back",  label: "Glúteo" },
    { k: "Isquio",       v: "back",  label: "Isquio" },
    { k: "Rodilla",      v: "back",  label: "Rodilla" },
    { k: "Pantorrilla",  v: "back",  label: "Pantorrilla" },
    { k: "Tobillo",      v: "back",  label: "Tobillo" },
  ],
  q5: "¿Tenés un diseño o lo creamos?",
  q5a: "Tengo el diseño",
  q5aD: "Lo subo en el próximo paso.",
  q5b: "Necesito que lo creen",
  q5bD: "Trabajamos juntos a partir de tus referencias.",
  q5c: "Estoy abierto/a",
  q5cD: "Conversemos opciones con el artista.",
  q6: "Subí imágenes de referencia",
  q6sub: "Hasta 6 archivos. Pueden ser fotos de tatuajes, ilustraciones, o lo que te inspire.",
  dropTitle: "Soltá las imágenes acá",
  dropSub: "o tocá para seleccionarlas — JPG, PNG, hasta 10MB c/u",
  q7: "¿Con qué artista te gustaría tatuarte?",
  q7sub: "Opcional. Si no estás seguro/a, elegí Sin preferencia.",
  anyArtist: "Sin preferencia",
  anyArtistD: "Te asignamos el mejor según el estilo.",
  artists: [
    { k: "panchogattoni", role: "Resident", styles: "Tradicional blackwork",    img: "assets/artists/pancho.jpg",     sub: "Francisco Gattoni" },
    { k: "inksomnio",     role: "Resident", styles: "Fineline / Ornamental",   img: "assets/artists/inksomnio.jpg", sub: "Agustina Cistaro" },
    { k: "mutar",         role: "Resident", styles: "Fineline / Ornamental",   img: "assets/artists/mutar.jpg",      sub: "Katja Sol Müller" },
    { k: "coti",          role: "Resident", styles: "Ilustrativo",              img: "assets/artists/coti.jpg",       sub: "Constanza Rossi" },
    { k: "milepokes",     role: "Resident", styles: "Handpoke ilustrativo",     img: "assets/artists/mile.jpg",       sub: "Milena Presta" },
    { k: "guadatatua",    role: "Resident", styles: "Tradicional",              img: "assets/artists/guada.jpg",      sub: "Guadalupe Barrientos" },
    { k: "maxis.sb",      role: "Resident", styles: "Lettering · Fine line",    img: "assets/artists/maxi.jpg" },
    { k: "fiebre",        role: "Resident", styles: "Blackwork ilustrativo",    img: "assets/artists/naza.jpg",       sub: "Nazareno González" },
    { k: "nella369",      role: "Resident", styles: "Gótico · Tribal",          img: "assets/artists/nella.jpg",      sub: "Agustín Nella" },
    { k: "sufrodeamor",   role: "Resident", styles: "Fine line · Ornamental",   img: "assets/artists/cami.jpg",       sub: "Camila Piña" },
    { k: "c4talina",      role: "Resident", styles: "Blackwork",                img: "assets/artists/cata.jpg",       sub: "Catalina León" },
    { k: "facundo.void",  role: "Resident", styles: "Fine line · Dotwork",      img: "assets/artists/facu.jpg" },
  ],
  awayNote: "Actualmente de viaje",
  lockedArtistNote: "Llegaste desde este perfil. Usá Atrás para cambiar.",
  q8: "¿Cuándo te gustaría tatuarte?",
  q8sub: "Indicanos un rango aproximado de fechas.",
  dateFrom: "Desde", dateTo: "Hasta",
  dateNote: "Coordinamos el turno por mail dentro de las 48h hábiles.",
  q9: "Datos de contacto",
  q9sub: "Solo lo necesario para responderte.",
  fName: "Nombre", fEmail: "Email", fPhone: "Teléfono / WhatsApp",
  fNotes: "Algo más que quieras contarnos",
  summary: "Resumen",
  sumFirst: "Primer tatuaje", sumStyle: "Estilo", sumSize: "Tamaño",
  sumZone: "Zona", sumDesign: "Diseño", sumRefs: "Referencias",
  sumArtist: "Artista", sumDates: "Fechas",
  files: "archivo(s)",
  thanksA: "Recibimos",
  thanksB: "tu solicitud.",
  thanksBody: "Acabamos de abrir tu cliente de mail con todos los datos pre-cargados. Adjuntá las referencias y dale Enviar — te respondemos con presupuesto y propuesta de turno.",
  thanksTime: "Tiempo de respuesta: hasta 48h hábiles.",
  thanksWA: "Continuá por WhatsApp",
  thanksHome: "Volver al inicio",
};

const wzEN = Object.assign({}, wzES, {
  title: "Tattoo Quote",
  h1a: "Tell us", h1b: "your idea",
  back: "Back", next: "Next", skip: "Skip", submit: "Send by email",
  ready: "ready · you can continue", optional: "optional · you can skip",
  yes: "Yes", no: "No",
  q1: "Is this your first tattoo?",
  firstYes: "We'll guide you through every step.",
  firstNo: "Great, let's get to it.",
  q2: "Which style are you into?",
  q2sub: "Pick one. If unsure, keep it open in step 5.",
  styles: [
    { k: "Fine line",           d: "Fine lines, delicate detail",           img: "assets/styles/fineline.jpg" },
    { k: "Blackwork",           d: "Solid black, strong presence",           img: "assets/styles/blackwork.jpg" },
    { k: "Tradicional negro",   d: "Old school, closed black palette",       img: "assets/styles/tradicional-negro.jpg" },
    { k: "Tradicional color",   d: "Classic old school with full color",     img: "assets/styles/tradicional-color.jpg" },
    { k: "Tribal / Ornamental", d: "Decorative lines, symbolism",            img: "assets/styles/tribal.jpg" },
    { k: "Lettering",           d: "Typography and calligraphy",             img: "assets/styles/lettering.jpg" },
    { k: "Ilustrativo",         d: "Narrative illustration",                 img: "assets/styles/ilustrativo.jpg" },
    { k: "Orgánico",            d: "Forms that follow the anatomy",          img: "assets/styles/organico.jpg" },
  ],
  q3: "Approximate size?", q3sub: "A general reference — we'll refine in consult.",
  sizes: [
    { k: "Small",  cm: "—5cm",   d: "Small, discreet" },
    { k: "Medium", cm: "5—15cm", d: "Standard size" },
    { k: "Large",  cm: "15cm+",  d: "Arm, back, full panel" },
  ],
  q4: "Body zone?", q4sub: "Tap the figure or pick from the list.",
  viewFront: "Front", viewBack: "Back", zoneLabel: "Zone",
  confirmZone: "Confirm zone",
  zones: [
    { k: "Cabeza",       v: "front", label: "Head" },
    { k: "Cuello",       v: "front", label: "Neck" },
    { k: "Hombro",       v: "front", label: "Shoulder" },
    { k: "Pecho",        v: "front", label: "Chest" },
    { k: "Costilla",     v: "front", label: "Ribs" },
    { k: "Abdomen",      v: "front", label: "Abdomen" },
    { k: "Brazo",        v: "front", label: "Upper arm" },
    { k: "Antebrazo",    v: "front", label: "Forearm" },
    { k: "Mano",         v: "front", label: "Hand" },
    { k: "Muslo",        v: "front", label: "Thigh" },
    { k: "Rodilla",      v: "front", label: "Knee" },
    { k: "Pantorrilla",  v: "front", label: "Calf" },
    { k: "Pie",          v: "front", label: "Foot" },
    { k: "Nuca",         v: "back",  label: "Back of neck" },
    { k: "Espalda alta", v: "back",  label: "Upper back" },
    { k: "Hombro",       v: "back",  label: "Shoulder" },
    { k: "Brazo",        v: "back",  label: "Upper arm" },
    { k: "Antebrazo",    v: "back",  label: "Forearm" },
    { k: "Mano",         v: "back",  label: "Hand" },
    { k: "Lumbar",       v: "back",  label: "Lower back" },
    { k: "Glúteo",       v: "back",  label: "Glute" },
    { k: "Isquio",       v: "back",  label: "Hamstring" },
    { k: "Rodilla",      v: "back",  label: "Knee" },
    { k: "Pantorrilla",  v: "back",  label: "Calf" },
    { k: "Tobillo",      v: "back",  label: "Ankle" },
  ],
  q5: "Do you have a design or should we create it?",
  q5a: "I have the design", q5aD: "I'll upload it in the next step.",
  q5b: "I need you to create it", q5bD: "We work together from your references.",
  q5c: "I'm open", q5cD: "Let's discuss options with the artist.",
  q6: "Upload reference images",
  q6sub: "Up to 6 files. Tattoos, illustrations, or whatever inspires you.",
  dropTitle: "Drop images here", dropSub: "or tap to select — JPG, PNG, up to 10MB each",
  q7: "Which artist would you like?", q7sub: "Optional. If unsure, choose No preference.",
  anyArtist: "No preference", anyArtistD: "We'll match you with the best for your style.",
  awayNote: "Currently traveling",
  lockedArtistNote: "You arrived from this artist's profile. Use Back to change.",
  q8: "When would you like to get tattooed?", q8sub: "Give us an approximate date range.",
  dateFrom: "From", dateTo: "To",
  dateNote: "We schedule by email within 48 business hours.",
  q9: "Contact details", q9sub: "Only what we need to reply.",
  fName: "Name", fEmail: "Email", fPhone: "Phone / WhatsApp",
  fNotes: "Anything else?",
  summary: "Summary",
  sumFirst: "First tattoo", sumStyle: "Style", sumSize: "Size",
  sumZone: "Zone", sumDesign: "Design", sumRefs: "References",
  sumArtist: "Artist", sumDates: "Dates", files: "file(s)",
  thanksA: "We received", thanksB: "your request.",
  thanksBody: "We just opened your email client pre-filled. Attach the references and hit Send — we'll reply with a quote and a proposed appointment.",
  thanksTime: "Response time: up to 48 business hours.",
  thanksWA: "Continue on WhatsApp", thanksHome: "Back to home",
});

Object.assign(window, { Wizard });
