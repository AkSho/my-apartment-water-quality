// lib/water-hardness-template.js
// Templates for /water-hardness/ index and /water-hardness/{slug} system pages.
// Consumed by api/water-hardness.js.

const fs = require("fs");
const path = require("path");

let _systemsCache = null;
function loadSystems() {
  if (_systemsCache) return _systemsCache;
  try {
    const filePath = path.join(process.cwd(), "data", "water-systems.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    _systemsCache = data.systems;
  } catch (err) {
    _systemsCache = [];
  }
  return _systemsCache;
}

const STATE_NAMES = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DC: "District of Columbia", DE: "Delaware",
  FL: "Florida", GA: "Georgia", HI: "Hawaii", IA: "Iowa", ID: "Idaho",
  IL: "Illinois", IN: "Indiana", KS: "Kansas", KY: "Kentucky", LA: "Louisiana",
  MA: "Massachusetts", MD: "Maryland", ME: "Maine", MI: "Michigan", MN: "Minnesota",
  MO: "Missouri", MS: "Mississippi", MT: "Montana", NC: "North Carolina",
  ND: "North Dakota", NE: "Nebraska", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NV: "Nevada", NY: "New York", OH: "Ohio", OK: "Oklahoma",
  OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VA: "Virginia",
  VT: "Vermont", WA: "Washington", WI: "Wisconsin", WV: "West Virginia", WY: "Wyoming"
};

function neighborParagraphHtml(system) {
  const allSystems = loadSystems();
  const candidates = allSystems.filter(s =>
    s.slug !== system.slug && s.confidence !== "system-level"
  );

  const sameState = candidates
    .filter(s => s.state === system.state)
    .sort((a, b) => b.display_ppm - a.display_ppm);

  const stateName = STATE_NAMES[system.state] || system.state;

  if (sameState.length >= 2) {
    const c1 = sameState[0];
    const c2 = sameState[1];
    return `<p>Elsewhere in ${escapeHtml(stateName)}, <a href="/water-hardness/${c1.slug}">${escapeHtml(c1.city)}</a> tests at ${valueDisplay(c1)} and <a href="/water-hardness/${c2.slug}">${escapeHtml(c2.city)}</a> at ${valueDisplay(c2)}.</p>`;
  }

  if (sameState.length === 1) {
    const c1 = sameState[0];
    return `<p>Elsewhere in ${escapeHtml(stateName)}, <a href="/water-hardness/${c1.slug}">${escapeHtml(c1.city)}</a> tests at ${valueDisplay(c1)}.</p>`;
  }

  const sorted = [...candidates].sort((a, b) => {
    const diffA = Math.abs(a.display_ppm - system.display_ppm);
    const diffB = Math.abs(b.display_ppm - system.display_ppm);
    if (diffA !== diffB) return diffA - diffB;
    return a.city.localeCompare(b.city);
  });

  const nearest = sorted[0];
  if (!nearest) return "";

  return `<p>For comparison, <a href="/water-hardness/${nearest.slug}">${escapeHtml(nearest.city)}, ${escapeHtml(nearest.state)}</a> sits in the same range at ${valueDisplay(nearest)}.</p>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function bandClass(band) {
  if (band === "Soft") return "soft";
  if (band === "Moderately hard") return "moderate";
  if (band === "Hard") return "hard";
  if (band === "Very hard") return "very-hard";
  // Compound bands: use the hardest component
  if (band.includes("Very hard")) return "very-hard";
  if (band.includes("Hard")) return "hard";
  if (band.includes("Moderately")) return "moderate";
  return "soft";
}

function markerPosition(ppm) {
  return Math.max(7, Math.min(93, (Math.min(ppm, 240) / 240) * 100));
}

function shouldShowCard(system) {
  // Published-bound records (system-level confidence) never get the card
  if (system.confidence === "system-level") return false;
  // Midpoint-based gating: card shows only if display_ppm >= 121 (USGS hard threshold)
  return system.display_ppm >= 121;
}

function productBandParam(band) {
  if (band.includes("Very hard")) return "veryhard";
  if (band.includes("Hard")) return "hard";
  return "";
}

function productUrl(band) {
  const param = productBandParam(band);
  var base = param
    ? `https://agsoftener.com/?band=${encodeURIComponent(param)}&xd=myapt`
    : "https://agsoftener.com/?xd=myapt";
  return base;
}

function valueDisplay(system) {
  // Show range only when display_ppm is a computed midpoint (no reported average)
  if (system.ppm_min && system.ppm_max && system.ppm_min !== system.ppm_max) {
    var mid = Math.round((system.ppm_min + system.ppm_max) / 2);
    if (system.display_ppm === mid && Math.abs(system.ppm_max - system.ppm_min) > 20) {
      return `${system.ppm_min} to ${system.ppm_max} ppm`;
    }
  }
  return `${system.display_ppm} ppm`;
}

function gaugeHtml(system) {
  return `
    <div class="gauge" aria-label="Water hardness gauge">
      <div class="gauge-marker" style="left:${markerPosition(system.display_ppm)}%">${system.display_ppm}</div>
      <div class="gauge-bar">
        <div class="gauge-band soft">Soft<br>0–60</div>
        <div class="gauge-band moderate">Moderately hard<br>61–120</div>
        <div class="gauge-band hard">Hard<br>121–180</div>
        <div class="gauge-band very-hard">Very hard<br>181+</div>
      </div>
    </div>
  `;
}

function midpointBand(ppm) {
  if (ppm <= 60) return "Soft";
  if (ppm <= 120) return "Moderately hard";
  if (ppm <= 180) return "Hard";
  return "Very hard";
}

function bandPhrase(band) {
  if (band.includes(" to ")) {
    return "in the " + band.toLowerCase() + " range";
  }
  return band.toLowerCase();
}

function bandMeaning(system) {
  const b = midpointBand(system.display_ppm);

  if (b === "Very hard") {
    return `<p>Above 180 ppm, minerals leave visible scale on fixtures, soap struggles to lather, and hair and skin carry a film that rinsing doesn't remove. This is the range where people notice hard water without being told.</p>`;
  }
  if (b === "Hard") {
    return `<p>Between 121 and 180 ppm, buildup shows up over weeks rather than days: spotted glass, crusted showerheads, and shampoo that never quite rinses clean.</p>`;
  }
  if (b === "Moderately hard") {
    return `<p>Between 61 and 120 ppm, effects are mild and many people never notice them. If your fixtures stay clean and soap behaves, this level is not worth treating.</p>`;
  }
  return `<p>Below 60 ppm there is nothing to fix. If your water bothers you at this level, the cause is likely chlorine, which is a filter's job, and a different topic than hardness.</p>`;
}

