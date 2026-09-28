// Wizard: 9-step tattoo quote
const { useState: useStateW, useRef: useRefW } = React;

// WhatsApp al que llegan las cotizaciones (+54 9 11 7294-3420)
const WPP_QUOTE = "5491172943420";
const wppChatUrl = (text) => `https://wa.me/${WPP_QUOTE}?text=${encodeURIComponent(text)}`;
const copyText = (text) => {
  try { if (navigator.clipboard) navigator.clipboard.writeText(text); } catch (_) {}
};
/* Pasa un teléfono escrito a mano al formato que necesita wa.me.
   Si viene con + o 00 se respeta el país; si no, se asume Argentina. */
const normalizeWpp = (raw) => {
  if (!raw) return null;
  const s = String(raw).trim();
  const intl = s.startsWith("+") || s.startsWith("00");
  let d = s.replace(/\D/g, "").replace(/^00/, "");
  if (!d) return null;
  if (d.startsWith("54")) {
    let rest = d.slice(2).replace(/^0/, "");
    if (!rest.startsWith("9")) rest = "9" + rest;   // móviles argentinos llevan 9
    d = "54" + rest;
  } else if (!intl) {
    d = "549" + d.replace(/^0/, "");
  }
  return d.length >= 10 ? d : null;
};

/* En la compu el compartir del sistema abre el panel de macOS/Windows
   (AirDrop, Mail, Mensajes) donde WhatsApp normalmente no figura: no sirve.
   Ahí conviene wa.me, que abre WhatsApp Web con el chat y el texto ya puestos. */
const isTouchDevice = () => {
  try {
    return window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 1;
  } catch (_) { return false; }
};

// navigator.canShare({files}) no existe en todos los navegadores
const canShareFiles = (files) => {
  try {
    return files.length > 0 && isTouchDevice() &&
      !!navigator.canShare && navigator.canShare({ files });
  } catch (_) { return false; }
};

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
    contact: { name: "", ig: "", wpp: "", notes: "" },
  });
  const [sent, setSent] = useStateW(null);
  const backupSent = useRefW(false);   // el respaldo se manda una sola vez

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

  const buildWppText = () => {
    const L = [];
    L.push("*COTIZACIÓN DE TATUAJE — CENTRO STUDIO*");
    L.push("");
    L.push(`*Nombre:* ${data.contact.name}`);
    L.push(`*Instagram:* @${data.contact.ig}`);
    if (data.contact.wpp) L.push(`*WhatsApp:* ${data.contact.wpp}`);
    L.push("");
    L.push(`*Primer tatuaje:* ${data.first === null ? "—" : (data.first ? "Sí" : "No")}`);
    L.push(`*Estilo:* ${data.style || "—"}`);
    L.push(`*Zona:* ${data.zone || "—"}`);
    L.push(`*Tamaño:* ${data.size || "—"}`);
    L.push(`*Diseño:* ${data.hasDesign || "—"}`);
    L.push(`*Artista:* ${data.artist || "—"}`);
    L.push(`*Fechas:* ${data.dates.from || "—"}${data.dates.to ? " → " + data.dates.to : ""}`);
    if (data.contact.notes) {
      L.push("");
      L.push(`*Notas:* ${data.contact.notes}`);
    }
    L.push("");
    L.push(data.refs.length
      ? `*Referencias:* ${data.refs.length} imagen(es).`
      : "*Referencias:* sin imágenes.");
    return L.join("\n");
  };

  const quoteFiles = () => data.refs.map(r => r.file).filter(Boolean);

  /* Copia de respaldo por mail. Va en silencio: si la persona no llega a
     tocar enviar en WhatsApp, la consulta igual queda registrada. */
  const sendBackupEmail = async (files) => {
    try {
      const num = normalizeWpp(data.contact.wpp);
      const cuerpo = buildWppText().replace(/\*/g, "") +
        "\n\n── Responder ──\n" +
        (num
          ? "WhatsApp: https://wa.me/" + num + "?text=" +
            encodeURIComponent(`Hola ${data.contact.name}! Te escribimos de Centro Studio por tu cotización.`) + "\n"
          : "WhatsApp: no dejó número\n") +
        "Instagram: https://instagram.com/" + data.contact.ig + "\n";

      const attachments = (await Promise.all(files.map(f => new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve({ name: f.name, data: String(reader.result).split(",")[1] });
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(f);
      })))).filter(Boolean);

      await fetch("/api/send-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `Cotización — ${data.contact.name} (@${data.contact.ig})`,
          text: cuerpo,
          attachments,
        }),
      });
    } catch (_) { /* el respaldo nunca interrumpe el envío por WhatsApp */ }
  };

  /* Enviar por WhatsApp.
     wa.me preselecciona el contacto pero NO admite adjuntos; el compartir
     nativo manda texto + imágenes juntas pero el contacto lo elige la
     persona. Usamos el segundo cuando hay imágenes, el primero cuando no. */
  const submit = () => {
    if (!canSubmit || sending) return;

    const text = buildWppText();
    const files = quoteFiles();

    // Al compartir imágenes WhatsApp a veces descarta el texto:
    // lo dejamos copiado para poder pegarlo.
    copyText(text);

    // Respaldo en segundo plano — sin await: navigator.share tiene que
    // llamarse dentro del gesto del usuario. Una sola vez aunque se
    // cancele el compartir y se vuelva a tocar el botón.
    if (!backupSent.current) {
      backupSent.current = true;
      sendBackupEmail(files);
    }

    if (!canShareFiles(files)) {
      window.open(wppChatUrl(text), "_blank", "noopener");
      setSent({ mode: "chat", text, files });
      return;
    }

    // Algunos navegadores comparten archivos pero rechazan texto+archivos juntos
    let payload = { files };
    try { if (navigator.canShare({ files, text })) payload = { files, text }; } catch (_) {}

    // navigator.share tiene que llamarse dentro del gesto, sin await previo
    setSending(true);
    navigator.share(payload)
      .then(() => setSent({ mode: "shared", text, files }))
      .catch((err) => {
        if (err && err.name === "AbortError") return;   // canceló: sigue en el form
        setSent({ mode: "manual", text, files });
      })
      .finally(() => setSending(false));
  };

  const setAndAdvance = (k, v) => {
    setData(d => ({ ...d, [k]: v }));
    if (step < total - 1) {
      setTimeout(() => setStep(s => s + 1), 280);
    }
  };

  if (sent) return <WizardDone setRoute={setRoute} T={T} data={data} sent={sent} />;

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
          {step === 3 && <Step03Range data={data} set={set} T={T} />}
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
          const noImg = s.img === "/assets/styles/notclear.jpg";
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

