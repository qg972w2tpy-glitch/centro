// Tattoo page — hero, CTAs, resident artists, Google review, aftercare
const TATTOO_ARTISTS = [
  { k: "panchogattoni", name: "Francisco Gattoni",    role: "Resident", styles: "Tradicional · Blackwork",  img: "assets/artists/pancho.jpg",    ig: "panchogattoni" },
  { k: "inksomnio",     name: "Agustina Cistaro",     role: "Resident", styles: "Fine line · Ornamental",   img: "assets/artists/inksomnio.jpg", ig: "inksomnio" },
  { k: "mutar",         name: "Katja Sol Müller",     role: "Resident", styles: "Fine line · Ornamental",   img: "assets/artists/mutar.jpg",     ig: "mutar" },
  { k: "coti",          name: "Constanza Rossi",      role: "Resident", styles: "Ilustrativo",              img: "assets/artists/coti.jpg",      ig: "coti" },
  { k: "milepokes",     name: "Milena Presta",        role: "Resident", styles: "Handpoke · Ilustrativo",   img: "assets/artists/mile.jpg",      ig: "milepokes" },
  { k: "guadatatua",    name: "Guadalupe Barrientos", role: "Resident", styles: "Tradicional",              img: "assets/artists/guada.jpg",     ig: "guadatatua" },
  { k: "maxis.sb",      name: "Maxi SB",              role: "Resident", styles: "Lettering · Fine line",    img: "assets/artists/maxi.jpg",      ig: "maxis.sb" },
  { k: "fiebre",        name: "Nazareno González",    role: "Resident", styles: "Blackwork · Ilustrativo",  img: "assets/artists/naza.jpg",      ig: "fiebre" },
  { k: "nella369",      name: "Agustín Nella",        role: "Resident", styles: "Gótico · Tribal",          img: "assets/artists/nella.jpg",     ig: "nella369" },
  { k: "sufrodeamor",   name: "Camila Piña",          role: "Resident", styles: "Fine line · Ornamental",   img: "assets/artists/cami.jpg",      ig: "sufrodeamor" },
  { k: "c4talina",      name: "Catalina León",        role: "Resident", styles: "Blackwork",                img: "assets/artists/cata.jpg",      ig: "c4talina" },
  { k: "facundo.void",  name: "Facundo",              role: "Resident", styles: "Fine line · Dotwork",      img: "assets/artists/facu.jpg",      ig: "facundo.void" },
];

// deterministic rotation — no Math.random on render
const POLROT = [1.4, -0.9, 2.2, -1.6, 0.8, -2.1, 1.9, -1.2, 2.5, -0.6, 1.7, -1.8];