const TREATMENT_KEYS = {
  "dayton-oh": "lime_softened",
  "omaha-ne": "lime_softened",
  "minneapolis-mn": "lime_softened",
  "kansas-city-mo": "lime_softened",
  "columbus-oh": "lime_softened",
  "des-moines-ia": "lime_softened",
  "saint-paul-mn": "lime_softened",
  "beavercreek-oh": "ro_softened_greene",
  "san-jose-ca": "multi_zone",
  "albuquerque-nm": "multi_zone",
  "jacksonville-fl": "multi_zone",
  "phoenix-az": "multi_zone",
  "scottsdale-az": "multi_zone",
  "mesa-az": "multi_zone",
  "tulsa-ok": "multi_zone",
};

function treatmentNoteHtml(system) {
  const key = TREATMENT_KEYS[system.slug];
  if (!key) return "";

  if (key === "lime_softened") {
    return `<p>${escapeHtml(system.utility_name)} softens this water at the plant with lime treatment before it reaches you. The number above is what arrives at your tap, not what the source water measures.</p>`;
  }
  if (key === "ro_softened_greene") {
    return `<p>Until March 2025, this system delivered water at 462 ppm (27 grains per gallon), the highest raw reading we have verified anywhere in the US. ${escapeHtml(system.utility_name)}&#039;s new softening plant brought the tap value down to the number above.</p>`;
  }
  if (key === "multi_zone") {
    return `<p>${escapeHtml(system.utility_name)} serves different areas from different sources, so hardness depends on where in the service area you are. The range above spans the zones the utility publishes.</p>`;
  }
  return "";
}

function verifiedLineHtml(system) {
  if (!system.verified_date) return "";
  var d = new Date(system.verified_date + "T00:00:00");
  var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var label = months[d.getMonth()] + " " + d.getFullYear();
  return `<p class="source-line">Verified ${escapeHtml(label)} against the utility&#039;s published figures.</p>`;
}

function agCardHtml(system) {
  if (!shouldShowCard(system)) return "";

  return `
    <section class="reveal-section">
      <span class="section-rule">What removes it</span>
      <p class="disclosure">This page is supported by AG Softener. Here is why it is relevant to your water.</p>
      <div class="panel ag-card">
        <div class="product-placeholder">
          <img src="/assets/ag-water-softener-product.jpg" alt="AG Softener product." width="480" height="480" loading="lazy">
        </div>
        <div>
          <h2>AG Softener is a portable shower water softener built for renters.</h2>
          <p>Real ion-exchange softening (the whole-house technology, sized for a shower) installs in about ten minutes without a plumber, and comes down just as fast when you move.</p>
          <div class="fact-rows">
            <div>Water tests soft on a standard hardness strip</div>
            <div>$249, free shipping</div>
            <div>Better hair and skin in 60 days or your money back</div>
          </div>
          <a class="button-link" href="${productUrl(system.band)}" target="_blank" rel="noopener" data-ag-cta>SEE HOW AG SOFTENER WORKS</a>
        </div>
      </div>
    </section>
  `;
}

