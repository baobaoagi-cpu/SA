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
const CATALOGUE_URL = "https://www.construction-anchors.com/wp-content/uploads/2024/04/CA-CATALOGUE-2024_compressed.pdf";

/* ---------- shared partials ---------- */
const pCard = (p, i) => `
  <a class="p-card reveal ${i < 4 ? "d" + i : ""}" href="#/product/${p.slug}">
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
    <a class="cat-card reveal d${i}" href="#/category/${c.slug}">
      <img src="${c.banner}" alt="" loading="lazy">
      <div class="cat-body"><h3>${esc(c.name)}</h3><span>${c.count} product ${c.count > 1 ? "series" : "series"}</span>
      <span class="go">Explore →</span></div>
    </a>`).join("");
  const eta = prods().filter(p => p.eta).map((p, i) => pCard(p, i)).join("");
  const cs = DATA.coming.map((c, i) => `
    <a class="cs-card reveal d${i}" href="#/coming-soon">
      <div class="cs-thumb"><span class="cs-tag">COMING SOON</span><img src="${c.imgs[0]}" alt="${esc(c.name)}" loading="lazy"></div>
      <div class="cs-body"><h3>${esc(c.name)}</h3><p>${esc(c.desc)}</p></div>
    </a>`).join("");
  return `
  <section class="hero">
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
          <span class="hero-ring"></span><span class="hero-ring r2"></span>
          <img class="hero-logo" src="assets/img/logo.png" alt="Safeguard Anchors">
        </div>
      </div>
    </div>
  </section>
  <section class="stats"><div class="shell stats-row">
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
  <section class="section tint"><div class="shell">
    <div class="sec-head reveal"><div><span class="kick">Certified performance</span>
      <h2>ETA Approved Range</h2>
      <p>Independently assessed to European Technical Assessment standards for guaranteed, repeatable performance in concrete.</p></div>
      <a class="sec-link" href="#/eta">About ETA →</a></div>
    <div class="grid">${eta}</div>
  </div></section>
  <section class="section"><div class="shell">
    <div class="sec-head reveal"><div><span class="kick">In development</span>
      <h2>Coming soon to the range</h2></div>
      <a class="sec-link" href="#/coming-soon">See what's next →</a></div>
    <div class="cs-grid">${cs}</div>
  </div></section>
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
  const specFig = (srcs, title) => !srcs.length ? "" : `
    <div class="spec-block reveal"><h2>${title}</h2><div class="spec-imgs">
      ${srcs.map(s => `<figure><img src="${s}" alt="${esc(p.name)} — ${title}" loading="lazy"></figure>`).join("")}
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
          <a class="btn btn-line" href="${CATALOGUE_URL}" target="_blank" rel="noopener">Catalogue (PDF)</a>
        </div>
      </div>
    </div>
    ${p.variants && p.variants.length ? `
      <div class="spec-block reveal"><h2>Models &amp; technical data</h2>
      <div class="variant-list">${p.variants.map(v => `
        <div class="v-item"><button type="button" data-acc><span>${esc(v.name)}</span><span class="chev">▼</span></button>
        <div class="v-body"><div class="v-body-inner">${v.img ? `<img src="${v.img}" alt="${esc(v.name)} specification table" loading="lazy">` : `<p style="color:var(--ink-2)">Specification table available in the catalogue.</p>`}</div></div></div>`).join("")}
      </div></div>` : ""}
    ${specFig(p.specs, "Specifications")}
    ${specFig(p.install, "Installation")}
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
  ${pageHero("Download Centre", "Catalogues, datasheets and certificates for the Safeguard Anchors range.",
    [{t:"Home",href:"#/"},{t:"Downloads"}])}
  <section class="section"><div class="shell">
    <div class="dl-grid">
      <a class="dl-card reveal" href="${CATALOGUE_URL}" target="_blank" rel="noopener">
        <span class="dl-icon">⤓</span><h3>Product Catalogue 2024</h3>
        <p>The full range — dimensions, load data, finishes and packaging.</p>
        <span class="p-more">Download PDF →</span></a>
      <a class="dl-card reveal d1" href="#/products">
        <span class="dl-icon">≡</span><h3>Product datasheets</h3>
        <p>Specification tables and installation details are published on each product page.</p>
        <span class="p-more">Browse products →</span></a>
      <a class="dl-card reveal d2" href="#/contact">
        <span class="dl-icon">✓</span><h3>ETA certificates</h3>
        <p>Assessment documents for the ETA-approved range, available on request.</p>
        <span class="p-more">Request documents →</span></a>
    </div>
  </div></section>
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
  <section class="section"><div class="shell">
    <div class="mission reveal">
      <div><h3>Our mission</h3><p>To become a trusted global partner for construction professionals while
      maintaining superior product and service quality at every step.</p></div>
      <div><h3>Our approach</h3><p>Cutting-edge tooling, continuous innovation, and the flexibility to adapt —
      because the fastening industry never stands still, and neither do we.</p></div>
    </div>
  </div></section>
  <section class="stats"><div class="shell stats-row">
    <div class="stat"><b><span data-count="16">0</span><span class="plus">+</span></b><span>Product series</span></div>
    <div class="stat"><b><span data-count="34">0</span><span class="plus">+</span></b><span>Models &amp; variants</span></div>
    <div class="stat"><b><span data-count="6">0</span></b><span>ETA-approved products</span></div>
    <div class="stat"><b><span data-count="2">0</span></b><span>Production bases</span></div>
  </div></section>
  ${ctaBand()}`;
}

function vContact() {
  return `
  ${pageHero("Contact Us", "A product, a range, a project — tell us what you're fixing and we'll get back to you.",
    [{t:"Home",href:"#/"},{t:"Contact"}])}
  <section class="section"><div class="shell contact-grid">
    <div class="c-info reveal">
      <h2>Talk to our team</h2>
      <div class="c-item"><span class="ico">📍</span><div><b>Head Office</b>
        <span>9F, No. 21, Sec. 3, Xinsheng S. Rd.,<br>Da'an Dist., Taipei City 106, Taiwan (R.O.C.)</span></div></div>
      <div class="c-item"><span class="ico">✉</span><div><b>Email</b>
        <span>sales@safeguard-anchors.example</span></div></div>
      <div class="c-item"><span class="ico">☎</span><div><b>Phone</b>
        <span>+886-2-XXXX-XXXX</span></div></div>
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
