/* Safeguard Anchors — SPA router, renderers, interactions */
(function () {
"use strict";
const app = document.getElementById("app");
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const cat = slug => DATA.categories.find(c => c.slug === slug);
const catName = slug => (cat(slug) || {}).name || "";
const prods = () => DATA.products;
/* A spec table is a column-header strip stacked directly on top of its data rows.
   Some tables ship with the header baked in, in which case head is null. */
const specTable = (t, alt) => `
  <figure class="tbl">
    ${t.head ? `<img class="tbl-head" src="${t.head}" alt="" loading="lazy">` : ""}
    <img class="tbl-body" src="${t.img}" alt="${alt}" loading="lazy">
  </figure>`;

/* ---------- shared partials ---------- */
const pCard = (p, i) => `
  <a class="p-card reveal d${Math.min(i, 7)}" href="#/product/${p.slug}">
    <div class="p-thumb">${p.eta ? '<span class="p-eta">ETA</span>' : ""}
      <img src="${p.card}" alt="${esc(p.name)}" loading="lazy"></div>
    <div class="p-body">
      <span class="p-cat">${esc(catName(p.cat))}</span>
      <h3>${esc(p.name)}</h3>
      <span class="p-more">View product →</span>
    </div>
  </a>`;

const pageHero = (title, sub, crumbs) => `
  <section class="page-hero"><div class="shell">
    <div class="crumb">${crumbs.map(c => c.href ? `<a href="${c.href}">${esc(c.t)}</a><span>/</span>` : `<span>${esc(c.t)}</span>`).join("")}</div>
    <h1>${esc(title)}</h1>${sub ? `<p>${sub}</p>` : ""}
  </div></section>`;

const criteriaBand = (tint) => `
  <section class="section${tint ? " tint" : ""}"><div class="shell">
    <div class="sec-head reveal" data-fx="left"><div><span class="kick">Choosing a fixing</span>
      <h2>To help you choose the right product, we emphasise crucial factors for each and every item</h2>
      <p>Seven considerations that decide whether an anchor performs on site.</p></div></div>
    <div class="crit-grid">
      ${DATA.criteria.map((c, i) => `
        <div class="crit-card reveal d${Math.min(i, 7)}" data-fx="zoom">
          <span class="crit-ico" aria-hidden="true">${c.icon}</span>
          <h3>${esc(c.t)}</h3><p>${esc(c.d)}</p>
        </div>`).join("")}
    </div>
  </div></section>`;

const faqBand = () => `
  <section class="section"><div class="shell">
    <div class="sec-head reveal"><div><span class="kick">Questions</span>
      <h2>Frequently Asked Questions</h2></div>
      <a class="sec-link" href="#/contact">Ask us something →</a></div>
    <div class="faq-list">
      ${DATA.faqs.map((f, i) => `
        <div class="v-item faq-item reveal d${i}">
          <button type="button" data-acc><span>${esc(f.q)}</span><span class="chev">▼</span></button>
          <div class="v-body"><div class="v-body-inner"><p>${esc(f.a)}</p></div></div>
        </div>`).join("")}
    </div>
  </div></section>`;

const ctaBand = () => `
  <section class="section"><div class="shell">
    <div class="cta-band reveal">
      <div><h2>Need a custom fixing solution?</h2>
      <p>Tell us about your project — our team will recommend the right anchor, size and finish.</p></div>
      <a class="btn" href="#/contact">Contact our team →</a>
    </div>
  </div></section>`;

/* ---------- views ---------- */
function vHome() {
  const cats = DATA.categories.map((c, i) => `
    <a class="cat-card reveal d${i}" data-fx="flip" href="#/category/${c.slug}">
      <img src="${c.banner}" alt="" loading="lazy">
      <div class="cat-body"><h3>${esc(c.name)}</h3><span>${c.count} product ${c.count > 1 ? "series" : "series"}</span>
      <span class="go">Explore →</span></div>
    </a>`).join("");
  const eta = prods().filter(p => p.eta).map((p, i) => pCard(p, i)).join("");
  const cs = DATA.coming.map((c, i) => `
    <a class="cs-card reveal d${i}" data-fx="zoom" href="#/coming-soon">
      <div class="cs-thumb"><span class="cs-tag">COMING SOON</span><img src="${c.imgs[0]}" alt="${esc(c.name)}" loading="lazy"></div>
      <div class="cs-body"><h3>${esc(c.name)}</h3><p>${esc(c.desc)}</p></div>
    </a>`).join("");
  const tick = `<div class="ticker-half">${["ETA APPROVED", "SEISMIC PERFORMANCE", "WEDGE ANCHORS", "CONCRETE BOLTS", "DROP-IN ANCHORS", "CAVITY FIXINGS", "ENGINEERED IN TAIWAN", "QUALITY FASTENING"].map(t => `<span>${t}</span><i>◆</i>`).join("")}</div>`;
  return `
  <section class="hero">
    <div class="hero-grid" aria-hidden="true"></div>
    <div class="shell hero-inner">
      <div>
        <h1>Anchors you can <span class="accent">build on.</span></h1>
        <p class="lead">${esc(DATA.brand.sub)}</p>
        <div class="hero-badges">
          <span class="badge"><span class="dot"></span>ETA-approved range</span>
          <span class="badge"><span class="dot"></span>16 product series</span>
          <span class="badge"><span class="dot"></span>Made in Taiwan &amp; China</span>
        </div>
        <div class="hero-cta">
          <a class="btn btn-red" href="#/products">Browse products</a>
          <a class="btn btn-ghost" href="#/eta">ETA approved range</a>
        </div>
      </div>
      <div class="hero-art">
        <div class="hero-logo-wrap">
          <span class="hero-glow"></span>
          <span class="hero-ring"></span><span class="hero-ring r2"></span>
          <span class="hero-orbit"><i></i></span><span class="hero-orbit o2"><i></i></span>
          <img class="hero-logo" src="assets/img/logo.png" alt="Safeguard Anchors">
          <span class="hero-chip c1">✔ ETA Approved</span>
          <span class="hero-chip c2">◆ Seismic Tested</span>
        </div>
      </div>
    </div>
  </section>
  <div class="ticker" aria-hidden="true"><div class="ticker-track">${tick}${tick}</div></div>
  <section class="stats"><div class="shell stats-row reveal">
    <div class="stat"><b><span data-count="16">0</span><span class="plus">+</span></b><span>Product series</span></div>
    <div class="stat"><b><span data-count="34">0</span><span class="plus">+</span></b><span>Models &amp; variants</span></div>
    <div class="stat"><b><span data-count="6">0</span></b><span>ETA-approved products</span></div>
    <div class="stat"><b><span data-count="2">0</span></b><span>Production bases</span></div>
  </div></section>
  <section class="section"><div class="shell">
    <div class="sec-head reveal"><div><span class="kick">Product range</span>
      <h2>Find the right fixing for the job</h2>
      <p>From lightweight hammer-set anchors to ETA-approved structural fixings.</p></div>
      <a class="sec-link" href="#/products">All products →</a></div>
    <div class="cat-grid">${cats}</div>
  </div></section>
  <section class="section how"><div class="shell">
    <div class="sec-head reveal"><div><span class="kick">Engineering</span>
      <h2>How a wedge anchor works</h2>
      <p>Four steps from drill to full load-bearing connection — the principle behind our ETA-approved range.</p></div>
      <a class="sec-link" href="#/eta">ETA range →</a></div>
    <div class="how-wrap reveal" data-fx="zoom">
      <div class="how-diagram s0" id="howDiag" role="img" aria-label="Animated cross-section showing wedge anchor installation: drill, insert, tighten, load">
        <svg viewBox="0 0 560 430" preserveAspectRatio="xMidYMid meet">
          <rect x="15" y="160" width="530" height="255" fill="#E3E7EF" stroke="#C6CCDA"/>
          <g stroke="#D6DBE6" stroke-width="1">
            <path d="M15 220 L75 160 M15 320 L175 160 M15 415 L270 160 M120 415 L375 160 M225 415 L480 160 M330 415 L545 200 M435 415 L545 305"/>
          </g>
          <g fill="#D3D8E3">
            <circle cx="60" cy="205" r="7"/><circle cx="122" cy="342" r="9"/><circle cx="200" cy="252" r="6"/>
            <circle cx="88" cy="390" r="5"/><circle cx="352" cy="222" r="8"/><circle cx="422" cy="332" r="10"/>
            <circle cx="482" cy="242" r="6"/><circle cx="250" cy="382" r="7"/><circle cx="512" cy="382" r="5"/>
            <circle cx="168" cy="300" r="5"/><circle cx="318" cy="368" r="6"/><circle cx="455" cy="188" r="5"/>
          </g>
          <line x1="15" y1="160" x2="545" y2="160" stroke="#98A2B8" stroke-width="2.5"/>
          <rect class="hw-hole" x="266" y="161" width="28" height="131" fill="#F8FAFD" stroke="#C2C9D8"/>
          <g class="hw-dim" fill="none" stroke="#8A8F99" stroke-width="1.2">
            <path d="M266 150 h28 M266 146 v8 M294 146 v8"/>
            <path d="M312 161 v131 M308 161 h8 M308 292 h8"/>
            <text x="280" y="140" text-anchor="middle" font-size="11.5" font-weight="700" fill="#5C626E" stroke="none">⌀d</text>
            <text x="320" y="231" font-size="11.5" font-weight="700" fill="#5C626E" stroke="none">h·ef</text>
          </g>
          <g class="hw-dust" fill="#B9C1CF">
            <circle cx="292" cy="164" r="3" style="--dx:20px"/>
            <circle cx="268" cy="166" r="2.6" style="--dx:-18px"/>
            <circle cx="297" cy="169" r="2.2" style="--dx:26px"/>
            <circle cx="263" cy="169" r="2.4" style="--dx:-26px"/>
          </g>
          <g class="hw-drill">
            <rect x="258" y="14" width="44" height="36" rx="6" fill="#475062"/>
            <rect x="270" y="50" width="20" height="8" rx="2" fill="#5A6478"/>
            <rect x="273" y="58" width="14" height="90" fill="#7C8698"/>
            <path d="M273 70 h14 M273 84 h14 M273 98 h14 M273 112 h14 M273 126 h14 M273 140 h14" stroke="#5F6B82" stroke-width="2"/>
            <polygon points="273,148 287,148 280,163" fill="#5A6478"/>
          </g>
          <g class="hw-plate">
            <rect x="222" y="146" width="116" height="14" rx="3" fill="#C6CDDA" stroke="#A8B0C2"/>
          </g>
          <g class="hw-anchor">
            <rect x="274" y="100" width="12" height="192" fill="#8792A6" stroke="#6E7890" stroke-width="0.6"/>
            <path d="M274 104 h12 M274 111 h12 M274 118 h12 M274 125 h12 M274 132 h12" stroke="#6E7890" stroke-width="1.4"/>
            <polygon points="274,292 286,292 293,306 267,306" fill="#6E7890"/>
            <path class="hw-clipL" d="M269 254 h6 v34 l-6 8 z" fill="#A2ACBF" stroke="#7C8698" stroke-width="0.8"/>
            <path class="hw-clipR" d="M291 254 h-6 v34 l6 8 z" fill="#A2ACBF" stroke="#7C8698" stroke-width="0.8"/>
            <rect x="256" y="140" width="48" height="6" rx="2" fill="#9AA4B8"/>
            <g class="hw-nut">
              <polygon points="264,118 268,109 292,109 296,118 292,127 268,127" fill="#5F6B82" stroke="#475062"/>
            </g>
          </g>
          <g class="hw-ins" fill="none" stroke="#D80710" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M268 52 l12 12 l12 -12"/>
            <path d="M268 72 l12 12 l12 -12"/>
          </g>
          <g class="hw-rot" fill="none" stroke="#D80710" stroke-width="3.5" stroke-linecap="round">
            <path d="M280 82 A36 36 0 1 1 247 103"/>
            <path d="M247 103 l14 2 M247 103 l6 -13"/>
          </g>
          <g class="hw-grip" fill="none" stroke="#D80710" stroke-width="3.5" stroke-linecap="round">
            <path d="M263 283 H241 M241 283 l9 -6 M241 283 l9 6"/>
            <path d="M297 283 H319 M319 283 l-9 -6 M319 283 l-9 6"/>
          </g>
          <g class="hw-cone" fill="none" stroke="#0233A0" stroke-width="1.6" opacity="0.55">
            <path d="M270 288 L172 163"/>
            <path d="M290 288 L388 163"/>
            <path d="M272 292 L215 163"/>
            <path d="M288 292 L345 163"/>
          </g>
          <g class="hw-load">
            <g class="arrN">
              <line x1="280" y1="96" x2="280" y2="58" stroke="#D80710" stroke-width="4"/>
              <polygon points="271,62 289,62 280,46" fill="#D80710"/>
              <text x="296" y="60" font-size="14" font-weight="800" fill="#D80710">N</text>
            </g>
            <g class="arrV">
              <line x1="340" y1="153" x2="372" y2="153" stroke="#0233A0" stroke-width="4"/>
              <polygon points="372,146 372,160 388,153" fill="#0233A0"/>
              <text x="352" y="141" font-size="14" font-weight="800" fill="#0233A0">V</text>
            </g>
          </g>
          <g class="hw-ok">
            <rect x="398" y="58" width="100" height="34" rx="17" fill="#16A34A"/>
            <text x="448" y="80" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">SECURE ✓</text>
          </g>
          <g class="hw-tag tag-s0"><rect x="20" y="18" width="172" height="32" rx="9" fill="#0233A0" opacity="0.93"/>
            <text x="106" y="39" text-anchor="middle" font-size="12.5" font-weight="800" fill="#fff" letter-spacing="1">STEP 1 · DRILL</text></g>
          <g class="hw-tag tag-s1"><rect x="20" y="18" width="172" height="32" rx="9" fill="#0233A0" opacity="0.93"/>
            <text x="106" y="39" text-anchor="middle" font-size="12.5" font-weight="800" fill="#fff" letter-spacing="1">STEP 2 · INSERT</text></g>
          <g class="hw-tag tag-s2"><rect x="20" y="18" width="172" height="32" rx="9" fill="#0233A0" opacity="0.93"/>
            <text x="106" y="39" text-anchor="middle" font-size="12.5" font-weight="800" fill="#fff" letter-spacing="1">STEP 3 · TIGHTEN</text></g>
          <g class="hw-tag tag-s3"><rect x="20" y="18" width="172" height="32" rx="9" fill="#16A34A" opacity="0.95"/>
            <text x="106" y="39" text-anchor="middle" font-size="12.5" font-weight="800" fill="#fff" letter-spacing="1">STEP 4 · LOADED</text></g>
        </svg>
      </div>
      <aside class="how-side">
        <ol class="how-steps" id="howSteps">
          <li class="on"><b><span class="n">1</span>Drill</b><span>Drill a hole to the specified diameter and embedment depth, then clear the dust.</span></li>
          <li><b><span class="n">2</span>Insert</b><span>Drive the anchor through the fixture until the washer seats against the surface.</span></li>
          <li><b><span class="n">3</span>Tighten</b><span>Torque the nut — the cone pulls up and expands the clip hard against the concrete.</span></li>
          <li><b><span class="n">4</span>Load</b><span>The expanded clip locks into the base material, resisting tension (N) and shear (V).</span></li>
        </ol>
        <div class="how-bar"><i id="howBar" class="run"></i></div>
      </aside>
    </div>
  </div></section>
  <section class="section tint"><div class="shell">
    <div class="sec-head reveal" data-fx="left"><div><span class="kick">Certified performance</span>
      <h2>ETA Approved Range</h2>
      <p>Independently assessed to European Technical Assessment standards for guaranteed, repeatable performance in concrete.</p></div>
      <a class="sec-link" href="#/eta">About ETA →</a></div>
    <div class="grid">${eta}</div>
  </div></section>
  ${criteriaBand(false)}
  <section class="section tint"><div class="shell">
    <div class="sec-head reveal" data-fx="left"><div><span class="kick">In development</span>
      <h2>Coming soon to the range</h2></div>
      <a class="sec-link" href="#/coming-soon">See what's next →</a></div>
    <div class="cs-grid">${cs}</div>
  </div></section>
  ${faqBand()}
  ${ctaBand()}`;
}

function vProducts(params) {
  const active = params.get("cat") || "all";
  const chips = [["all","All products"]]
    .concat(DATA.categories.map(c => [c.slug, c.name]))
    .concat([["eta","ETA approved"]]);
  return `
  ${pageHero("All Products", "16 product series · 34 models and variants — filter by category or search by name.",
    [{t:"Home",href:"#/"},{t:"Products"}])}
  <section class="section"><div class="shell">
    <div class="toolbar">
      ${chips.map(([slug, n]) => `<button class="chip ${active === slug ? "on" : ""}" data-filter="${slug}">${esc(n)}</button>`).join("")}
      <label class="search"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
      <input type="search" id="pSearch" placeholder="Search products…" aria-label="Search products"></label>
    </div>
    <div class="grid" id="pGrid"></div>
    <p class="empty" id="pEmpty" hidden>No products match your search.</p>
  </div></section>`;
}

function vCategory(slug) {
  const c = cat(slug);
  if (!c) return v404();
  const list = prods().filter(p => p.cat === slug).map((p, i) => pCard(p, i)).join("");
  return `
  ${pageHero(c.name, esc(c.desc), [{t:"Home",href:"#/"},{t:"Products",href:"#/products"},{t:c.name}])}
  <section class="section"><div class="shell">
    <div class="grid">${list}</div>
  </div></section>
  ${ctaBand()}`;
}

function vProduct(slug) {
  const p = prods().find(x => x.slug === slug);
  if (!p) return v404();
  const rel = prods().filter(x => x.cat === p.cat && x.slug !== slug).slice(0, 4);
  const acc = (title, items) => !items || !items.length ? "" : `
    <div class="d-panel"><button type="button" data-acc><span>${title}</span><span class="chev">▼</span></button>
      <div class="d-content"><div class="d-content-inner"><ul>${items.map(i => `<li>${esc(i)}</li>`).join("")}</ul></div></div>
    </div>`;
  const specFig = (tables, title) => !tables.length ? "" : `
    <div class="spec-block reveal"><h2>${title}</h2><div class="spec-imgs">
      ${tables.map(t => specTable(t, `${esc(p.name)} — ${title}`)).join("")}
    </div></div>`;
  const plainFig = (srcs, title) => !srcs.length ? "" : `
    <div class="spec-block reveal"><h2>${title}</h2><div class="spec-imgs">
      ${srcs.map(s => `<figure class="tbl"><img src="${s}" alt="${esc(p.name)} — ${title}" loading="lazy"></figure>`).join("")}
    </div></div>`;
  return `
  ${pageHero(p.name, "", [{t:"Home",href:"#/"},{t:"Products",href:"#/products"},{t:catName(p.cat),href:"#/category/"+p.cat},{t:p.name}])}
  <section class="section"><div class="shell">
    <div class="detail">
      <div class="gallery reveal">
        <div class="g-main"><img id="gMain" src="${p.photos[0]}" alt="${esc(p.name)}"></div>
        ${p.photos.length > 1 ? `<div class="g-thumbs">${p.photos.map((s, i) =>
          `<button type="button" class="${i === 0 ? "on" : ""}" data-g="${s}" aria-label="Photo ${i + 1}"><img src="${s}" alt="" loading="lazy"></button>`).join("")}</div>` : ""}
      </div>
      <div class="reveal d1">
        ${p.eta ? `<span class="d-eta">✓&nbsp; ETA APPROVED</span>` : ""}
        <h1 class="d-title">${esc(p.name)}</h1>
        ${p.lead ? `<p class="d-lead">${esc(p.lead)}</p>` : ""}
        ${p.adv && p.adv.length ? `<ul class="adv-list">${p.adv.map(a =>
          `<li><span class="tick">✓</span><span>${esc(a)}</span></li>`).join("")}</ul>` : ""}
        ${acc("Applications", p.apps)}
        ${acc("Base material", p.base)}
        ${acc("Anchor material", p.bar)}
        <div class="hero-cta" style="margin-top:22px">
          <a class="btn btn-navy" href="#/contact">Request a quote</a>
          <a class="btn btn-line" href="#/category/${p.cat}">More in this range</a>
        </div>
      </div>
    </div>
    ${p.variants && p.variants.length ? `
      <div class="spec-block reveal"><h2>Models &amp; technical data</h2>
      <div class="variant-list">${p.variants.map(v => `
        <div class="v-item"><button type="button" data-acc><span>${esc(v.name)}</span><span class="chev">▼</span></button>
        <div class="v-body"><div class="v-body-inner">${v.img
          ? specTable(v, `${esc(v.name)} specification table`)
          : `<p class="v-none">Specification table for this model is available on request — <a href="#/contact">contact our team</a>.</p>`}</div></div></div>`).join("")}
      </div></div>` : ""}
    ${specFig(p.specs, "Technical Details")}
    ${plainFig(p.install, "Installation")}
    ${rel.length ? `<div class="rel-row"><div class="sec-head"><div><span class="kick">${esc(catName(p.cat))}</span>
      <h2>Related products</h2></div></div><div class="grid">${rel.map((r, i) => pCard(r, i)).join("")}</div></div>` : ""}
  </div></section>`;
}

function vEta() {
  const eta = prods().filter(p => p.eta).map((p, i) => pCard(p, i)).join("");
  return `
  ${pageHero("ETA Approved Range", "Six anchor series independently assessed to European Technical Assessment standards.",
    [{t:"Home",href:"#/"},{t:"ETA Approved Range"}])}
  <section class="section"><div class="shell">
    <div class="eta-strip reveal">
      <img src="assets/img/site/eta-logo.jpg" alt="ETA — European Technical Assessment">
      <p><strong>What is an ETA?</strong> A European Technical Assessment is an independent, Europe-wide
      verification of an anchor's load performance, safety and durability. Every anchor in this range is
      produced and audited against its assessed specification — so performance on site matches the datasheet.</p>
    </div>
    <div class="opt-cards">
      <div class="opt-card"><h3>Option 1 — cracked concrete</h3>
        <p>Assessed for use in <strong>cracked and non-cracked</strong> concrete — the benchmark for structural
        and safety-critical connections.</p></div>
      <div class="opt-card red"><h3>Option 7 — non-cracked concrete</h3>
        <p>Assessed for use in <strong>non-cracked</strong> concrete — dependable performance for general
        anchoring where cracking is not a design condition.</p></div>
    </div>
    <div class="grid">${eta}</div>
  </div></section>
  ${ctaBand()}`;
}

function vComing() {
  const cs = DATA.coming.map((c, i) => `
    <div class="cs-card reveal d${i % 4}">
      <div class="cs-thumb"><span class="cs-tag">COMING SOON</span><img src="${c.imgs[0]}" alt="${esc(c.name)}" loading="lazy"></div>
      <div class="cs-body"><h3>${esc(c.name)}</h3><p>${esc(c.desc)}</p></div>
    </div>`).join("");
  return `
  ${pageHero("Coming Soon", "New lines in development — launching to the Safeguard Anchors range.",
    [{t:"Home",href:"#/"},{t:"Coming Soon"}])}
  <section class="section"><div class="shell">
    <div class="cs-grid">${cs}</div>
    <div class="eta-strip reveal" style="margin-top:34px">
      <img src="assets/img/site/cs-chemical-tools.jpg" alt="" style="width:150px;object-fit:cover;aspect-ratio:3/2">
      <p><strong>Also in development:</strong> Direct Fasteners and Heavy-Duty Chemical Anchoring ranges.
      Want early specifications or samples? <a href="#/contact">Talk to our team</a>.</p>
    </div>
  </div></section>`;
}

function vDownloads() {
  return `
  ${pageHero("Technical Resources", "Specification tables, installation details and assessment documents for the Safeguard Anchors range.",
    [{t:"Home",href:"#/"},{t:"Technical Resources"}])}
  <section class="section"><div class="shell">
    <div class="dl-grid">
      <a class="dl-card reveal" href="#/products">
        <span class="dl-icon">≡</span><h3>Product specifications</h3>
        <p>Every product page carries its full technical detail table — product references, dimensions,
        drill diameters, embedment depths and packing quantities.</p>
        <span class="p-more">Browse products →</span></a>
      <a class="dl-card reveal d1" href="#/eta">
        <span class="dl-icon">✓</span><h3>ETA approved range</h3>
        <p>Six anchor series independently assessed to European Technical Assessment standards.</p>
        <span class="p-more">View the range →</span></a>
      <a class="dl-card reveal d2" href="#/contact">
        <span class="dl-icon">✉</span><h3>Assessment documents</h3>
        <p>ETA certificates and declarations of performance are issued on request — tell us the
        product and application and our team will send the current documents.</p>
        <span class="p-more">Request documents →</span></a>
    </div>
  </div></section>
  ${criteriaBand(true)}
  ${ctaBand()}`;
}

function vAbout() {
  return `
  ${pageHero("About Safeguard Anchors", "A privately owned fixing and fastening specialist, engineered in Taiwan.",
    [{t:"Home",href:"#/"},{t:"About Us"}])}
  <section class="section"><div class="shell about-grid">
    <div class="reveal">
      <span class="kick">Who we are</span>
      <h2>Fixing solutions built on engineering, not shortcuts</h2>
      <p>Safeguard Anchors is a privately owned enterprise specialising in innovative fixing and fastening
      solutions. Our range is manufactured across Taiwan and China under one quality system, and our
      engineering team develops custom products tailored to each client's application.</p>
      <p>From lightweight interior fixings to ETA-approved structural anchors, every product is designed to
      do one thing: hold — reliably, safely, and for the life of the building.</p>
    </div>
    <img class="reveal d1" src="assets/img/site/about-1.jpg" alt="Safeguard Anchors products" loading="lazy">
  </section>
  <section class="section tint"><div class="shell">
    <div class="sec-head reveal"><div><span class="kick">Quality</span>
      <h2>Rigorously tested products</h2></div></div>
    <p class="lead-p reveal">${esc(DATA.about.tested)}</p>
  </div></section>
  <section class="section"><div class="shell">
    <div class="sec-head reveal"><div><span class="kick">Our mission</span>
      <h2>What we are working towards</h2></div></div>
    <ol class="mission-list">
      ${DATA.about.mission.map((m, i) => `
        <li class="reveal d${i}" data-fx="left"><span class="m-n">${i + 1}</span><p>${esc(m)}</p></li>`).join("")}
    </ol>
  </div></section>
  <section class="section tint"><div class="shell">
    <div class="sec-head reveal"><div><span class="kick">Our approach</span>
      <h2>How we get there</h2></div></div>
    <div class="appr-grid">
      ${DATA.about.approach.map((a, i) => `
        <div class="appr-card reveal d${i}" data-fx="zoom">
          <span class="appr-n">${i + 1}</span>
          <h3>${esc(a.t)}</h3><p>${esc(a.d)}</p>
        </div>`).join("")}
    </div>
  </div></section>
  <section class="stats"><div class="shell stats-row reveal">
    <div class="stat"><b><span data-count="16">0</span><span class="plus">+</span></b><span>Product series</span></div>
    <div class="stat"><b><span data-count="34">0</span><span class="plus">+</span></b><span>Models &amp; variants</span></div>
    <div class="stat"><b><span data-count="6">0</span></b><span>ETA-approved products</span></div>
    <div class="stat"><b><span data-count="2">0</span></b><span>Production bases</span></div>
  </div></section>
  ${faqBand()}
  ${ctaBand()}`;
}

function vContact() {
  return `
  ${pageHero("Contact Us", "A product, a range, a project — tell us what you're fixing and we'll get back to you.",
    [{t:"Home",href:"#/"},{t:"Contact"}])}
  <section class="section"><div class="shell contact-grid">
    <div class="c-info reveal">
      <h2>Talk to our team</h2>
      <div class="c-item"><span class="ico">🏢</span><div><b>Safeguard Anchors Enterprise Company Ltd.</b>
        <span>Unified Business No. 23028748</span></div></div>
      <div class="c-item"><span class="ico">📍</span><div><b>Taipei Head Office</b>
        <span>7F.-1, No. 388, Sec. 1, Neihu Rd.,<br>Neihu Dist., Taipei City 114, Taiwan (R.O.C.)</span></div></div>
      <div class="c-item"><span class="ico">👤</span><div><b>Contact person</b>
        <span>Brian Huang</span></div></div>
      <div class="c-item"><span class="ico">☎</span><div><b>Tel / Fax</b>
        <span>Tel: +886-2-8797-8358<br>Fax: +886-2-8797-8269</span></div></div>
      <div class="c-item"><span class="ico">✉</span><div><b>Email</b>
        <span><a href="mailto:safegaurd@sf-guard.com">safegaurd@sf-guard.com</a></span></div></div>
      <div class="c-item"><span class="ico">🕘</span><div><b>Office hours</b>
        <span>Mon–Fri, 09:00–18:00 (GMT+8)</span></div></div>
    </div>
    <form class="form reveal d1" id="cForm" novalidate>
      <div class="form-row">
        <div class="field"><label for="fn">First name</label><input id="fn" name="fn" required autocomplete="given-name"></div>
        <div class="field"><label for="ln">Surname</label><input id="ln" name="ln" required autocomplete="family-name"></div>
      </div>
      <div class="form-row">
        <div class="field"><label for="em">Email</label><input id="em" name="em" type="email" required autocomplete="email"></div>
        <div class="field"><label for="ph">Contact number</label><input id="ph" name="ph" type="tel" autocomplete="tel"></div>
      </div>
      <div class="field"><label for="msg">Message</label><textarea id="msg" name="msg" rows="5" required></textarea></div>
      <button class="btn btn-red" type="submit">Send message</button>
      <p class="form-note">Demo form — connect it to your mail service or CRM before launch.</p>
    </form>
  </div></section>`;
}

const v404 = () => `
  ${pageHero("Page not found", "The page you're looking for doesn't exist.", [{t:"Home",href:"#/"},{t:"404"}])}
  <section class="section"><div class="shell empty"><p>Let's get you back on solid ground.</p>
  <a class="btn btn-navy" href="#/">Back to home</a></div></section>`;

/* ---------- router ---------- */
function route() {
  const raw = (location.hash || "#/").slice(1);
  const [path, query] = raw.split("?");
  const params = new URLSearchParams(query || "");
  const seg = path.split("/").filter(Boolean);
  let html, nav = "home";
  if (seg.length === 0) { html = vHome(); nav = "home"; }
  else if (seg[0] === "products") { html = vProducts(params); nav = "products"; }
  else if (seg[0] === "category" && seg[1]) { html = vCategory(seg[1]); nav = "products"; }
  else if (seg[0] === "product" && seg[1]) { html = vProduct(seg[1]); nav = "products"; }
  else if (seg[0] === "eta") { html = vEta(); nav = "eta"; }
  else if (seg[0] === "coming-soon") { html = vComing(); nav = "products"; }
  else if (seg[0] === "downloads") { html = vDownloads(); nav = "downloads"; }
  else if (seg[0] === "about") { html = vAbout(); nav = "about"; }
  else if (seg[0] === "contact") { html = vContact(); nav = "contact"; }
  else { html = v404(); }
  app.innerHTML = `<div class="view">${html}</div>`;
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  $$(".main-nav a[data-nav]").forEach(a => a.classList.toggle("active", a.dataset.nav === nav));
  closeDrawer();
  afterRender(seg, params);
}

/* ---------- post-render behaviours ---------- */
let io, ioCnt;
function afterRender(seg, params) {
  /* reveal on scroll */
  if (io) io.disconnect();
  io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach(el => io.observe(el));

  /* counters */
  if (ioCnt) ioCnt.disconnect();
  ioCnt = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    ioCnt.unobserve(e.target);
    const el = e.target, end = +el.dataset.count, t0 = performance.now(), dur = 1100;
    const step = t => { const k = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: 0.6 });
  $$("[data-count]").forEach(el => ioCnt.observe(el));

  /* how-it-works animated diagram */
  const howDiag = $("#howDiag");
  if (howDiag) {
    const steps = $$("#howSteps li"), bar = $("#howBar");
    let cur = 0, timer = null;
    const set = i => {
      cur = i;
      howDiag.setAttribute("class", "how-diagram s" + i);
      steps.forEach((s, j) => s.classList.toggle("on", j === i));
      if (bar) { bar.classList.remove("run"); void bar.offsetWidth; bar.classList.add("run"); }
    };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } if (bar) bar.style.animationPlayState = "paused"; };
    const play = () => {
      if (timer) clearInterval(timer);
      if (bar) bar.style.animationPlayState = "";
      timer = setInterval(() => set((cur + 1) % 4), 3400);
    };
    steps.forEach((s, i) => s.addEventListener("click", () => { set(i); play(); }));
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      set(3); if (bar) bar.hidden = true;
    } else {
      const ioHow = new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? play() : stop()), { threshold: 0.3 });
      ioHow.observe(howDiag);
      howDiag.addEventListener("mouseenter", stop);
      howDiag.addEventListener("mouseleave", play);
    }
  }

  /* products filter page */
  if (seg[0] === "products") {
    const grid = $("#pGrid"), empty = $("#pEmpty"), input = $("#pSearch");
    let filter = params.get("cat") || "all";
    const apply = () => {
      const q = (input.value || "").trim().toLowerCase();
      const list = prods().filter(p =>
        (filter === "all" || (filter === "eta" ? p.eta : p.cat === filter)) &&
        (!q || p.name.toLowerCase().includes(q) || catName(p.cat).toLowerCase().includes(q)));
      grid.innerHTML = list.map((p, i) => pCard(p, i)).join("");
      empty.hidden = list.length > 0;
      $$(".reveal", grid).forEach(el => { el.classList.add("in"); });
    };
    $$(".chip").forEach(ch => ch.addEventListener("click", () => {
      filter = ch.dataset.filter;
      $$(".chip").forEach(x => x.classList.toggle("on", x === ch));
      apply();
    }));
    input.addEventListener("input", apply);
    apply();
  }

  /* gallery */
  const gMain = $("#gMain");
  if (gMain) $$("[data-g]").forEach(b => b.addEventListener("click", () => {
    $$("[data-g]").forEach(x => x.classList.remove("on"));
    b.classList.add("on");
    gMain.src = b.dataset.g;
  }));

  /* accordions */
  $$("[data-acc]").forEach(b => b.addEventListener("click", () => {
    b.closest(".d-panel, .v-item").classList.toggle("open");
  }));

  /* contact form */
  const form = $("#cForm");
  if (form) form.addEventListener("submit", e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    form.innerHTML = `<div class="sent">✓ Thanks — your message has been noted.<br>
      <span style="font-weight:500">This demo form doesn't send email yet; wire it to your mail service before launch.</span></div>`;
  });
}