function css() {
  return `
      :root {
        --ink: #111;
        --muted: #4b5563;
        --paper: #f5f1df;
        --panel: #fffdf4;
        --line: #1f2937;
        --blue: #0645ad;
        --blue-dark: #002f75;
        --yellow: #ffe77a;
        --green: #b8d98f;
        --orange: #efb36a;
        --red: #c86f58;
      }

      * { box-sizing: border-box; }

      html { scroll-behavior: smooth; }

      body {
        margin: 0;
        color: var(--ink);
        background:
          linear-gradient(rgba(255, 255, 255, .5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, .5) 1px, transparent 1px),
          var(--paper);
        background-size: 26px 26px;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 16px;
        line-height: 1.45;
      }

      a { color: var(--blue); text-decoration: underline; }

      .page {
        width: min(100%, 980px);
        margin: 0 auto;
        background: var(--panel);
        border-left: 2px solid var(--line);
        border-right: 2px solid var(--line);
        box-shadow: 0 0 0 4px rgba(31, 41, 55, .06);
      }

      .utility-bar {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        padding: 8px 10px;
        color: #fff;
        background: #243447;
        font-size: 12px;
        text-transform: uppercase;
      }

      header, section {
        padding: 18px 10px;
        border-bottom: 2px solid var(--line);
      }

      header {
        background:
          linear-gradient(180deg, rgba(255, 255, 255, .92), rgba(255, 253, 244, .97)),
          repeating-linear-gradient(90deg, rgba(6, 69, 173, .10) 0 8px, transparent 8px 32px);
        border-bottom: 3px double var(--line);
      }

      h1, h2, h3, p { margin-top: 0; }

      h1 {
        margin-bottom: 8px;
        font-family: Georgia, "Times New Roman", serif;
        font-size: clamp(34px, 10vw, 54px);
        line-height: .98;
      }

      h2 {
        margin-bottom: 10px;
        font-family: Georgia, "Times New Roman", serif;
        font-size: clamp(25px, 7vw, 36px);
        line-height: 1.05;
      }

      h3 { margin-bottom: 8px; font-size: 19px; }

      button, .button-link {
        display: inline-block;
        min-height: 46px;
        padding: 10px 12px;
        border: 3px solid #111;
        border-radius: 0;
        color: #111;
        background: var(--yellow);
        font: 900 16px/1.1 Arial, Helvetica, sans-serif;
        text-align: center;
        text-transform: uppercase;
        text-decoration: none;
        cursor: pointer;
        box-shadow: 3px 3px 0 #111;
      }

      input {
        width: 100%;
        min-height: 45px;
        padding: 9px 10px;
        border: 2px solid var(--line);
        border-radius: 0;
        background: #fff;
        color: var(--ink);
        font: inherit;
        box-shadow: inset 2px 2px 0 rgba(0, 0, 0, .08);
      }

      label { display: grid; gap: 4px; font-size: 13px; font-weight: 700; }

      form { display: grid; gap: 8px; }

      .section-rule, .label-chip {
        display: inline-block;
        margin-bottom: 8px;
        padding: 2px 6px;
        border: 1px solid var(--line);
        background: #e5e7eb;
        font-size: 12px;
        font-weight: 900;
        text-transform: uppercase;
      }

      .panel {
        padding: 10px;
        border: 2px solid var(--line);
        background: #fff;
      }

      .score-panel { border-width: 3px; }

      .score-top { display: grid; gap: 8px; }

      .ppm-number {
        margin: 0 0 8px;
        font-family: Georgia, "Times New Roman", serif;
        font-size: clamp(54px, 18vw, 96px);
        font-weight: 900;
        line-height: 1;
      }

      .ppm-number span {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 16px;
        font-weight: 900;
      }

      .band-name {
        margin: 0;
        padding: 5px 8px;
        border: 2px solid var(--line);
        width: fit-content;
        background: var(--yellow);
        font-weight: 900;
        text-transform: uppercase;
      }

      .gauge {
        position: relative;
        margin: 14px 0 8px;
        padding-top: 18px;
      }

      .gauge-marker {
        position: absolute;
        top: 0;
        left: 0;
        transform: translateX(-50%);
        max-width: 54px;
        padding: 0 4px;
        border: 1px solid #111;
        background: #fff;
        font-size: 12px;
        font-weight: 900;
        text-align: center;
      }

      .gauge-bar {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        border: 2px solid var(--line);
      }

      .gauge-band {
        min-height: 58px;
        padding: 6px 4px;
        border-right: 1px solid var(--line);
        font-size: 11px;
        font-weight: 900;
        text-align: center;
      }

      .gauge-band:last-child { border-right: 0; }

      .soft { background: var(--green); }
      .moderate { background: #d7ca75; }
      .hard { background: var(--orange); }
      .very-hard { background: var(--red); }

      .source-line {
        margin: 10px 0 0;
        color: var(--muted);
        font-size: 13px;
        font-weight: 700;
      }

      .disclosure {
        margin: 0 0 10px;
        font-weight: 700;
      }

      .ag-card {
        display: grid;
        gap: 12px;
        background: #fff;
      }

      .product-placeholder {
        border: 2px solid var(--line);
        background: #f8fafc;
      }

      .product-placeholder img {
        display: block;
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
      }

      .fact-rows { display: grid; gap: 6px; margin: 10px 0; }

      .fact-rows div {
        padding: 7px;
        border: 1px solid var(--line);
        background: #f8fafc;
        font-weight: 700;
      }

      .unknown-form { max-width: 360px; margin-top: 10px; }

      footer {
        padding: 12px 10px 18px;
        background: #243447;
        color: #fff;
        font-size: 13px;
        text-align: center;
      }

      /* Index page table */
      .systems-table {
        width: 100%;
        border-collapse: collapse;
        border: 2px solid var(--line);
        font-size: 14px;
        line-height: 1.4;
      }

      .systems-table th,
      .systems-table td {
        padding: 8px 10px;
        border: 1px solid var(--line);
        text-align: left;
      }

      .systems-table th {
        background: #e5e7eb;
        font-weight: 900;
        cursor: pointer;
        user-select: none;
        white-space: nowrap;
      }

      .systems-table th:hover { background: #d1d5db; }

      .systems-table tbody tr:nth-child(even) { background: rgba(0,0,0,.03); }

      .systems-table a { text-decoration: none; }
      .systems-table a:hover { text-decoration: underline; }

      .sort-arrow { font-size: 11px; margin-left: 4px; }

      .hardest-list {
        display: grid;
        gap: 0;
        margin: 0;
        padding: 0;
        list-style: none;
        counter-reset: rank;
      }

      .hardest-list li {
        counter-increment: rank;
        padding: 8px 10px 8px 0;
        border-bottom: 1px solid rgba(0,0,0,.1);
        font-size: 15px;
      }

      .hardest-list li::before {
        content: counter(rank) ".";
        display: inline-block;
        width: 32px;
        font-weight: 900;
        text-align: right;
        margin-right: 8px;
      }

      .hardest-list a { text-decoration: none; }
      .hardest-list a:hover { text-decoration: underline; }

      .hardest-ppm {
        color: var(--muted);
        font-size: 13px;
        font-weight: 700;
      }

      @media (min-width: 720px) {
        body { padding: 18px; }
        header, section { padding: 24px 22px; }

        .score-top {
          grid-template-columns: auto 1fr;
          align-items: center;
        }

        .ag-card {
          grid-template-columns: 240px minmax(0, 1fr);
          align-items: start;
        }
      }

      @media print {
        body { background: #fff; padding: 0; }
        .page { border: 0; box-shadow: none; width: 100%; }
        .utility-bar, .reveal-section, footer { display: none !important; }
        a { color: #111; }
      }
  `;
}

function pageShell({ title, metaDesc, headExtra, bodyContent }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(metaDesc)}">
    ${headExtra || ''}
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <style>${css()}</style>
    <!-- Meta Pixel Code (suppressed for internal traffic) -->
    <script>
    if(localStorage.getItem("ag_internal")!=="1"){
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '4190953217702726');
    fbq('track', 'PageView');
    }
    </script>
    <noscript><img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=4190953217702726&ev=PageView&noscript=1"
    /></noscript>
    <!-- End Meta Pixel Code -->
    <script>(function(){var p=new URLSearchParams(location.search);if(p.get("internal")==="1")localStorage.setItem("ag_internal","1");if(p.get("internal")==="0")localStorage.removeItem("ag_internal");if(localStorage.getItem("ag_internal")!=="1"){var s=document.createElement("script");s.defer=true;s.src="/_vercel/insights/script.js";document.head.appendChild(s)}})()</script>
  </head>
  <body>
    <main class="page">
      <div class="utility-bar">
        <span>Public lookup tool</span>
        <span>My Apartment's Water Quality</span>
      </div>
      ${bodyContent}
      <footer>
        MyApartmentWaterQuality.com is an independent lookup tool, not affiliated with any government agency. Hardness data is sourced from public utility records.
      </footer>
    </main>
    <script src="/assets/first-touch.js"></script>
    <script>(function(){document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("[data-ag-cta]");if(!a)return;try{var ft=JSON.parse(localStorage.getItem("myapt_ft")||"{}");if(ft.lp){var u=new URL(a.href);u.searchParams.set("mlp",ft.lp);a.href=u.toString()}}catch(x){}})})()</script>
  </body>