function Step03Range({ data, set, T }) {
  const MIN = 2, MAX = 60;
  const [minVal, setMinVal] = React.useState(5);
  const [maxVal, setMaxVal] = React.useState(20);
  const minRef = React.useRef(5);
  const maxRef = React.useRef(20);
  const trackRef = React.useRef(null);

  const setMin = (v) => { minRef.current = v; setMinVal(v); };
  const setMax = (v) => { maxRef.current = v; setMaxVal(v); };

  React.useEffect(() => { set("size", `${minVal} a ${maxVal} cm`); }, [minVal, maxVal]);
  React.useEffect(() => { set("size", `${minRef.current} a ${maxRef.current} cm`); }, []);

  const getVal = (e) => {
    const track = trackRef.current;
    if (!track) return MIN;
    const rect = track.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(MIN + ratio * (MAX - MIN));
  };

  const startDrag = (handle) => (eDown) => {
    eDown.preventDefault();
    const onMove = (e) => {
      const val = getVal(e);
      if (handle === "min") setMin(Math.max(MIN, Math.min(val, maxRef.current - 1)));
      else setMax(Math.min(MAX, Math.max(val, minRef.current + 1)));
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
  };

  const minPct = ((minVal - MIN) / (MAX - MIN)) * 100;
  const maxPct = ((maxVal - MIN) / (MAX - MIN)) * 100;

  const thumbStyle = {
    position: "absolute",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: 24, height: 24,
    border: "2px solid #000",
    background: "#fff",
    cursor: "ew-resize",
    touchAction: "none",
    zIndex: 2,
    boxShadow: "0 1px 6px rgba(0,0,0,0.15)",
  };

  return (
    <div>
      <StepHeader num="03" q={T.q3} sub={T.q3sub} />
      <div style={{ maxWidth: 540 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 52 }}>
          <span className="display" style={{ fontSize: 72, lineHeight: 1 }}>{minVal}</span>
          <span className="display" style={{ fontSize: 32, opacity: 0.35, lineHeight: 1 }}>a</span>
          <span className="display" style={{ fontSize: 72, lineHeight: 1 }}>{maxVal}</span>
          <span className="display" style={{ fontSize: 26, opacity: 0.45, lineHeight: 1 }}>cm</span>
        </div>

        <div style={{ padding: "0 12px" }}>
          <div ref={trackRef} style={{ position: "relative", height: 2, background: "var(--hair-strong)" }}>
            <div style={{
              position: "absolute",
              left: `${minPct}%`,
              width: `${maxPct - minPct}%`,
              height: "100%",
              background: "#000",
            }} />
            <div onMouseDown={startDrag("min")} onTouchStart={startDrag("min")}
              style={{ ...thumbStyle, left: `${minPct}%` }} />
            <div onMouseDown={startDrag("max")} onTouchStart={startDrag("max")}
              style={{ ...thumbStyle, left: `${maxPct}%` }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            <span className="meta">{MIN} cm</span>
            <span className="meta">{MAX} cm</span>
          </div>
        </div>

        <div style={{ marginTop: 36, fontSize: 13, color: "var(--muted)", padding: "12px 16px", background: "var(--warm)", lineHeight: 1.5 }}>
          Arrastrá los extremos para definir un rango de tamaño.
        </div>
      </div>
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
      file: f,                       // necesario para compartir por WhatsApp
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
  const [profile, setProfile] = React.useState(null);
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
                <div style={{ fontWeight: 600, fontSize: 16, marginTop: 4 }}>{artist.ig || artist.k}</div>
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
                {!away && (
                  <span
                    role="button"
                    tabIndex={0}
                    className="mono wz-profile"
                    onClick={(e) => { e.stopPropagation(); setProfile(a); }}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); setProfile(a); } }}
                    style={{
                      position: "absolute", top: 8, right: 8,
                      background: "rgba(0,0,0,0.72)", color: "#fff",
                      padding: "5px 9px", fontSize: 9.5, letterSpacing: "0.08em",
                      cursor: "pointer", zIndex: 3,
                    }}>
                    VER PERFIL
                  </span>
                )}
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
                <div style={{ fontWeight: 600, fontSize: 15, marginTop: 4 }}>{a.ig || a.k}</div>
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

      {profile && (
        <ArtistModal
          artist={profile}
          onClose={() => setProfile(null)}
          primaryLabel={`Elegir a ${(profile.sub || profile.k).split(" ")[0]}`}
          onPrimary={() => { setProfile(null); setAndAdvance("artist", profile.k); }}
        />
      )}
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
            <label className="meta" style={{ display: "block", marginBottom: 4 }}>{T.fWpp}</label>
            <input
              className="field"
              type="tel"
              inputMode="tel"
              value={data.contact.wpp || ""}
              onChange={e => update("wpp", e.target.value)}
              placeholder={T.fWppPlaceholder}
            />
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

