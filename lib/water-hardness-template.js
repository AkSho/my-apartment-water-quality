// lib/water-hardness-template.js
// Templates for /water-hardness/ index and /water-hardness/{slug} system pages.
// Consumed by api/water-hardness.js.

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

  // Hardest 25: exclude system-level confidence records
  const rankable = sorted.filter(s => s.confidence === "exact");
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
      <h2>The hardest city water we've verified</h2>
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
      dateModified: "2026-08-13",
      author: { "@type": "Organization", name: "MyApartmentWaterQuality.com" }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.myapartmentwaterquality.com/" },
        { "@type": "ListItem", position: 2, name: "Water Hardness by City", item: "https://www.myapartmentwaterquality.com/water-hardness/" }
      ]
    }
  ];

  const headExtra = jsonLd.map(j =>
    `<script type="application/ld+json">${JSON.stringify(j)}</script>`
  ).join("\n    ") +
    `\n    <link rel="canonical" href="https://www.myapartmentwaterquality.com/water-hardness/">`;

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
      ${treatmentNoteHtml(system)}
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
      <p style="margin-top:16px"><a href="/water-hardness/">See all cities</a></p>
    </section>
  `;

  const pageTitle = `${system.city}, ${system.state} Water Hardness: ${vd} (${system.band})`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${system.city}, ${system.state} water hardness`,
      datePublished: deployDate,
      dateModified: deployDate,
      author: { "@type": "Organization", name: "MyApartmentWaterQuality.com" }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.myapartmentwaterquality.com/" },
        { "@type": "ListItem", position: 2, name: "Water Hardness by City", item: "https://www.myapartmentwaterquality.com/water-hardness/" },
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
      <p><a href="/water-hardness/">See all cities</a>, or check your zip code directly:</p>
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

module.exports = { renderIndex, renderSystem, renderNotFound };