</html>`;
}

// ── Index page ──────────────────────────────────────────────────────────────

function renderIndex(systems) {
  // Sort hardest first by default
  const sorted = [...systems].sort((a, b) => b.display_ppm - a.display_ppm);

  // Hardest 25: exclude estimated records (same filter as rankSystems)
  const rankable = sorted.filter(s => !s.estimated);
  const hardest25 = rankable.slice(0, 25);

  const tableRows = sorted.map(s => {
    return `<tr>
      <td><a href="/water-hardness/${s.slug}">${escapeHtml(s.city)}</a></td>
      <td>${escapeHtml(s.state)}</td>
      <td data-sort="${s.display_ppm}">${valueDisplay(s)}</td>
      <td><span class="label-chip ${bandClass(s.band)}">${escapeHtml(s.band)}</span></td>
    </tr>`;
  }).join("\n");

  const hardestItems = hardest25.map(s => {
    return `<li><a href="/water-hardness/${s.slug}">${escapeHtml(s.city)}, ${escapeHtml(s.state)}</a> <span class="hardest-ppm">${valueDisplay(s)}</span></li>`;
  }).join("\n");

  const bodyContent = `
    <header>
      <p class="label-chip">Water hardness data</p>
      <h1>US water hardness by city, from utility reports</h1>
      <p>Every number on this page comes from the water utility that serves the city, from its own published reports. No estimates and no averages of averages. Enter your zip in the lookup tool, or find your city below.</p>
    </header>

    <section>
      <span class="section-rule">All systems</span>
      <h2>Full Table</h2>
      <div style="overflow-x:auto">
        <table class="systems-table" id="systemsTable">
          <thead>
            <tr>
              <th data-col="0">City <span class="sort-arrow"></span></th>
              <th data-col="1">State <span class="sort-arrow"></span></th>
              <th data-col="2">Hardness (ppm) <span class="sort-arrow">▼</span></th>
              <th data-col="3">Band <span class="sort-arrow"></span></th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <span class="section-rule">Ranking</span>
      <h2>The hardest water we've verified</h2>
      <p>Full ranking with sources and methodology: <a href="/hardest-water-cities">The hardest water cities in America</a>.</p>
      <p>Ranked by the midpoint where utilities publish a range. Ranges overlap, so read this as among the hardest, in order, rather than an exact ranking.</p>
      <ol class="hardest-list">
        ${hardestItems}
      </ol>
    </section>

    <section>
      <span class="section-rule">Check your zip</span>
      <h2>Look Up Your Zip Code</h2>
      <p>The table above shows city-level averages. Your tap may differ. Check your exact zip for a personalized report.</p>
      <form class="unknown-form" action="/report" method="get">
        <label>Zip code
          <input name="zip" type="text" inputmode="numeric" maxlength="5" placeholder="e.g. 85001" required>
        </label>
        <button type="submit">Get your report</button>
      </form>
    </section>

    <p>For renters: our <a href="/landlord-hard-water">landlord page</a> covers whether hard water is the landlord&#039;s problem.</p>
  `;

  const sortScript = `
    <script>
    (function() {
      var table = document.getElementById("systemsTable");
      if (!table) return;
      var headers = table.querySelectorAll("th");
      var tbody = table.querySelector("tbody");
      var currentCol = 2;
      var currentDir = "desc";

      function sortTable(col, dir) {
        var rows = Array.from(tbody.querySelectorAll("tr"));
        rows.sort(function(a, b) {
          var aCell = a.cells[col];
          var bCell = b.cells[col];
          var aVal, bVal;
          if (col === 2) {
            aVal = Number(aCell.getAttribute("data-sort"));
            bVal = Number(bCell.getAttribute("data-sort"));
          } else {
            aVal = aCell.textContent.trim().toLowerCase();
            bVal = bCell.textContent.trim().toLowerCase();
          }
          if (aVal < bVal) return dir === "asc" ? -1 : 1;
          if (aVal > bVal) return dir === "asc" ? 1 : -1;
          return 0;
        });
        rows.forEach(function(r) { tbody.appendChild(r); });

        headers.forEach(function(th, i) {
          var arrow = th.querySelector(".sort-arrow");
          if (i === col) {
            arrow.textContent = dir === "asc" ? "\\u25B2" : "\\u25BC";
          } else {
            arrow.textContent = "";
          }
        });
      }

      headers.forEach(function(th, i) {
        th.addEventListener("click", function() {
          var dir;
          if (currentCol === i) {
            dir = currentDir === "asc" ? "desc" : "asc";
          } else {
            dir = (i === 2) ? "desc" : "asc";
          }
          currentCol = i;
          currentDir = dir;
          sortTable(i, dir);
        });
      });
    })();
    </script>
  `;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "US water hardness by city, from utility reports",
      datePublished: "2026-08-13",
      dateModified: "2026-08-23",
      author: { "@type": "Organization", name: "MyApartmentWaterQuality.com" }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.myapartmentwaterquality.com/" },
        { "@type": "ListItem", position: 2, name: "Water Hardness by City", item: "https://www.myapartmentwaterquality.com/water-hardness" }
      ]
    }
  ];

  const headExtra = jsonLd.map(j =>
    `<script type="application/ld+json">${JSON.stringify(j)}</script>`
  ).join("\n    ") +
    `\n    <link rel="canonical" href="https://www.myapartmentwaterquality.com/water-hardness">`;

  const html = pageShell({
    title: "Water Hardness by City: Verified Data for " + systems.length + " US Water Systems",
    metaDesc: "Verified water hardness numbers for " + systems.length + " US cities, sourced from utility reports. See the hardest cities ranked and check your own zip code.",
    headExtra,
    bodyContent
  });

  // Inject sort script before closing body
  return html.replace("</body>", sortScript + "\n</body>");
}

// ── System page ─────────────────────────────────────────────────────────────

function renderSystem(system, deployDate) {
  const vd = valueDisplay(system);
  const bp = bandPhrase(system.band);
  const hasRange = system.ppm_min && system.ppm_max && Math.abs(system.ppm_max - system.ppm_min) > 20;

  const leadSecondSentence = system.confidence === "system-level"
    ? `${escapeHtml(system.utility_name)} publishes this as a bound rather than a measured value, so treat it as the system&#039;s own ceiling, not a reading.`
    : `The number comes from ${escapeHtml(system.utility_name)}&#039;s ${escapeHtml(system.source_year)} published data, measured at the tap.`;

  const leadText = `${escapeHtml(system.city)}&#039;s tap water measures ${vd}, which is ${bp}. ${leadSecondSentence}`;

  const bodyContent = `
    <header>
      <p class="label-chip">Water hardness</p>
      <h1>${escapeHtml(system.city)}, ${escapeHtml(system.state)} water hardness</h1>
      <p>${leadText}</p>
    </header>

    <section>
      <span class="section-rule">Score</span>
      <div class="panel score-panel">
        <div class="score-top">
          <div>
            <p class="ppm-number">${system.display_ppm}<span> ppm</span></p>
            <p class="band-name ${bandClass(system.band)}">${escapeHtml(system.band)}</p>
          </div>
          <div>
            <h2>${escapeHtml(system.city)} shower water</h2>
            <p>Hardness bands per the U.S. Geological Survey. ${hasRange ? 'Range: ' + system.ppm_min + ' to ' + system.ppm_max + ' ppm across service areas.' : ''}</p>
          </div>
        </div>
        ${gaugeHtml(system)}
      </div>
      <p class="source-line">Source: <a href="${escapeHtml(system.source_url)}" target="_blank" rel="noopener">${escapeHtml(system.utility_name)}</a>, ${escapeHtml(system.source_year)}.</p>
      ${verifiedLineHtml(system)}
      ${treatmentNoteHtml(system)}
      ${neighborParagraphHtml(system)}
    </section>

    <section>
      <span class="section-rule">What this means</span>
      <h2>What ${escapeHtml(system.city)} Water Means for Hair and Skin</h2>
      ${bandMeaning(system)}
    </section>

    ${agCardHtml(system)}

    <section>
      <span class="section-rule">Check your zip</span>
      <h2>Check Your Own Zip Code</h2>
      <p>Check the number for your exact address with the free zip lookup, or read the utility&#039;s own report linked above.</p>
      <form class="unknown-form" action="/report" method="get">
        <label>Zip code
          <input name="zip" type="text" inputmode="numeric" maxlength="5" placeholder="e.g. 85001" required>
        </label>
        <button type="submit">Get your report</button>
      </form>
      <p style="margin-top:16px"><a href="/water-hardness">See all cities</a></p>
    </section>
  `;

  const pageTitle = `${system.city}, ${system.state} Water Hardness: ${vd} (${system.band})`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${system.city}, ${system.state} water hardness`,
      datePublished: deployDate,
      dateModified: system.verified_date || deployDate,
      author: { "@type": "Organization", name: "MyApartmentWaterQuality.com" }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.myapartmentwaterquality.com/" },
        { "@type": "ListItem", position: 2, name: "Water Hardness by City", item: "https://www.myapartmentwaterquality.com/water-hardness" },
        { "@type": "ListItem", position: 3, name: `${system.city}, ${system.state}`, item: `https://www.myapartmentwaterquality.com/water-hardness/${system.slug}` }
      ]
    }
  ];

  const headExtra = jsonLd.map(j =>
    `<script type="application/ld+json">${JSON.stringify(j)}</script>`
  ).join("\n    ") +
    `\n    <link rel="canonical" href="https://www.myapartmentwaterquality.com/water-hardness/${system.slug}">`;

  return pageShell({
    title: pageTitle,
    metaDesc: `${system.city}, ${system.state} water hardness is ${vd} (${system.band.toLowerCase()}). Verified from ${system.utility_name}. See what it means for your hair and skin.`,
    headExtra,
    bodyContent
  });
}

