// App entry — routing, i18n provider, tweaks
const { useState: useStateApp, useEffect: useEffectApp, useMemo: useMemoApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "intensity": "high",
  "displayWeight": "black",
  "displayItalic": "italic",
  "uiFont": "helvetica",
  "imageMode": "warm",
  "accent": "neutral"
}/*EDITMODE-END*/;

function App() {
  const [lang, setLang] = useStateApp("es");
  const [route, setRouteRaw] = useStateApp("home");
  const [subroute, setSubroute] = useStateApp("about");
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Time
  const [time, setTime] = useStateApp(() => new Date());
  useEffectApp(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const tStr = time.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Argentina/Buenos_Aires" });

  const setRoute = (r) => {
    setRouteRaw(r);
    if (r === "info") setSubroute("about");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const t = I18N[lang];
  const ctx = { lang, t, setLang };

  // Apply tweaks
  useEffectApp(() => {
    const root = document.documentElement;
    const helvStack = '"Helvetica Neue", Helvetica, "Arial", sans-serif';
    const uiMap = {
      "helvetica": helvStack,
      "mono": '"JetBrains Mono", "Courier New", monospace',
    };
    const weightMap = { "black": 900, "bold": 700, "medium": 500, "light": 300 };
    root.style.setProperty("--display", helvStack);
    root.style.setProperty("--sans", uiMap[tweaks.uiFont] || helvStack);
    root.style.setProperty("--display-weight", weightMap[tweaks.displayWeight] || 900);
    root.style.setProperty("--display-style", tweaks.displayItalic === "italic" ? "normal" : "normal");

    // Image mode
    const warmMap = {
      "warm": "#F4F2EE",
      "cool": "#EFEFEF",
      "mono": "#F2F2F2",
      "deep": "#1A1A1A",
    };
    root.style.setProperty("--warm", warmMap[tweaks.imageMode] || warmMap["warm"]);

    // Accent
    const accentMap = {
      "neutral": "#000000",
      "rust": "#A8331E",
      "lime": "#9CB31A",
      "ink": "#1A2A6B",
    };
    root.style.setProperty("--accent", accentMap[tweaks.accent] || "#000000");
  }, [tweaks]);

  // Inject extra fonts on demand
  useEffectApp(() => {
    const id = "extra-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=DM+Serif+Display:ital@0;1&family=Space+Grotesk:wght@300;400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);

  // Page render
  let page = null;
  switch (route) {
    case "home": page = <HomePage setRoute={setRoute} intensity={tweaks.intensity} imagery={tweaks.imageMode} />; break;
    case "blog": page = <BlogPage />; break;
    case "quote": page = <Wizard setRoute={setRoute} />; break;
    case "guest": page = <GuestPage />; break;
    case "store": page = <StorePage />; break;
    case "workshops": page = <WorkshopsPage />; break;
    case "gallery": page = <GalleryPage />; break;
    case "events": page = <EventsPage />; break;
    case "giftcard": page = <GiftcardPage />; break;
    case "info": page = <InfoPage subroute={subroute} setSubroute={setSubroute} />; break;
    default: page = <HomePage setRoute={setRoute} intensity={tweaks.intensity} imagery={tweaks.imageMode} />;
  }

  return (
    <I18nContext.Provider value={ctx}>
      <Navbar route={route} setRoute={setRoute} time={tStr} intensity={tweaks.intensity} />
      <main key={route} data-screen-label={route}>
        {page}
      </main>
      <Footer setRoute={setRoute} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Sistema gráfico" />
        <TweakRadio
          label="Asteriscos"
          value={tweaks.intensity}
          onChange={(v) => setTweak("intensity", v)}
          options={["low", "med", "high"]}
        />

        <TweakSection label="Tipografía — Helvetica" />
        <TweakRadio
          label="Display weight"
          value={tweaks.displayWeight}
          onChange={(v) => setTweak("displayWeight", v)}
          options={["light", "medium", "bold", "black"]}
        />
        <TweakRadio
          label="UI font"
          value={tweaks.uiFont}
          onChange={(v) => setTweak("uiFont", v)}
          options={["helvetica", "mono"]}
        />

        <TweakSection label="Imágenes" />
        <TweakRadio
          label="Tono"
          value={tweaks.imageMode}
          onChange={(v) => setTweak("imageMode", v)}
          options={["warm", "cool", "mono", "deep"]}
        />

        <TweakSection label="Acento" />
        <TweakRadio
          label="Color"
          value={tweaks.accent}
          onChange={(v) => setTweak("accent", v)}
          options={["neutral", "rust", "lime", "ink"]}
        />
      </TweaksPanel>
    </I18nContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
