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
    sizeImage: null,
    contact: { name: "", ig: "", notes: "" },
  });
  const [submitted, setSubmitted] = useStateW(false);

  const total = 9;
  const set = (k, v) => setData(d => ({ ...d, [k]: v }));

  const canSubmit = data.contact.name && data.contact.ig;
  const filled = (() => {
    switch (step) {
      case 0: return data.first !== null;
      case 1: return data.style !== null;
      case 2: return data.zone !== null;
      case 3: return data.size !== null;
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

  const [sending, setSending] = useStateW(false);

  const buildEmailText = () => {
    const subj = `Cotizá un tatuaje — ${data.contact.name}`;
    const body =
      `Hola Centro,\n\n` +
      `Cotizo un tatuaje. Estos son los datos:\n\n` +
      `· Primer tatuaje: ${data.first === null ? "—" : (data.first ? "Sí" : "No")}\n` +
      `· Estilo:         ${data.style || "—"}\n` +
      `· Tamaño:         ${data.size || "—"}\n` +
      `· Zona:           ${data.zone || "—"}\n` +
      `· Diseño:         ${data.hasDesign || "—"}\n` +
      `· Referencias:    ${data.refs.length} archivo(s)\n` +
      `· Artista:        ${data.artist || "—"}\n` +
      `· Fechas:         ${data.dates.from || "—"}${data.dates.to ? " → " + data.dates.to : ""}\n\n` +
      `── Contacto ──\n` +
      `Nombre:    ${data.contact.name}\n` +
      `Instagram: @${data.contact.ig}\n\n` +
      `Gracias.`;
    return { subj, body };
  };

  const submit = async () => {
    if (!canSubmit || sending) return;
    setSending(true);

    const { subj, body } = buildEmailText();

    // Convert image blobs to base64 for API attachment
    const sizeAttachment = data.sizeImage ? [data.sizeImage] : [];
    const attachments = [...sizeAttachment, ...await Promise.all(
      data.refs.map(r => new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", r.url, true);
        xhr.responseType = "blob";
        xhr.onload = () => {
          const reader = new FileReader();
          reader.onload = () => resolve({ name: r.name, data: reader.result.split(",")[1] });
          reader.readAsDataURL(xhr.response);
        };
        xhr.onerror = () => resolve(null);
        xhr.send();
      }))
    ).then(arr => arr.filter(Boolean))];

    try {
      const resp = await fetch("/api/send-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: subj, text: body, attachments }),
      });
      const result = await resp.json().catch(() => ({}));

      if (result.ok) {
        setSending(false);
        setSubmitted(true);
        return;
      }
      // API not configured or failed → fall back to mailto:
    } catch (_) { /* network error — fall back */ }

    // Fallback: open mail client (user attaches images manually)
    const url = "mailto:centrostudio.ar@gmail.com" +
      "?subject=" + encodeURIComponent(subj) +
      "&body=" + encodeURIComponent(body);
    window.location.href = url;
    setSending(false);
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
          {step === 2 && <Step04 data={data} set={set} setAndAdvance={setAndAdvance} T={T} />}
          {step === 3 && <Step03Visual data={data} set={set} T={T} />}
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
            <button onClick={submit} disabled={!canSubmit || sending} className="btn btn-dark" style={{ opacity: canSubmit && !sending ? 1 : 0.3 }}>
              {sending ? <Asterisk size={10} color="#fff" spin /> : T.submit}
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
        {T.styles.map((s, i) => {
          const noImg = s.img === "assets/styles/notclear.jpg";
          return (
            <button key={s.k}
              className={"choice" + (data.style === s.k ? " selected" : "")}
              onClick={() => setAndAdvance("style", s.k)}
              style={noImg ? {} : { padding: 0, overflow: "hidden" }}>
              {noImg ? (
                <>
                  <span className="num">— {T.noStyleLabel || "Sin preferencia"}</span>
                  <span className="display" style={{ fontSize: 22 }}>{s.k}</span>
                  <span style={{ fontSize: 12, opacity: 0.7 }}>{s.d}</span>
                </>
              ) : (
                <>
                  <div style={{ aspectRatio: "1/1", overflow: "hidden", background: "#0c0c0c" }}>
                    <img src={s.img} alt={s.k} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <div className="num">{String(i).padStart(2,"0")}</div>
                    <div style={{ fontWeight: 600, fontSize: 15, marginTop: 4 }}>{s.k}</div>
                    <div style={{ fontSize: 12, opacity: 0.65, marginTop: 2 }}>{s.d}</div>
                  </div>
                </>
              )}
            </button>
          );
        })}
      </ChoiceGrid>
    </div>
  );
}