// ── Hardest water cities page ────────────────────────────────────────────────

function rankSystems(systems) {
  var sorted = systems
    .filter(function (s) { return !s.estimated; })
    .sort(function (a, b) { return b.display_ppm - a.display_ppm || a.city.localeCompare(b.city); })
    .slice(0, 25);

  var rank = 1;
  var i = 0;
  while (i < sorted.length) {
    var ppm = sorted[i].display_ppm;
    var j = i;
    while (j < sorted.length && sorted[j].display_ppm === ppm) j++;
    for (var k = i; k < j; k++) sorted[k]._rank = rank;
    rank = j + 1;
    i = j;
  }
  return sorted;
}

function hardestTableHtml(ranked) {
  var rows = ranked.map(function (s) {
    var gpg = (s.display_ppm / 17.1).toFixed(1);
    return '<tr>' +
      '<td>' + s._rank + '</td>' +
      '<td><a href="/water-hardness/' + s.slug + '">' + escapeHtml(s.city) + '</a></td>' +
      '<td>' + escapeHtml(s.state) + '</td>' +
      '<td data-sort="' + s.display_ppm + '">' + s.display_ppm + '</td>' +
      '<td>' + gpg + '</td>' +
      '<td><span class="label-chip ' + bandClass(s.band) + '">' + escapeHtml(s.band) + '</span></td>' +
      '</tr>';
  }).join('\n');

  return '<div style="overflow-x:auto"><table class="systems-table">' +
    '<thead><tr>' +
    '<th>Rank</th><th>City</th><th>State</th><th>Hardness (ppm)</th><th>Grains/gal</th><th>Band</th>' +
    '</tr></thead>' +
    '<tbody>' + rows + '</tbody>' +
    '</table></div>';
}