function WizardDone({ setRoute, T, data, sent }) {
  const { mode, text, files } = sent;
  const shareable = canShareFiles(files);
  const pendientes = mode !== "shared" && files.length > 0;
  const [copiado, setCopiado] = useStateW(false);

  const shareImgs = () => {
    if (!shareable) return;
    navigator.share({ files }).catch(() => {});
  };
  const abrirChat = () => window.open(wppChatUrl(text), "_blank", "noopener");
  const copiar = () => { copyText(text); setCopiado(true); setTimeout(() => setCopiado(false), 2200); };

  return (
    <div className="page-fade" style={{ paddingTop: 64, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="container" style={{ textAlign: "center", maxWidth: 560, padding: "56px 24px" }}>
        <Asterisk size={48} spin />
        <h1 className="display" style={{ fontSize: "clamp(40px, 6vw, 72px)", margin: "26px 0 14px", lineHeight: 1 }}>
          <em>{T.waTitleA}</em><br/>{T.waTitleB}
        </h1>

        <p style={{ fontSize: 16.5, lineHeight: 1.55, color: "rgba(0,0,0,0.75)", margin: "0 auto 26px" }}>
          {mode === "shared" ? T.waBodyShared
            : mode === "manual" ? T.waBodyManual
            : T.waBodyChat}
        </p>

        {/* Acción principal */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {mode === "shared" ? (
            <button className="btn btn-ghost" onClick={abrirChat}>{T.waOpenChat}</button>
          ) : (
            <button className="btn btn-dark" onClick={abrirChat}>{T.waOpenChat}</button>
          )}
          <button className="btn btn-ghost" onClick={copiar}>
            {copiado ? T.waCopied : T.waCopy}
          </button>
        </div>

        {/* Imágenes que todavía hay que adjuntar */}
        {pendientes && (
          <div style={{ marginTop: 34, paddingTop: 26, borderTop: "1px solid var(--hair)" }}>
            <div className="meta" style={{ marginBottom: 14 }}>
              [ {files.length} {files.length === 1 ? T.waOneRef : T.waManyRefs} ]
            </div>
            <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--muted)", margin: "0 0 18px" }}>
              {shareable ? T.waAttachShare : T.waAttachManual}
            </p>

            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
              {data.refs.map((r, i) => (
                <div key={i} style={{ width: 62, height: 62, overflow: "hidden", background: "var(--warm)", border: "1px solid var(--hair)" }}>
                  <img src={r.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              ))}
            </div>

            {shareable ? (
              <button className="btn btn-dark" onClick={shareImgs}>{T.waShareImgs}</button>
            ) : (
              <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                {data.refs.map((r, i) => (
                  <a key={i} className="btn btn-ghost" href={r.url} download={r.name}
                    style={{ textDecoration: "none", fontSize: 11.5, padding: "9px 12px" }}>
                    ↓ {i + 1}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: 34 }}>
          <button className="btn btn-ghost" onClick={() => setRoute("home")}>{T.thanksHome}</button>
        </div>
      </div>
    </div>
  );
}

const wzES = {
  title: "Cotizá un tatuaje",
  h1a: "Contanos",
  h1b: "tu idea",
  back: "Atrás", next: "Siguiente", skip: "Saltear", submit: "Enviar por WhatsApp",
  fWpp: "WhatsApp", fWppPlaceholder: "11 7294 3420 (sin 0 ni 15)",
  waTitleA: "Casi", waTitleB: "listo.",
  waBodyShared: "Se abrió WhatsApp con el mensaje y tus imágenes. Elegí el chat de Centro Studio y tocá enviar.",
  waBodyChat: "Te abrimos el chat de Centro Studio con todos tus datos cargados. Revisalo y tocá enviar.",
  waBodyManual: "Tocá el botón para abrir el chat de Centro Studio con todos tus datos cargados.",
  waOpenChat: "Abrir chat de Centro →",
  waCopy: "Copiar el mensaje", waCopied: "✓ Copiado",
  waOneRef: "referencia", waManyRefs: "referencias",
  waAttachShare: "WhatsApp no deja adjuntar imágenes desde un link. Tocá acá para mandarlas al mismo chat.",
  waAttachManual: "WhatsApp no deja adjuntar imágenes desde un link. Descargalas y adjuntalas en el chat.",
  waShareImgs: "Enviar las imágenes →",
  ready: "listo · podés avanzar", optional: "opcional · podés saltearlo",
  yes: "Sí", no: "No",
  q1: "¿Es tu primer tatuaje?",
  firstYes: "Te acompañamos en cada paso del proceso.",
  firstNo: "Buenísimo, vamos al grano.",
  q2: "¿Qué estilo te interesa?",
  q2sub: "Elegí uno. Si tenés dudas, en el paso 5 podés dejarlo abierto.",
  styles: [
    { k: "No lo tengo claro",  d: "Te ayudamos a encontrar el estilo",      img: "/assets/styles/notclear.jpg" },
    { k: "Fine line",          d: "Líneas finas, detalle delicado",        img: "/assets/styles/fineline.jpg" },
    { k: "Blackwork",          d: "Negro sólido, fuerte presencia",         img: "/assets/styles/blackwork.jpg" },
    { k: "Tradicional negro",  d: "Old school, paleta cerrada en negro",    img: "/assets/styles/tradicional-negro.jpg" },
    { k: "Tradicional color",  d: "Old school clásico con paleta a color",  img: "/assets/styles/tradicional-color.jpg" },
    { k: "Tribal / Ornamental", d: "Líneas decorativas, simbología",          img: "/assets/styles/tribal.jpg" },
    { k: "Lettering",          d: "Tipografía y caligrafía",                img: "/assets/styles/lettering.jpg" },
    { k: "Ilustrativo",        d: "Composición narrativa",                  img: "/assets/styles/ilustrativo.jpg" },
    { k: "Orgánico",           d: "Formas que acompañan la anatomía",       img: "/assets/styles/organico.jpg" },
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
    { k: "panchogattoni", role: "Resident", styles: "Tradicional blackwork",    img: "/assets/artists/pancho.jpg",     sub: "Francisco Gattoni" },
    { k: "inksomnio", ig: "inksomniottt",
      role: "Resident", styles: "Fineline / Ornamental",   img: "/assets/artists/inksomnio.jpg", sub: "Agustina Cistaro" },
    { k: "mutar", ig: "mutar_______",
      role: "Guest",    styles: "Fineline / Ornamental",   img: "/assets/artists/mutar.jpg",      sub: "Katja Sol Müller" },
    { k: "coti", ig: "cowgirlcoti",
      role: "Resident", styles: "Ilustrativo",              img: "/assets/artists/coti.jpg",       sub: "Constanza Rossi" },
    { k: "milepokes",     role: "Resident", styles: "Handpoke ilustrativo",     img: "/assets/artists/mile.jpg",       sub: "Milena Presta" },
    { k: "guadatatua",    role: "Resident", styles: "Tradicional",              img: "/assets/artists/guada.jpg",      sub: "Guadalupe Barrientos" },
    { k: "maxis.sb",      role: "Resident", styles: "Lettering · Fine line",    img: "/assets/artists/maxi.jpg" },
    { k: "fiebre", ig: "___fiebre",
      role: "Resident", styles: "Blackwork ilustrativo",    img: "/assets/artists/naza.jpg",       sub: "Nazareno González" },
    { k: "nella369",      role: "Resident", styles: "Gótico · Tribal",          img: "/assets/artists/nella.jpg",      sub: "Agustín Nella" },
    { k: "_cronico_",     role: "Resident", styles: "Orgánico · Ilustrativo",   img: "/assets/artists/cronico.jpg",    sub: "Nahuel Olivera" },
    { k: "skate.rat.tattoo", role: "Resident", styles: "Ilustrativo",           img: "/assets/artists/skaterat.jpg",   sub: "Gastón" },
    { k: "c4talina", ig: "c4talin4___",
      role: "Resident", styles: "Blackwork",                img: "/assets/artists/cata.jpg",       sub: "Catalina" },
    { k: "facundo.void",  role: "Resident", styles: "Fine line · Dotwork",      img: "/assets/artists/facu.jpg" },
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
  back: "Back", next: "Next", skip: "Skip", submit: "Send via WhatsApp",
  fWpp: "WhatsApp", fWppPlaceholder: "+54 11 7294 3420",
  waTitleA: "Almost", waTitleB: "there.",
  waBodyShared: "WhatsApp opened with your message and images. Pick the Centro Studio chat and hit send.",
  waBodyChat: "We opened the Centro Studio chat with all your details. Check it and hit send.",
  waBodyManual: "Tap the button to open the Centro Studio chat with all your details.",
  waOpenChat: "Open Centro chat →",
  waCopy: "Copy the message", waCopied: "✓ Copied",
  waOneRef: "reference", waManyRefs: "references",
  waAttachShare: "WhatsApp can't attach images from a link. Tap here to send them to the same chat.",
  waAttachManual: "WhatsApp can't attach images from a link. Download them and attach them in the chat.",
  waShareImgs: "Send the images →",
  ready: "ready · you can continue", optional: "optional · you can skip",
  yes: "Yes", no: "No",
  q1: "Is this your first tattoo?",
  firstYes: "We'll guide you through every step.",
  firstNo: "Great, let's get to it.",
  q2: "Which style are you into?",
  q2sub: "Pick one. If unsure, keep it open in step 5.",
  styles: [
    { k: "Fine line",           d: "Fine lines, delicate detail",           img: "/assets/styles/fineline.jpg" },
    { k: "Blackwork",           d: "Solid black, strong presence",           img: "/assets/styles/blackwork.jpg" },
    { k: "Tradicional negro",   d: "Old school, closed black palette",       img: "/assets/styles/tradicional-negro.jpg" },
    { k: "Tradicional color",   d: "Classic old school with full color",     img: "/assets/styles/tradicional-color.jpg" },
    { k: "Tribal / Ornamental", d: "Decorative lines, symbolism",            img: "/assets/styles/tribal.jpg" },
    { k: "Lettering",           d: "Typography and calligraphy",             img: "/assets/styles/lettering.jpg" },
    { k: "Ilustrativo",         d: "Narrative illustration",                 img: "/assets/styles/ilustrativo.jpg" },
    { k: "Orgánico",            d: "Forms that follow the anatomy",          img: "/assets/styles/organico.jpg" },
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