const ZONE_BOX = {
  "Cabeza":       { x: 39, y: 1,   w: 22, h: 23, side: "front" },
  "Cuello":       { x: 44, y: 23,  w: 12, h: 9,  side: "front" },
  "Nuca":         { x: 44, y: 23,  w: 12, h: 9,  side: "back"  },
  "Hombro":       { x: 10, y: 31,  w: 80, h: 12, side: "front" },
  "Pecho":        { x: 28, y: 44,  w: 44, h: 26, side: "front" },
  "Costilla":     { x: 25, y: 62,  w: 50, h: 20, side: "front" },
  "Abdomen":      { x: 28, y: 72,  w: 44, h: 18, side: "front" },
  "Espalda alta": { x: 27, y: 34,  w: 46, h: 34, side: "back"  },
  "Lumbar":       { x: 27, y: 68,  w: 46, h: 22, side: "back"  },
  "Glúteo":       { x: 21, y: 90,  w: 58, h: 26, side: "back"  },
  "Brazo":        { x: 9,  y: 38,  w: 12, h: 50, side: "front" },
  "Antebrazo":    { x: 7,  y: 88,  w: 11, h: 48, side: "front" },
  "Mano":         { x: 5,  y: 135, w: 13, h: 18, side: "front" },
  "Muslo":        { x: 17, y: 118, w: 30, h: 54, side: "front" },
  "Isquio":       { x: 17, y: 148, w: 30, h: 28, side: "back"  },
  "Rodilla":      { x: 15, y: 172, w: 30, h: 16, side: "front" },
  "Pantorrilla":  { x: 13, y: 190, w: 32, h: 36, side: "back"  },
  "Tobillo":      { x: 16, y: 220, w: 28, h: 10, side: "front" },
  "Pie":          { x: 11, y: 226, w: 36, h: 14, side: "front" },
};

function BodySVG({ zb, side }) {
  const S = "#0c0c0c", W = 1.2, F = "#F5F2EE";
  const sh = { fill: F, stroke: S, strokeWidth: W };
  return (
    <>
      {zb && <rect x={zb.x} y={zb.y} width={zb.w} height={zb.h} fill="rgba(220,38,38,0.13)" stroke="rgba(220,38,38,0)" strokeWidth="0" />}
      <text x="50" y="6" textAnchor="middle" fontSize="4.5" fill="rgba(0,0,0,0.35)" fontFamily="Arial,sans-serif" letterSpacing="0.15em">
        {side === "back" ? "DORSO" : "FRENTE"}
      </text>
      <ellipse cx="50" cy="13" rx="11" ry="12" {...sh} />
      <polygon points="44,24 56,24 57,32 43,32" {...sh} />
      <polygon points="22,33 78,33 74,92 26,92" {...sh} />
      <polygon points="22,33 10,39 8,92 18,92 20,44" {...sh} />
      <polygon points="78,33 90,39 92,92 82,92 80,44" {...sh} />
      <polygon points="8,92 6,140 17,140 18,92" {...sh} />
      <polygon points="92,92 94,140 83,140 82,92" {...sh} />
      <ellipse cx="11" cy="147" rx="7" ry="8" {...sh} />
      <ellipse cx="89" cy="147" rx="7" ry="8" {...sh} />
      <polygon points="26,92 20,120 80,120 74,92" {...sh} />
      <polygon points="20,120 16,176 47,176 48,120" {...sh} />
      <polygon points="80,120 84,176 53,176 52,120" {...sh} />
      <polygon points="16,176 14,192 47,192 47,176" {...sh} />
      <polygon points="84,176 86,192 53,192 53,176" {...sh} />
      <polygon points="14,192 12,228 45,228 47,192" {...sh} />
      <polygon points="86,192 88,228 55,228 53,192" {...sh} />
      <ellipse cx="28" cy="233" rx="18" ry="8" {...sh} />
      <ellipse cx="72" cy="233" rx="18" ry="8" {...sh} />
    </>
  );
}