function renderHardestCities(systems) {
  var BUILD_DATE = "2026-08-23";
  var ranked = rankSystems(systems);

  var bodyContent = `
    <header>
      <p class="label-chip">Water hardness data</p>
      <h1>The hardest water cities in America</h1>
      <p>The hardest water cities in America get ranked constantly, and most of those rankings are compiled from other rankings. The numbers drift and the sources vanish, until cities end up tagged with figures their own utilities never published. This ranking works from the utility&#039;s own records. Each city below links to its full report, and each report shows its source and the date we last checked it.</p>
      <p>Hardness is measured in parts per million of dissolved calcium and magnesium. Above 121 ppm counts as hard under the US Geological Survey scale. Above 180 ppm counts as very hard. Twenty-three of the 25 cities here clear the hard line, and eleven clear very hard.</p>
    </header>

    <section>
      <span class="section-rule">Ranking</span>
      <p>This ranking covers the cities in our verified dataset, not every city in America. A city missing from the list may still have hard water. We add cities as we verify them against primary utility sources, and we leave out any figure we can&#039;t confirm.</p>
      ${hardestTableHtml(ranked)}
    </section>

    <section>
      <h2>How we verify the hardest water cities</h2>
      <p>Each figure comes from the city utility&#039;s own published water quality data. That means the annual water quality report, the utility&#039;s hardness page, or its published FAQ. We do not use aggregator sites, plumber blogs, or other rankings as sources.</p>
      <p>Where a utility publishes a range, we use the midpoint and show the range on the city&#039;s report page. Where a utility publishes grains per gallon, we convert at 17.1 ppm per grain. When we re-check a figure, the city&#039;s page shows the verification date. The full process is documented on our <a href="/methodology">methodology page</a>.</p>
      <p>Some cities can&#039;t be verified this way. Chicago, for example, publishes its water quality data in formats we can&#039;t confirm in text. Cities like that stay in our dataset with their last known figure and no verification date.</p>
    </section>

    <section>
      <h2>Why published hardness numbers disagree</h2>
      <p>The wrong-number problem is simple to state: the hardness figures published online for a given city often disagree with each other, and sometimes disagree with the utility itself.</p>
      <p>Three examples from our own verification work, checked in August 2026. The Las Vegas Valley Water District&#039;s website answered &#034;how hard is our water&#034; with 291 ppm while a second block on the same page still said 280. San Diego&#039;s utility page stated its range as 272 to 284 ppm and also as 16 to 18 grains per gallon, which converts to 274 to 308. Both can&#039;t be right. And the Chicago documents we checked, the comprehensive chemical analysis and the current water quality report, are scanned images with no machine-readable text, which is part of why aggregator sites guess.</p>
      <p>None of this is scandal. Utilities update pages unevenly and hardness genuinely varies by season and source. But it means a number copied from a ranking that copied it from another ranking has usually drifted from anything a utility ever measured. It&#039;s why every figure here traces to a primary source you can click. The pattern has a name and its own page: <a href="/the-wrong-number-problem">the wrong-number problem</a>.</p>
    </section>

    <section>
      <span class="section-rule">FAQ</span>
      <h3>What city has the hardest water in the US?</h3>
      <p>In our verified dataset, San Jose, California tops the list at 350 ppm. The figure comes from the utility&#039;s own published data, and the city&#039;s report page shows the source.</p>
      <h3>Is hard water dangerous to drink?</h3>
      <p>No. Calcium and magnesium in drinking water pose no health risk, and both are minerals your body uses. The problems hard water causes are practical: scale in pipes and appliances, and the dry skin and hair that follow every shower.</p>
      <h3>What ppm is considered hard water?</h3>
      <p>The US Geological Survey scale counts 121 to 180 ppm as hard and anything above 180 ppm as very hard. Below 60 ppm counts as soft. Eleven of the 25 cities on this list sit above 180 ppm.</p>
      <h3>How can I check the water hardness in my area?</h3>
      <p>Enter your zip code in <a href="/">our lookup tool</a> and you&#039;ll get your area&#039;s figure with its source. For your own tap, a hardness test strip from any hardware store gives you a reading in about thirty seconds.</p>
      <h3>Why does my utility&#039;s number differ from other websites?</h3>
      <p>Most hardness sites copy from each other rather than from utilities, and copied numbers drift. Utilities also publish ranges, seasonal figures, and different units, which get flattened or misconverted along the way. When in doubt, the utility&#039;s current published figure wins.</p>
    </section>
  `;

  var faqEntries = [
    { q: "What city has the hardest water in the US?", a: "In our verified dataset, San Jose, California tops the list at 350 ppm. The figure comes from the utility\u0027s own published data, and the city\u0027s report page shows the source." },
    { q: "Is hard water dangerous to drink?", a: "No. Calcium and magnesium in drinking water pose no health risk, and both are minerals your body uses. The problems hard water causes are practical: scale in pipes and appliances, and the dry skin and hair that follow every shower." },
    { q: "What ppm is considered hard water?", a: "The US Geological Survey scale counts 121 to 180 ppm as hard and anything above 180 ppm as very hard. Below 60 ppm counts as soft. Eleven of the 25 cities on this list sit above 180 ppm." },
    { q: "How can I check the water hardness in my area?", a: "Enter your zip code in our lookup tool and you\u0027ll get your area\u0027s figure with its source. For your own tap, a hardness test strip from any hardware store gives you a reading in about thirty seconds." },
    { q: "Why does my utility\u0027s number differ from other websites?", a: "Most hardness sites copy from each other rather than from utilities, and copied numbers drift. Utilities also publish ranges, seasonal figures, and different units, which get flattened or misconverted along the way. When in doubt, the utility\u0027s current published figure wins." }
  ];

  var itemListEntries = ranked.map(function (s) {
    return {
      "@type": "ListItem",
      position: s._rank,
      name: s.city + ", " + s.state + " \u2013 " + s.display_ppm + " ppm",
      url: "https://www.myapartmentwaterquality.com/water-hardness/" + s.slug
    };
  });

  var jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "The hardest water cities in America",
      datePublished: BUILD_DATE,
      dateModified: BUILD_DATE,
      author: { "@type": "Organization", name: "MyApartmentWaterQuality.com" }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqEntries.map(function (e) {
        return {
          "@type": "Question",
          name: e.q,
          acceptedAnswer: { "@type": "Answer", text: e.a }
        };
      })
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Hardest water cities in America",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: ranked.length,
      itemListElement: itemListEntries
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.myapartmentwaterquality.com/" },
        { "@type": "ListItem", position: 2, name: "Water Hardness by City", item: "https://www.myapartmentwaterquality.com/water-hardness" },
        { "@type": "ListItem", position: 3, name: "Hardest Water Cities", item: "https://www.myapartmentwaterquality.com/hardest-water-cities" }
      ]
    }
  ];

  var headExtra = jsonLd.map(function (j) {
    return '<script type="application/ld+json">' + JSON.stringify(j) + '</script>';
  }).join("\n    ") +
    '\n    <link rel="canonical" href="https://www.myapartmentwaterquality.com/hardest-water-cities">';

  var html = pageShell({
    title: "Hardest water cities in America, utility-verified",
    metaDesc: "25 US cities ranked by verified water hardness. Every number checked against the utility\u0027s own published figures, with sources and verification dates.",
    headExtra: headExtra,
    bodyContent: bodyContent
  });

  return html.replace('</footer>', '      <p>A GRN Labs property.</p>\n      </footer>');
}

// ── Methodology ─────────────────────────────────────────────────────────────

function renderMethodology() {
  var BUILD_DATE = "2026-08-23";

  var bodyContent = `
    <header>
      <p class="label-chip">Water hardness data</p>
      <h1>How our water hardness data is verified</h1>
      <p>Every water hardness number on this site is checked against the source: the city utility&#039;s own published data. This page shows how we do it, so anyone can check our numbers.</p>
    </header>

    <section>
      <h2>What counts as a source</h2>
      <p>A source is the utility itself. That can be the annual water quality report or the utility&#039;s hardness page. A published FAQ counts too. Sites that collect numbers from other sites don&#039;t count. Most of them copy each other, and the numbers drift as they travel.</p>
      <p>Each city&#039;s page names its utility and links to the source. If a link ever breaks, the utility&#039;s name and the year still show where the number came from.</p>
    </section>

    <section>
      <h2>How figures are recorded</h2>
      <p>Hardness is measured in parts per million (ppm) of dissolved calcium and magnesium. Some utilities use grains per gallon instead. We turn that into ppm. One grain equals 17.1 ppm.</p>
      <p>Some utilities publish a range instead of one number. We record the middle of the range and show the full range on the city&#039;s page. Some publish one number for the whole water system. We record that number and say so on the page.</p>
    </section>

    <section>
      <h2>Verification and re-checks</h2>
      <p>A number enters our dataset only after we&#039;ve read it on the utility&#039;s own page or in its own report. When we check a city again, its page gains a line showing the month we checked. A page without that line carries the number from our first check, with its source named. This process produces one public ranking: <a href="/hardest-water-cities">The hardest water cities in America</a>.</p>
      <p>Sometimes a re-check catches a utility in the middle of updating its own site. In August 2026, the Las Vegas Valley Water District&#039;s site gave 291 ppm in one answer and 280 in another spot on the same page. We recorded 291, the number in the utility&#039;s current main answer.</p>
    </section>

    <section>
      <h2>What we leave out</h2>
      <p>A number we can&#039;t confirm doesn&#039;t get published as fact. Some records carry an ESTIMATED label instead, and estimated records never appear in our rankings. Chicago shows the other problem. The documents we checked in August 2026 are image scans that no text tool can read. So Chicago&#039;s record keeps its last known number and no verification date until the city publishes something we can check.</p>
    </section>

    <section>
      <h2>Corrections</h2>
      <p>When a number we verified turns out wrong, we change the record and the city&#039;s page shows the new check date. The record follows whatever the utility currently publishes.</p>
    </section>
  `;

  var jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "How our water hardness data is verified",
      datePublished: BUILD_DATE,
      dateModified: BUILD_DATE,
      author: { "@type": "Organization", name: "MyApartmentWaterQuality.com" }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.myapartmentwaterquality.com/" },
        { "@type": "ListItem", position: 2, name: "Methodology", item: "https://www.myapartmentwaterquality.com/methodology" }
      ]
    }
  ];

  var headExtra = jsonLd.map(function (j) {
    return '<script type="application/ld+json">' + JSON.stringify(j) + '</script>';
  }).join("\n    ") +
    '\n    <link rel="canonical" href="https://www.myapartmentwaterquality.com/methodology">';

  var html = pageShell({
    title: "How our water hardness data is verified",
    metaDesc: "Every figure on this site traces to a primary utility source. How verification works, and what happens when a number can\u0027t be confirmed.",
    headExtra: headExtra,
    bodyContent: bodyContent
  });

  return html.replace('</footer>', '      <p>A GRN Labs property.</p>\n      </footer>');
}