/* ---------- chrome behaviours ---------- */
const header = $("#siteHeader"), toTop = $("#toTop");
addEventListener("scroll", () => {
  header.classList.toggle("scrolled", scrollY > 8);
  toTop.hidden = scrollY < 640;
}, { passive: true });
toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

const drawer = $("#drawer"), backdrop = $("#drawerBackdrop"), menuBtn = $("#menuBtn");
function openDrawer() {
  drawer.hidden = false; backdrop.hidden = false;
  requestAnimationFrame(() => { drawer.classList.add("open"); backdrop.classList.add("show"); });
  document.body.classList.add("no-scroll");
  menuBtn.setAttribute("aria-expanded", "true");
}
function closeDrawer() {
  if (drawer.hidden) return;
  drawer.classList.remove("open"); backdrop.classList.remove("show");
  document.body.classList.remove("no-scroll");
  menuBtn.setAttribute("aria-expanded", "false");
  setTimeout(() => { drawer.hidden = true; backdrop.hidden = true; }, 320);
}
menuBtn.addEventListener("click", openDrawer);
$("#drawerClose").addEventListener("click", closeDrawer);
backdrop.addEventListener("click", closeDrawer);
$$("#drawer a").forEach(a => a.addEventListener("click", closeDrawer));
addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });

$("#yr").textContent = new Date().getFullYear();

/* ---------- PWA ---------- */
if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
  addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}

addEventListener("hashchange", route);
route();
})();