function Step03Visual({ data, set, T }) {
  const { useRef: useRefV, useState: useStateV, useEffect: useEffectV } = React;
  const zone = data.zone;
  const zb = ZONE_BOX[zone] || { x: 28, y: 44, w: 44, h: 26, side: "front" };

  const initSize = Math.max(Math.min(zb.w, zb.h) * 0.85, 8);
  const initX = zb.x + (zb.w - initSize) / 2;
  const initY = zb.y + (zb.h - initSize) / 2;

  const [slider, setSlider] = useStateV(35);
  const [pos, setPos] = useStateV({ x: initX, y: initY });
  const [dragging, setDragging] = useStateV(false);
  const [dragRef, setDragRef] = useStateV(null);
  const svgRef = useRefV(null);

  const rectSize = 4 + (slider / 100) * 50;
  const cmApprox = Math.round(2 + (slider / 100) * 28);
  const sizeLabel = cmApprox <= 5 ? "Pequeño · discreto" : cmApprox <= 14 ? "Mediano · estándar" : "Grande · panel";

  useEffectV(() => {
    set("size", `~${cmApprox}cm`);
  }, [slider]);

  useEffectV(() => {
    set("size", `~${cmApprox}cm`);
  }, []);

  const toSVG = (e) => {
    const svgEl = svgRef.current;
    if (!svgEl) return { x: 0, y: 0 };
    const pt = svgEl.createSVGPoint();
    const src = e.touches ? e.touches[0] : e;
    pt.x = src.clientX; pt.y = src.clientY;
    return pt.matrixTransform(svgEl.getScreenCTM().inverse());
  };

  const onStart = (e) => {
    e.preventDefault();
    const p = toSVG(e);
    setDragging(true);
    setDragRef({ ox: p.x - pos.x, oy: p.y - pos.y });
  };
  const onMove = (e) => {
    if (!dragging || !dragRef) return;
    const p = toSVG(e);
    setPos({
      x: Math.max(0, Math.min(100 - rectSize, p.x - dragRef.ox)),
      y: Math.max(0, Math.min(242 - rectSize, p.y - dragRef.oy)),
    });
  };
  const onEnd = () => { setDragging(false); setDragRef(null); };

  const captureImage = async () => {
    const svgEl = svgRef.current;
    if (!svgEl) return null;
    const serialized = new XMLSerializer().serializeToString(svgEl);
    const encoded = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(serialized);
    return new Promise(resolve => {
      const canvas = document.createElement("canvas");
      canvas.width = 400; canvas.height = 970;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, 400, 970);
      const img = new Image();
      img.onload = () => { ctx.drawImage(img, 0, 0, 400, 970); resolve(canvas.toDataURL("image/png").split(",")[1]); };
      img.onerror = () => resolve(null);
      img.src = encoded;
    });
  };

  useEffectV(() => {
    const timer = setTimeout(async () => {
      const b64 = await captureImage();
      if (b64) set("sizeImage", { name: "tatuaje-tamanio.png", data: b64 });
    }, 600);
    return () => clearTimeout(timer);
  }, [slider, pos]);

  const rx = pos.x, ry = pos.y, rs = rectSize;

  return (
    <div>
      <StepHeader num="03" q={T.q3} sub={T.q3sub} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32, maxWidth: 640 }} className="size-vis-grid">
        <div style={{ border: "1px solid var(--hair)", background: "#fafaf8", position: "relative" }}>
          <svg
            ref={svgRef}
            viewBox="0 0 100 242"
            style={{ width: "100%", display: "block", cursor: dragging ? "grabbing" : "default", touchAction: "none" }}
            onMouseMove={onMove} onMouseUp={onEnd} onMouseLeave={onEnd}
            onTouchMove={onMove} onTouchEnd={onEnd}
          >
            <BodySVG zb={zb} side={zb.side} />
            <g onMouseDown={onStart} onTouchStart={onStart} style={{ cursor: "grab" }}>
              <rect x={rx - 2} y={ry - 2} width={rs + 4} height={rs + 4}
                fill="none" stroke="rgba(200,30,30,0.85)" strokeWidth="1" />
              <rect x={rx} y={ry} width={rs} height={rs}
                fill="rgba(220,38,38,0.07)" stroke="rgba(200,30,30,0.85)" strokeWidth="0.8"
                strokeDasharray="3,2" />
              <line x1={rx + rs/2 - 3} y1={ry + rs/2} x2={rx + rs/2 + 3} y2={ry + rs/2}
                stroke="rgba(200,30,30,0.7)" strokeWidth="0.7" />
              <line x1={rx + rs/2} y1={ry + rs/2 - 3} x2={rx + rs/2} y2={ry + rs/2 + 3}
                stroke="rgba(200,30,30,0.7)" strokeWidth="0.7" />
            </g>
          </svg>
        </div>

        <div style={{ display: "grid", gap: 24 }}>
          <div>
            <div className="meta" style={{ marginBottom: 8 }}>Tamaño aproximado</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span className="display" style={{ fontSize: 52, lineHeight: 1 }}>~{cmApprox}</span>
              <span className="display" style={{ fontSize: 22, opacity: 0.5 }}>cm</span>
            </div>
            <div className="meta" style={{ marginTop: 6, color: "var(--muted)" }}>{sizeLabel}</div>
          </div>

          <div>
            <div className="meta" style={{ marginBottom: 10 }}>Escala</div>
            <input type="range" min="5" max="95" value={slider}
              onChange={e => setSlider(+e.target.value)}
              style={{ width: "100%", accentColor: "#000", cursor: "pointer" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <span className="meta">Pequeño</span>
              <span className="meta">Grande</span>
            </div>
          </div>

          <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, padding: "12px 16px", background: "var(--warm)" }}>
            Arrastrá el recuadro para ubicar la zona exacta. El slider ajusta el tamaño.
          </div>
        </div>
      </div>
      <style>{`
        @media (min-width: 640px) { .size-vis-grid { grid-template-columns: 1fr 240px !important; } }
      `}</style>
    </div>
  );
}