function ArtistPolaroid({ artist, idx, setRoute }) {
  const [hov, setHov] = React.useState(false);
  const rot = POLROT[idx % POLROT.length];
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#fff",
        padding: "10px 10px 52px",
        boxShadow: hov
          ? "0 20px 48px rgba(0,0,0,0.22), 0 6px 16px rgba(0,0,0,0.12)"
          : "0 4px 18px rgba(0,0,0,0.13), 0 1px 4px rgba(0,0,0,0.07)",
        transform: hov ? "rotate(0deg) translateY(-8px) scale(1.02)" : `rotate(${rot}deg)`,
        transition: "transform .28s cubic-bezier(.2,.8,.2,1), box-shadow .28s ease",
        position: "relative",
        cursor: "pointer",
      }}
      onClick={() => setRoute("quote")}
    >
      <div style={{ aspectRatio: "3/4", overflow: "hidden", background: "#f0ebe0" }}>
        <img
          src={artist.img}
          alt={artist.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          onError={e => { e.target.style.opacity = "0"; }}
        />
      </div>
      <div style={{
        position: "absolute",
        bottom: 10, left: 10, right: 10,
        textAlign: "center",
      }}>
        <div style={{ fontWeight: 700, fontSize: 12.5, letterSpacing: "-0.01em", marginBottom: 2 }}>
          {artist.name}
        </div>
        <div style={{ fontSize: 9.5, color: "rgba(0,0,0,0.45)", fontFamily: "var(--mono)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
          {artist.styles}
        </div>
        <a
          href={`https://instagram.com/${artist.ig}`}
          target="_blank"
          rel="noopener"
          onClick={e => e.stopPropagation()}
          style={{ fontSize: 9.5, color: "rgba(0,0,0,0.45)", fontFamily: "var(--mono)", textDecoration: "none" }}
          onMouseEnter={e => e.currentTarget.style.color = "#000"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(0,0,0,0.45)"}
        >
          @{artist.ig} ↗
        </a>
      </div>
    </div>
  );
}

function TattooHero({ setRoute, T }) {
  const [slide, setSlide] = React.useState(0);

  const slides = [
    { title: T.slide1, sub: T.slide1sub },
    { title: T.slide2, sub: T.slide2sub },
    { title: T.slide3, sub: T.slide3sub },
  ];

  React.useEffect(() => {
    const id = setInterval(() => setSlide(s => (s + 1) % slides.length), 4200);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      position: "relative",
      height: "100vh",
      minHeight: 540,
      background: "#0c0c0c",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
    }}>
      {/* Textural background */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "radial-gradient(ellipse at 30% 60%, #1a1208 0%, #0c0c0c 60%)",
      }} />
      <div style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(255,255,255,0.018) 79px,rgba(255,255,255,0.018) 80px),repeating-linear-gradient(90deg,transparent,transparent 79px,rgba(255,255,255,0.018) 79px,rgba(255,255,255,0.018) 80px)",
      }} />

      {/* Slide indicators */}
      <div style={{ position: "absolute", top: 88, right: 28, zIndex: 10, display: "flex", gap: 6 }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            style={{
              width: i === slide ? 22 : 8, height: 2,
              background: i === slide ? "#fff" : "rgba(255,255,255,0.28)",
              transition: "all .4s",
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Slide content */}
      <div className="container" style={{ position: "relative", zIndex: 10, paddingBottom: "clamp(44px, 8vh, 96px)" }}>
        <div className="meta" style={{ color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>
          [ Centro Studio · {T.kicker} ]
        </div>

        {slides.map((s, i) => (
          <div
            key={i}
            style={{
              display: i === slide ? "block" : "none",
              animation: i === slide ? "ttHeroIn .5s cubic-bezier(.2,.8,.2,1) both" : "none",
            }}
          >
            <h1 className="display" style={{
              fontSize: "clamp(52px, 11vw, 168px)",
              margin: "0 0 14px",
              color: "#fff",
              lineHeight: 0.88,
            }}>
              {s.title}
            </h1>
            <p style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "clamp(11px, 1.4vw, 14px)",
              margin: "0 0 36px",
              fontFamily: "var(--mono)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}>
              — {s.sub}
            </p>
          </div>
        ))}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={() => setRoute("quote")}
            className="btn"
            style={{ background: "#fff", color: "#000", borderColor: "#fff", fontSize: 12.5 }}
          >
            {T.ctaQuote}
          </button>
          <button
            onClick={() => {
              const el = document.getElementById("artists");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="btn"
            style={{ color: "#fff", borderColor: "rgba(255,255,255,0.35)", background: "transparent", fontSize: 12.5 }}
          >
            {T.artistsTitle} ↓
          </button>
        </div>
      </div>

      <style>{`
        @keyframes ttHeroIn {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function TattooCTAs({ setRoute, T }) {
  const items = [
    {
      num: "01",
      title: T.ctaQuote,
      sub: T.ctaQuoteSub,
      dark: true,
      action: () => setRoute("quote"),
    },
    {
      num: "02",
      title: T.ctaGuest,
      sub: T.ctaGuestSub,
      dark: false,
      action: () => setRoute("guest"),
    },
    {
      num: "03",
      title: T.ctaAftercare,
      sub: T.ctaAftercareSub,
      dark: false,
      action: () => {
        const el = document.getElementById("aftercare");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      },
    },
  ];

  return (
    <div className="container" style={{ paddingTop: 72, paddingBottom: 72 }}>
      <div style={{ borderTop: "2px solid #000", paddingTop: 48 }}>
        <span className="meta" style={{ display: "block", marginBottom: 28 }}>[ {T.kicker} ]</span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
          {items.map(item => (
            <button
              key={item.num}
              onClick={item.action}
              style={{
                padding: "28px 24px",
                border: "1.5px solid #000",
                textAlign: "left",
                cursor: "pointer",
                background: item.dark ? "#000" : "#fff",
                color: item.dark ? "#fff" : "#000",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                transition: "all .2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = item.dark ? "#111" : "#F4F2EE";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = item.dark ? "#000" : "#fff";
              }}
            >
              <span className="meta" style={{ color: item.dark ? "rgba(255,255,255,0.4)" : undefined }}>
                [ {item.num} ]
              </span>
              <span className="display" style={{
                fontSize: "clamp(18px, 2.2vw, 26px)",
                color: item.dark ? "#fff" : "#000",
                lineHeight: 1.0,
              }}>
                {item.title}
              </span>
              <span style={{ fontSize: 13, color: item.dark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)", marginTop: 2, lineHeight: 1.45 }}>
                {item.sub}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TattooArtists({ setRoute, T }) {
  return (
    <div id="artists" style={{ background: "var(--warm)", paddingTop: 72, paddingBottom: 96 }}>
      <div className="container">
        <div style={{ marginBottom: 56 }}>
          <span className="meta" style={{ display: "block", marginBottom: 16 }}>[ {T.artistsTitle} ]</span>
          <h2 className="display" style={{ fontSize: "clamp(36px, 7vw, 96px)", margin: "0 0 20px", lineHeight: 0.9 }}>
            Residentes
          </h2>
          <p style={{ fontSize: 15, maxWidth: 460, color: "rgba(0,0,0,0.6)", lineHeight: 1.6, margin: 0 }}>
            {T.artistsIntro}
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))",
          gap: "48px 20px",
          alignItems: "start",
          paddingTop: 32,
        }}>
          {TATTOO_ARTISTS.map((a, i) => (
            <ArtistPolaroid key={a.k} artist={a} idx={i} setRoute={setRoute} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TattooGoogleCTA({ T }) {
  return (
    <div className="container" style={{ paddingTop: 72, paddingBottom: 72 }}>
      <div style={{ borderTop: "2px solid #000", paddingTop: 56 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 40,
          alignItems: "center",
        }} className="gcta-grid">
          <div>
            <span className="meta" style={{ display: "block", marginBottom: 16 }}>[ Google Maps ]</span>
            <h2 className="display" style={{ fontSize: "clamp(26px, 3.8vw, 52px)", margin: "0 0 16px", lineHeight: 1.0 }}>
              {T.googleTitle}
            </h2>
            <p style={{ fontSize: 15, maxWidth: 460, color: "rgba(0,0,0,0.6)", lineHeight: 1.6, margin: "0 0 28px" }}>
              {T.googleBody}
            </p>
            <a
              href="https://maps.google.com/?q=Av.+Cordoba+857,+Retiro,+CABA,+Argentina"
              target="_blank"
              rel="noopener"
              className="btn btn-dark"
              style={{ display: "inline-flex", fontSize: 12.5, letterSpacing: "0.06em" }}
            >
              {T.googleCta} ↗
            </a>
          </div>
          <div style={{ textAlign: "center", paddingRight: 8 }}>
            <div style={{ display: "flex", gap: 3, justifyContent: "center", marginBottom: 8 }}>
              {[1,2,3,4,5].map(s => (
                <span key={s} style={{ fontSize: 20, color: "#000", lineHeight: 1 }}>★</span>
              ))}
            </div>
            <div className="display" style={{ fontSize: 48, lineHeight: 1, margin: "4px 0" }}>5.0</div>
            <div className="meta" style={{ fontSize: 9.5 }}>Google</div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:680px){.gcta-grid{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}

function TattooAftercare({ T, lang }) {
  const phases = lang === "en"
    ? [
        { n: "01", phase: "Before your session",  tips: ["Hydrate the area well in the days before.", "Avoid alcohol 24h prior.", "Sleep well. You'll handle it better.", "Send your reference images in advance."] },
        { n: "02", phase: "Session day",           tips: ["Eat a good meal before coming.", "Wear comfortable clothing that gives access to the area.", "Music or silence — whatever helps you relax.", "Bring snacks for long sessions."] },
        { n: "03", phase: "First few days",        tips: ["Wash with neutral soap twice a day.", "Apply unscented cream (bepanthen or similar).", "Don't wrap with plastic longer than needed.", "Keep out of direct sunlight."] },
        { n: "04", phase: "Healing process",       tips: ["Don't scratch or pick the scabs.", "The tattoo may look dull during this phase.", "Avoid pools and sea until it seals.", "Full healing takes 4–6 weeks."] },
      ]
    : [
        { n: "01", phase: "Antes del turno",    tips: ["Hidratá bien la zona los días previos.", "No tomes alcohol las 24h anteriores.", "Dormí bien. Vas a estar más tranquilo/a.", "Si tenés diseño propio, envialo antes."] },
        { n: "02", phase: "El día del turno",   tips: ["Comé bien antes de venir.", "Usá ropa cómoda que dé acceso a la zona.", "Música o silencio — lo que te ayude a relajarte.", "Podés traer snacks si es sesión larga."] },
        { n: "03", phase: "Los primeros días",  tips: ["Lavá con jabón neutro 2 veces por día.", "Aplicá crema sin perfume (bepanthen o similar).", "No cubras con plástico más de lo necesario.", "Evitá el sol directo."] },
        { n: "04", phase: "La cicatrización",   tips: ["No rasques ni arranques las costras.", "El tatuaje puede verse opaco en esta fase.", "Evitá pileta y mar hasta que cierre.", "La cicatrización completa toma 4–6 semanas."] },
      ];

  return (
    <div id="aftercare" style={{ background: "#0c0c0c", color: "#fff", paddingTop: 72, paddingBottom: 96 }}>
      <div className="container">
        <span className="meta" style={{ color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 16 }}>
          [ {T.aftercareTitle} ]
        </span>
        <h2 className="display" style={{ fontSize: "clamp(36px, 7vw, 96px)", margin: "0 0 48px", color: "#fff", lineHeight: 0.9 }}>
          {T.aftercareTitle}
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 40,
          borderTop: "1px solid rgba(255,255,255,0.12)",
          paddingTop: 48,
        }}>
          {phases.map(item => (
            <div key={item.n}>
              <div className="meta" style={{ color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>[ {item.n} ]</div>
              <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 16, color: "#fff" }}>{item.phase}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 9 }}>
                {item.tips.map((tip, i) => (
                  <li key={i} style={{
                    fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.55,
                    paddingLeft: 16, position: "relative",
                  }}>
                    <span style={{ position: "absolute", left: 0, opacity: 0.38 }}>—</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TattooPage({ setRoute }) {
  const { t, lang } = useI18n();
  const T = t.tattoo;

  return (
    <div style={{ paddingTop: 64 }}>
      <TattooHero setRoute={setRoute} T={T} />
      <TattooCTAs setRoute={setRoute} T={T} />
      <TattooArtists setRoute={setRoute} T={T} />
      <TattooGoogleCTA T={T} />
      <TattooAftercare T={T} lang={lang} />
    </div>
  );
}

Object.assign(window, { TattooPage });