// ── Landlord Hard Water ─────────────────────────────────────────────────────

function renderLandlordHardWater() {
  var BUILD_DATE = "2026-08-23";

  var bodyContent = `
    <header>
      <p class="label-chip">Water hardness data</p>
      <h1>Do landlords have to fix hard water?</h1>
      <p>Usually no. Landlords have to keep rental homes safe and livable, and that includes water that is safe to use. Hard water passes that test. The minerals that make water hard are calcium and magnesium, and neither one harms you. So hard water almost never counts as something a landlord must repair.</p>
      <p>There&#039;s a second reason, and it matters more than the law does. Hardness isn&#039;t something your landlord controls. It comes from the city supply. In San Antonio, the utility&#039;s own published figure is <a href="/water-hardness/san-antonio-tx">299 parts per million</a>, which counts as very hard. Every building on that supply gets that water, no matter who owns it.</p>
    </header>

    <section>
      <h2>When hard water is the landlord&#039;s problem</h2>
      <p>A few situations are different. If the building came with a water softener and it broke, fixing it is usually the landlord&#039;s job. Equipment the landlord provides is equipment the landlord maintains. If scale has damaged the plumbing badly enough that pressure drops or fixtures fail, that&#039;s a repair issue. And if the water looks wrong or smells wrong, that may not be hard water at all. That&#039;s the kind of problem the rules about livable housing cover.</p>
      <p>If it comes to a dispute, your city&#039;s code enforcement office and local legal aid can tell you what applies where you live. Rules differ by state and city, and this page can&#039;t answer for yours.</p>
    </section>

    <section>
      <h2>What you can do without the landlord</h2>
      <p>Start by learning your actual number. Enter your zip code in <a href="/">our lookup tool</a> and you&#039;ll see the hardness where you live, with the source. Renters in the hardest cities often assume something is wrong with their building. The number shows it&#039;s the whole city.</p>
      <p>The fixes open to renters are the ones that don&#039;t touch the building&#039;s plumbing. Some equipment attaches right at the shower. It installs on the fixture and comes with you when you move. Ask your landlord before changing anything a lease might cover, and keep the original parts so you can put them back when you leave.</p>
      <p>For the scale already on your fixtures, plain white vinegar dissolves it. Soak the showerhead, wipe the faucets, and it comes off.</p>
    </section>

    <section>
      <h2>If you just moved in</h2>
      <p>Water that feels different in a new apartment usually means the supply changed, and nothing more. Move from a soft-water city to a hard one and your skin and hair notice in the first week. Look up your new zip code before assuming the building has a problem. Our <a href="/hardest-water-cities">ranking of the hardest water cities</a> shows how wide the gap between cities runs.</p>
    </section>

    <section>
      <span class="section-rule">FAQ</span>
      <h3>Can you put a water softener in a rental?</h3>
      <p>A whole-house softener needs plumbing work and the landlord&#039;s permission, so for most renters the answer is no. Shower-level softeners and portable units exist that attach to fixtures without changing the plumbing. Check your lease before installing anything.</p>
      <h3>Is it okay to shower in hard water?</h3>
      <p>Yes. Hard water is safe for bathing. What it affects is comfort. Soap rinses poorly and skin can feel dry after showering. People with sensitive skin tend to notice it most.</p>
      <h3>What are the signs of hard water in my home?</h3>
      <p>White crust on the showerhead and faucets, spots on glasses out of the dishwasher, soap that won&#039;t lather well, and a film on shower doors. The fastest confirmation is your city&#039;s published figure, which <a href="/">our lookup tool</a> shows by zip code.</p>
    </section>
  `;

  var faqEntries = [
    { q: "Can you put a water softener in a rental?", a: "A whole-house softener needs plumbing work and the landlord\u0027s permission, so for most renters the answer is no. Shower-level softeners and portable units exist that attach to fixtures without changing the plumbing. Check your lease before installing anything." },
    { q: "Is it okay to shower in hard water?", a: "Yes. Hard water is safe for bathing. What it affects is comfort. Soap rinses poorly and skin can feel dry after showering. People with sensitive skin tend to notice it most." },
    { q: "What are the signs of hard water in my home?", a: "White crust on the showerhead and faucets, spots on glasses out of the dishwasher, soap that won\u0027t lather well, and a film on shower doors. The fastest confirmation is your city\u0027s published figure, which our lookup tool shows by zip code." }
  ];

  var jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Do landlords have to fix hard water?",
      datePublished: BUILD_DATE,
      dateModified: BUILD_DATE,
      author: { "@type": "Organization", name: "MyApartmentWaterQuality.com" }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqEntries.map(function (e) {
        return {
          "@type": "Question",
          name: e.q,
          acceptedAnswer: { "@type": "Answer", text: e.a }
        };
      })
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.myapartmentwaterquality.com/" },
        { "@type": "ListItem", position: 2, name: "Landlord Hard Water", item: "https://www.myapartmentwaterquality.com/landlord-hard-water" }
      ]
    }
  ];

  var headExtra = jsonLd.map(function (j) {
    return '<script type="application/ld+json">' + JSON.stringify(j) + '</script>';
  }).join("\n    ") +
    '\n    <link rel="canonical" href="https://www.myapartmentwaterquality.com/landlord-hard-water">';

  var html = pageShell({
    title: "Do landlords have to fix hard water?",
    metaDesc: "Usually no. Hard water rarely counts as a repair issue. Here is when it can, and what renters can do about hard water on their own.",
    headExtra: headExtra,
    bodyContent: bodyContent
  });

  return html.replace('</footer>', '      <p>A GRN Labs property.</p>\n      </footer>');
}