function Step04({ data, setAndAdvance, T }) {
  const seen = new Set();
  const uniqueZones = T.zones.filter(z => { if (seen.has(z.k)) return false; seen.add(z.k); return true; });

  return (
    <div>
      <StepHeader num="04" q={T.q4} sub={T.q4sub} />
      <div style={{ maxHeight: "58vh", overflowY: "auto", paddingRight: 8 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {uniqueZones.map(z => (
            <button
              key={z.k}
              onClick={() => setAndAdvance("zone", z.k)}
              style={{
                padding: "10px 18px",
                border: "1.5px solid",
                borderColor: data.zone === z.k ? "#000" : "var(--hair)",
                background: data.zone === z.k ? "#000" : "#fff",
                color: data.zone === z.k ? "#fff" : "#000",
                fontSize: 13.5,
                fontWeight: data.zone === z.k ? 700 : 400,
                transition: "all .15s",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {z.label || z.k}
            </button>
          ))}
        </div>
      </div>
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
            <label className="meta" style={{ display: "block", marginBottom: 4 }}>{T.fIg} *</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", color: "rgba(0,0,0,0.4)", fontSize: 18, pointerEvents: "none" }}>@</span>
              <input
                className="field"
                value={data.contact.ig}
                onChange={e => update("ig", e.target.value.replace(/^@/, ""))}
                placeholder="tuusuario"
                style={{ paddingLeft: 18 }}
              />
            </div>
          </div>
          <div>
            <label className="meta" style={{ display: "block", marginBottom: 4 }}>{T.fNotes}</label>
            <textarea className="field" value={data.contact.notes || ""} onChange={e => update("notes", e.target.value)} rows={3} placeholder={T.fNotesPlaceholder} />
          </div>
        </div>
        <Summary data={data} T={T} />
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
          <button className="btn btn-dark" onClick={() => setRoute("home")}>{T.thanksHome}</button>
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
    { k: "No lo tengo claro",  d: "Te ayudamos a encontrar el estilo",      img: "assets/styles/notclear.jpg" },
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
  zoneGroupHead: "Cabeza y cuello",
  zoneGroupTorso: "Torso",
  zoneGroupArms: "Brazos",
  zoneGroupLegs: "Piernas",
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
  fName: "Nombre", fIg: "Instagram",
  fNotes: "Algo extra o comentario (opcional)", fNotesPlaceholder: "Zona específica, restricciones, dudas...",
  fEmail: "Email", fPhone: "Teléfono / WhatsApp",
  summary: "Resumen",
  sumFirst: "Primer tatuaje", sumStyle: "Estilo", sumSize: "Tamaño",
  sumZone: "Zona", sumDesign: "Diseño", sumRefs: "Referencias",
  sumArtist: "Artista", sumDates: "Fechas",
  files: "archivo(s)",
  thanksA: "Recibimos",
  thanksB: "tu solicitud.",
  thanksBody: "Ya recibimos todos tus datos y te vamos a estar contactando dentro de las próximas 48hs.",
  thanksTime: "",
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
  zoneGroupHead: "Head & neck",
  zoneGroupTorso: "Torso",
  zoneGroupArms: "Arms",
  zoneGroupLegs: "Legs",
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
  fName: "Name", fIg: "Instagram",
  fNotes: "Anything else? (optional)", fNotesPlaceholder: "Specific area, restrictions, questions...",
  fEmail: "Email", fPhone: "Phone / WhatsApp",
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