// ── The Wrong-Number Problem ────────────────────────────────────────────────

function renderWrongNumberProblem() {
  var BUILD_DATE = "2026-08-23";

  var bodyContent = `
    <header>
      <p class="label-chip">Water hardness data</p>
      <h1>The wrong-number problem</h1>
      <p>The wrong-number problem is what we call a pattern in published water hardness data: the numbers published for the same city rarely agree, and a city&#039;s own utility sometimes disagrees with itself. A renter looking up their water can find three different figures in three tabs, none of them sourced.</p>
      <p>This page lays out the pattern with examples we found ourselves. Each one is dated, and each one can be checked.</p>
    </header>

    <section>
      <h2>Where wrong numbers come from</h2>
      <p>Most hardness numbers online are copies. Somebody measured the original, but that was several websites ago. A ranking site copies from another ranking site. A blog rounds a range into a single figure. A conversion from grains per gallon gets done wrong, or not at all. Each copy moves the number a little further from anything a utility published.</p>
      <p>Utilities contribute to it too, usually by accident. Water hardness genuinely changes with season and source, and utility websites get updated unevenly. A page can carry two figures from two different years at the same time.</p>
    </section>

    <section>
      <h2>Documented examples</h2>
      <p>These come from our verification passes in August 2026.</p>
      <h3>A utility disagreeing with itself</h3>
      <p>The Las Vegas Valley Water District&#039;s own site answered &#034;how hard is our water&#034; with 291 parts per million while a second block on the same page still said 280. Two different numbers on the same utility page. We recorded 291, the figure in the current main answer, and <a href="/water-hardness/las-vegas-nv">the Las Vegas page shows the source</a>.</p>
      <h3>A conversion that doesn&#039;t add up</h3>
      <p>San Diego&#039;s utility page stated its hardness range as 272 to 284 parts per million, and also as 16 to 18 grains per gallon. Those grains convert to 274 to 308. The two ranges can&#039;t both be right. We recorded the figures and noted the discrepancy.</p>
      <h3>Data that can&#039;t be checked at all</h3>
      <p>The Chicago water quality documents we checked are image scans with no readable text. A machine can&#039;t read them and neither can a copy-paste. That gap is part of why so many sites guess at Chicago&#039;s number, and why our Chicago record carries no verification date.</p>
    </section>

    <section>
      <h2>What a right number looks like</h2>
      <p>A right number carries its source and the date someone last checked it. The figure alone is half an answer. Our <a href="/methodology">methodology page</a> documents how we hold hardness data to that standard, and every city page on this site names its utility and links to it. When a number here gets re-checked, the page shows the month.</p>
      <p>If you want the number for your own area, <a href="/">our lookup tool</a> shows it by zip code, with the source next to it.</p>
    </section>

    <section>
      <span class="section-rule">FAQ</span>
      <h3>What is the wrong-number problem?</h3>
      <p>It&#039;s the pattern where published water hardness figures for the same city disagree with each other, and sometimes with the city&#039;s own utility. The name is ours, and this page documents the pattern with dated examples.</p>
      <h3>How do I find the correct water hardness for my city?</h3>
      <p>Go to the utility itself. Its annual water quality report or its hardness page carries the measured figure. <a href="/">Our lookup tool</a> collects those utility figures by zip code and links each one to its source.</p>
    </section>
  `;

  var faqEntries = [
    { q: "What is the wrong-number problem?", a: "It\u0027s the pattern where published water hardness figures for the same city disagree with each other, and sometimes with the city\u0027s own utility. The name is ours, and this page documents the pattern with dated examples." },
    { q: "How do I find the correct water hardness for my city?", a: "Go to the utility itself. Its annual water quality report or its hardness page carries the measured figure. Our lookup tool collects those utility figures by zip code and links each one to its source." }
  ];

  var jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "The wrong-number problem",
      datePublished: BUILD_DATE,
      dateModified: BUILD_DATE,
      author: { "@type": "Organization", name: "MyApartmentWaterQuality.com" }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqEntries.map(function (e) {
        return {
          "@type": "Question",
          name: e.q,
          acceptedAnswer: { "@type": "Answer", text: e.a }
        };
      })
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.myapartmentwaterquality.com/" },
        { "@type": "ListItem", position: 2, name: "The Wrong-Number Problem", item: "https://www.myapartmentwaterquality.com/the-wrong-number-problem" }
      ]
    }
  ];

  var headExtra = jsonLd.map(function (j) {
    return '<script type="application/ld+json">' + JSON.stringify(j) + '</script>';
  }).join("\n    ") +
    '\n    <link rel="canonical" href="https://www.myapartmentwaterquality.com/the-wrong-number-problem">';

  var html = pageShell({
    title: "The wrong-number problem in water hardness data",
    metaDesc: "Published hardness numbers for the same city often disagree, and some disagree with the utility\u0027s own site. What causes it, with documented examples.",
    headExtra: headExtra,
    bodyContent: bodyContent
  });

  return html.replace('</footer>', '      <p>A GRN Labs property.</p>\n      </footer>');
}

// ── 404 ─────────────────────────────────────────────────────────────────────

function renderNotFound() {
  const bodyContent = `
    <header>
      <p class="label-chip">Not found</p>
      <h1>City not found</h1>
      <p>That water system is not in our database yet.</p>
    </header>
    <section>
      <h2>Try these instead</h2>
      <p><a href="/water-hardness">See all cities</a>, or check your zip code directly:</p>
      <form class="unknown-form" action="/report" method="get">
        <label>Zip code
          <input name="zip" type="text" inputmode="numeric" maxlength="5" placeholder="e.g. 85001" required>
        </label>
        <button type="submit">Get your report</button>
      </form>
    </section>
  `;

  return pageShell({
    title: "City Not Found | MyApartmentWaterQuality.com",
    metaDesc: "That water system is not in our database yet.",
    headExtra: '<meta name="robots" content="noindex">',
    bodyContent
  });
}

module.exports = { renderIndex, renderSystem, renderNotFound, renderHardestCities, renderMethodology, renderLandlordHardWater, renderWrongNumberProblem };
