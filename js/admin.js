/* Sri Chandana Jewellers — admin panel.
   Front-end only: data is stored in this browser's localStorage (see js/store.js).
   Default login password is documented in README.md; change it under Settings. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const db = () => SCJ.db;
  const inr = SCJ.inr;
  const DEFAULT_HASH = '20deec8e1c183ed10b76c5219e7dadb3a1b0d372a5aa981a5be5604b2dd56983';
  const SESSION = 'scj_admin_session';

  const P = {
    dash: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
    rate: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 6-6"/>',
    box: '<path d="M21 8 12 3 3 8v8l9 5 9-5Z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
    cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>',
    cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    coins: '<circle cx="8" cy="8" r="6"/><path d="M18.1 10.4A6 6 0 1 1 10.3 18"/>',
    img: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    cog: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    out: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
    ext: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    wa: '<path d="M21 11.5a8.4 8.4 0 0 1-12.6 7.3L3 21l2.3-5.3A8.4 8.4 0 1 1 21 11.5Z"/>',
    dl: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>'
  };
  const ic = (n, c = 'icon-sm') => `<svg class="icon ${c}" viewBox="0 0 24 24" aria-hidden="true">${P[n]}</svg>`;
  const LOGO = `<span class="logo"><img class="logo-mark" src="assets/logo-mark.png" alt="" width="30" height="52"><span class="logo-text"><strong>Sri Chandana</strong><span>Admin Console</span></span></span>`;

  const toast = msg => { const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = ic('check') + `<span>${esc(msg)}</span>`; $('#toasts').appendChild(t); setTimeout(() => t.remove(), 3500); };
  const fmtDate = d => new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const slug = s => String(s).toLowerCase().replace(/\s+/g, '-');
  const pill = s => `<span class="pill ${slug(s)}">${esc(s)}</span>`;
  const sel = (opts, v, attrs = '') => `<select class="status-sel" ${attrs}>${opts.map(o => `<option ${o === v ? 'selected' : ''}>${o}</option>`).join('')}</select>`;

  // ---------- SHA-256 (works on file:// where crypto.subtle may be unavailable) ----------
  function sha256(str) {
    const K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
    const bytes = new TextEncoder().encode(str); const l = bytes.length;
    const words = new Uint32Array(((l + 9 + 63) >> 6) << 4);
    bytes.forEach((b, i) => words[i >> 2] |= b << (24 - (i % 4) * 8));
    words[l >> 2] |= 0x80 << (24 - (l % 4) * 8); words[words.length - 1] = l * 8;
    let H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    const r = (x, n) => (x >>> n) | (x << (32 - n)); const w = new Uint32Array(64);
    for (let i = 0; i < words.length; i += 16) {
      for (let t = 0; t < 64; t++) w[t] = t < 16 ? words[i + t] : (r(w[t - 2], 17) ^ r(w[t - 2], 19) ^ (w[t - 2] >>> 10)) + w[t - 7] + (r(w[t - 15], 7) ^ r(w[t - 15], 18) ^ (w[t - 15] >>> 3)) + w[t - 16];
      let [a, b, c, d, e, f, g, h] = H;
      for (let t = 0; t < 64; t++) {
        const t1 = (h + (r(e, 6) ^ r(e, 11) ^ r(e, 25)) + ((e & f) ^ (~e & g)) + K[t] + w[t]) | 0;
        const t2 = ((r(a, 2) ^ r(a, 13) ^ r(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      H = H.map((v, k) => (v + [a, b, c, d, e, f, g, h][k]) | 0);
    }
    return H.map(v => (v >>> 0).toString(16).padStart(8, '0')).join('');
  }
  const adminHash = () => db().settings.adminHash || DEFAULT_HASH;
  const cloudOn = () => !!(SCJ.cloud && SCJ.cloud.on);
  const loggedIn = () => { if (cloudOn()) return SCJ.cloud.admin; try { return sessionStorage.getItem(SESSION) === adminHash(); } catch (e) { return false; } };

  // ---------- login ----------
  function renderLogin(err = '') {
    $('#root').innerHTML = `<div class="login"><div class="login-art"><div><span class="eyebrow" style="color:var(--gold-soft)">Sri Chandana Jewellers</span><h2>Manage your website, gold rate and schemes in one place.</h2><p>Update the gold rate, ornament prices, photos and schemes — changes appear on the website instantly.</p></div></div>
      <div class="login-box"><form id="loginForm" novalidate>${LOGO}<h1 style="font-size:2.2rem">Staff Sign In</h1><p class="muted">${cloudOn() ? 'Sign in with the owner\'s email and password.' : 'Enter the admin password to continue.'}</p>
        ${cloudOn() ? `<div class="field"><label for="em">Email</label><input id="em" type="email" autocomplete="username" required value="${esc((SCJ_FIREBASE.adminEmails || [])[0] || '')}"></div>` : ''}
        <div class="field ${err ? 'invalid' : ''}"><label for="pw">Password</label><input id="pw" type="password" autocomplete="current-password" required aria-describedby="pwErr"><span class="err" id="pwErr">${esc(err || 'Enter your password.')}</span></div>
        <label class="toggle"><input type="checkbox" id="showPw"> Show password</label>
        <button class="btn btn-primary btn-block" style="margin-top:10px" id="signBtn">Sign In</button>
        ${cloudOn() ? '<p style="margin-top:14px;font-size:13px"><button type="button" class="linkish" id="forgot">Forgot password? Email me a reset link</button></p>' : ''}
        <p style="margin-top:22px;font-size:13px"><a href="index.html" style="color:var(--maroon);text-decoration:underline">← Back to website</a></p></form></div></div>`;
    $('#pw').focus();
    $('#showPw').addEventListener('change', e => $('#pw').type = e.target.checked ? 'text' : 'password');
    $('#forgot')?.addEventListener('click', async () => {
      const em = $('#em').value.trim(); if (!em) return toast('Type your email first');
      try { await SCJ.cloud.resetPassword(em); toast('Password reset link sent to ' + em); } catch (er) { toast('Could not send the reset email. Check the address.'); }
    });
    $('#loginForm').addEventListener('submit', async e => {
      e.preventDefault(); const v = $('#pw').value;
      if (!v) return renderLogin('Enter your password.');
      if (cloudOn()) {
        const btn = $('#signBtn'); btn.disabled = true; btn.textContent = 'Signing in…';
        try { await SCJ.cloud.signIn($('#em').value.trim(), v); await SCJ.liveRate.apply(); return renderApp(); }
        catch (er) { return renderLogin(/not allowed/.test(er.message) ? er.message : 'Incorrect email or password. Please try again.'); }
      }
      if (sha256(v) !== adminHash()) return renderLogin('Incorrect password. Please try again.');
      try { sessionStorage.setItem(SESSION, adminHash()); } catch (e) { }
      renderApp();
    });
  }

  // ---------- shell ----------
  const VIEWS = [
    ['dash', 'Dashboard', 'dash'], ['rates', 'Gold Rates', 'rate'], ['products', 'Ornaments & Prices', 'box'],
    ['schemes', 'Gold Schemes', 'coins'], ['banners', 'Homepage Banners', 'img'], ['settings', 'Settings', 'cog']
  ];
  let view = (location.hash.slice(1) || 'dash');
  if (!VIEWS.some(v => v[0] === view)) view = 'dash';

  function counts() {
    return { schemes: db().schemes.filter(a => a.status === 'New').length };
  }

  function renderApp() {
    const c = counts();
    $('#root').innerHTML = `<div class="app"><aside class="side" id="side" aria-label="Admin navigation">${LOGO}
      <nav>${VIEWS.map(([k, l, i]) => `<button data-view="${k}" ${k === view ? 'aria-current="page"' : ''}>${ic(i)}<span>${l}</span>${c[k] ? `<span class="count">${c[k]}</span>` : ''}</button>`).join('')}</nav>
      <div class="side-foot"><a href="index.html" target="_blank" rel="noopener">${ic('ext')} View website</a><button id="logout">${ic('out')} Sign out</button></div></aside>
      <div class="drawer-bg" id="sideBg"></div>
      <div class="main"><header class="topbar"><div style="display:flex;align-items:center;gap:8px"><button class="icon-btn mob-top" id="sideOpen" aria-label="Open navigation">${ic('menu', '')}</button><h1 id="viewTitle"></h1></div>
        <div class="who"><span class="sync ${cloudOn() ? 'on' : ''}" title="${cloudOn() ? 'Changes are saved online and seen by every customer' : 'Online database not set up — changes stay in this browser'}">${cloudOn() ? 'Online' : 'This browser only'}</span><span>Today's 22K${SCJ.live ? ' (live)' : ''}: <b style="color:var(--maroon)" class="tnum">${inr(SCJ.rates.k22)}</b>/g</span><div class="avatar" aria-hidden="true">SC</div></div></header>
        <div class="content" id="content"></div></div></div>`;
    $$('[data-view]').forEach(b => b.addEventListener('click', () => go(b.dataset.view)));
    $('#logout').addEventListener('click', async () => { if (cloudOn()) await SCJ.cloud.signOut(); try { sessionStorage.removeItem(SESSION); } catch (e) { } renderLogin(); });
    $('#sideOpen').addEventListener('click', () => { $('#side').classList.add('open'); $('#sideBg').classList.add('open'); });
    $('#sideBg').addEventListener('click', closeSide);
    show();
  }
  const closeSide = () => { $('#side')?.classList.remove('open'); $('#sideBg')?.classList.remove('open'); };
  function go(v) { view = v; location.hash = v; closeSide(); renderApp(); $('#content').focus?.(); window.scrollTo(0, 0); }
  function show() {
    $('#viewTitle').textContent = VIEWS.find(v => v[0] === view)[1];
    document.title = VIEWS.find(v => v[0] === view)[1] + ' | Sri Chandana Admin';
    ({ dash, rates, products, schemes, banners, settings })[view]();
  }
  const refresh = () => renderApp();

  // ---------- dashboard ----------
  function dash() {
    const d = db(); const c = counts();
    const members = d.schemes.filter(m => m.status === 'Active' || m.status === 'New').length;
    const r = d.rates; const auto = d.settings.autoRate && d.settings.autoRate.on;
    const liveBox = auto ? `<div class="box quick-rate"><div class="qr-head"><div><h3 style="margin:0">Today's Gold Rate <span class="pill active">Automatic</span></h3>
        <p class="muted" style="margin:4px 0 0;font-size:13px">${SCJ.live ? `Following the live market · updated ${fmtDate(SCJ.live.updated)}. Prices on the website change on their own.` : 'The live price could not be loaded just now, so your saved manual rates below are being used.'}</p></div>
        <button type="button" class="btn btn-outline btn-sm" data-go="rates">Adjust premium</button></div>
        ${SCJ.live ? `<div class="live-grid">${RATE_FIELDS.map(([k, l]) => `<div><span>${l}</span><strong class="tnum">${inr(SCJ.live[k])}</strong><small>per gram</small></div>`).join('')}</div>` : ''}
      </div>` : '';
    $('#content').innerHTML = `${liveBox}
      <form class="box quick-rate" id="quickRate" novalidate ${auto ? 'hidden' : ''}>
        <div class="qr-head"><div><h3 style="margin:0">Today's Gold Rate</h3><p class="muted" style="margin:4px 0 0;font-size:13px">Type today's rate per gram and press Save. Every product price on the website changes automatically.<br>Last updated ${fmtDate(r.updated)}</p></div>
          <button type="button" class="btn btn-outline btn-sm" id="qrAuto">Fill 22K &amp; 18K from 24K</button></div>
        <div class="rate-form">${RATE_FIELDS.map(([k, l]) => `<div class="field"><label for="q-${k}">${l} (₹/g)</label><input id="q-${k}" name="${k}" type="number" inputmode="numeric" min="1" step="1" value="${r[k]}" required><span class="err">Enter a valid rate.</span></div>`).join('')}</div>
        <button class="btn btn-primary">Save Today's Rates</button>
      </form>
      <div class="kpis">
        <div class="kpi"><span>Ornaments on website</span><strong>${d.products.length}</strong><small>${d.products.filter(p => p.featured).length} featured on homepage</small></div>
        <div class="kpi"><span>Scheme members</span><strong>${members}</strong><small>${c.schemes ? c.schemes + ' new sign-ups to call' : 'No new sign-ups'}</small></div>
        <div class="kpi"><span>Scheme plans</span><strong>${(d.settings.schemePlans || []).length}</strong><small>Shown on the Gold Schemes page</small></div>
        <div class="kpi"><span>Homepage banners</span><strong>${d.banners.length}</strong><small>Slides at the top of the homepage</small></div>
      </div>
      <div class="box"><h3>Change the website</h3><div class="shortcuts">
        <button type="button" data-go="products">${ic('box')}<span><strong>Ornaments &amp; Prices</strong><small>Weight, making charges, photos</small></span></button>
        <button type="button" data-go="schemes">${ic('coins')}<span><strong>Gold Schemes</strong><small>Plans and member passbooks</small></span></button>
        <button type="button" data-go="banners">${ic('img')}<span><strong>Homepage Banners</strong><small>Big images and offers</small></span></button>
        <button type="button" data-go="settings">${ic('cog')}<span><strong>Store Details</strong><small>Phone, hours, address</small></span></button>
      </div></div>`;
    $$('[data-go]').forEach(b => b.addEventListener('click', () => go(b.dataset.go)));
    $('#qrAuto').addEventListener('click', () => autoFill($('#quickRate')));
    $('#quickRate').addEventListener('submit', e => { e.preventDefault(); if (publishRates(e.target)) refresh(); });
  }

  // ---------- rates ----------
  const RATE_FIELDS = [['k24', '24K Gold'], ['k22', '22K Gold'], ['k18', '18K Gold'], ['silver', 'Silver']];
  function publishRates(f) {
    let ok = true;
    RATE_FIELDS.forEach(([k]) => { const i = f[k]; const bad = !(+i.value > 0); i.closest('.field').classList.toggle('invalid', bad); if (bad) ok = false; });
    if (!ok) return false;
    const d = db(); d.rateHistory.unshift({ ...d.rates });
    d.rates = { k24: +f.k24.value, k22: +f.k22.value, k18: +f.k18.value, silver: +f.silver.value, updated: new Date().toISOString() };
    SCJ.save(); toast('Rates saved — all prices on the website are updated'); return true;
  }
  function autoFill(f) { const k24 = +f.k24.value; if (k24 > 0) { f.k22.value = Math.round(k24 * .916); f.k18.value = Math.round(k24 * .75); } }
  function rates() {
    const r = db().rates; const a = db().settings.autoRate || { on: false, premium: 6, silverPremium: 8, ratio22: 91.6, ratio18: 75 };
    $('#content').innerHTML = `<form class="box quick-rate" id="autoForm" novalidate>
      <div class="qr-head"><div><h3 style="margin:0">Automatic Gold Rate</h3><p class="muted" style="margin:4px 0 0;font-size:13px">Uses the live international gold &amp; silver price in rupees, plus your premium (import duty and margin). GST is added on each product separately.</p></div>
        <label class="switch"><input type="checkbox" name="on" ${a.on ? 'checked' : ''}><span>Automatic</span></label></div>
      <div class="rate-form">
        <div class="field"><label for="a-prem">Gold premium (%)</label><input id="a-prem" name="premium" type="number" step="0.1" value="${a.premium}"></div>
        <div class="field"><label for="a-r22">22K as % of 24K</label><input id="a-r22" name="ratio22" type="number" step="0.1" value="${a.ratio22}"></div>
        <div class="field"><label for="a-r18">18K as % of 24K</label><input id="a-r18" name="ratio18" type="number" step="0.1" value="${a.ratio18}"></div>
        <div class="field"><label for="a-sprem">Silver premium (%)</label><input id="a-sprem" name="silverPremium" type="number" step="0.1" value="${a.silverPremium}"></div>
      </div>
      <div class="live-grid" id="autoPreview"><p class="muted">Loading live price…</p></div>
      <p class="muted" style="font-size:13px;margin:12px 0 16px" id="autoSrc"></p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><button class="btn btn-primary">Save Automatic Settings</button>
        <span class="muted" style="font-size:13px">Tip: compare with your board rate once and adjust the premium until they match.</span></div></form>
      <form class="box" id="rateForm" novalidate style="margin-top:18px"><h3>${a.on ? 'Manual Rates — used only if the live price can\'t be loaded' : 'Update Today\'s Rates (₹ per gram)'}</h3>
      <div class="rate-form">${[['k24', '24K Gold'], ['k22', '22K Gold'], ['k18', '18K Gold'], ['silver', 'Silver']].map(([k, l]) => `<div class="field"><label for="r-${k}">${l}</label><input id="r-${k}" name="${k}" type="number" inputmode="numeric" min="1" step="1" value="${r[k]}" required><span class="err">Enter a valid rate.</span></div>`).join('')}</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><button class="btn btn-primary">Save &amp; Publish Rates</button><button type="button" class="btn btn-outline" id="auto22">Auto-fill 22K &amp; 18K from 24K</button>
      <span class="muted" style="font-size:13px">All product prices on the website update instantly.</span></div></form>
      <div class="box" style="margin-top:18px"><h3>Rate History</h3><div class="table-wrap" style="border:0"><table class="t"><thead><tr><th>Date</th><th class="num">24K</th><th class="num">22K</th><th class="num">18K</th><th class="num">Silver</th></tr></thead><tbody>
      ${db().rateHistory.slice(0, 30).map(h => `<tr><td>${fmtDate(h.updated)}</td><td class="num">${inr(h.k24)}</td><td class="num">${inr(h.k22)}</td><td class="num">${inr(h.k18)}</td><td class="num">${inr(h.silver)}</td></tr>`).join('') || '<tr><td colspan="5" class="empty-row">History will appear after your first update.</td></tr>'}</tbody></table></div></div>`;
    $('#auto22').addEventListener('click', () => autoFill($('#rateForm')));
    const af = $('#autoForm');
    const vals = () => ({ on: af.on.checked, premium: +af.premium.value || 0, silverPremium: +af.silverPremium.value || 0, ratio22: +af.ratio22.value || 91.6, ratio18: +af.ratio18.value || 75 });
    const preview = () => {
      if (!SCJ.livePx) return;
      const c = SCJ.liveRate.compute(SCJ.livePx, vals());
      $('#autoPreview').innerHTML = RATE_FIELDS.map(([k, l]) => `<div><span>${l}</span><strong class="tnum">${inr(c[k])}</strong><small>per gram</small></div>`).join('');
      $('#autoSrc').textContent = `International price now: 24K ${inr(SCJ.livePx.xau / SCJ.liveRate.OZ)}/g · Silver ${inr(SCJ.livePx.xag / SCJ.liveRate.OZ)}/g (before premium) · source gold-api.com · ${fmtDate(SCJ.livePx.at)}`;
    };
    SCJ.liveRate.fetchPx().then(px => { SCJ.livePx = px; preview(); }).catch(() => { $('#autoPreview').innerHTML = '<p class="muted">The live price could not be loaded right now. Your manual rates will be used until it is back.</p>'; });
    af.addEventListener('input', preview);
    af.addEventListener('submit', async e => { e.preventDefault(); db().settings.autoRate = vals(); SCJ.save(); await SCJ.liveRate.apply(); toast(vals().on ? 'Automatic rate is on — website prices follow the live market' : 'Automatic rate is off — your manual rates are used'); refresh(); });
    $('#rateForm').addEventListener('submit', e => { e.preventDefault(); if (publishRates(e.target)) refresh(); });
  }

  // ---------- products ----------
  let pFilter = { q: '', cat: '' };
  function products() {
    const cats = [...new Set(db().products.map(p => p.category))].sort();
    $('#content').innerHTML = `<div class="tools"><div style="display:flex;gap:10px;flex-wrap:wrap;flex:1"><label class="sr-only" for="pq">Search products</label><input class="search-in" id="pq" placeholder="Search by name or SKU" value="${esc(pFilter.q)}">
      <label class="sr-only" for="pc">Category</label><select id="pc"><option value="">All categories</option>${cats.map(c => `<option ${c === pFilter.cat ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
      <button class="btn btn-primary btn-sm" id="addP">${ic('plus')} Add Ornament</button></div>
      <div class="table-wrap"><table class="t"><thead><tr><th>Product</th><th>Category</th><th>Purity</th><th class="num">Weight</th><th class="num">Making</th><th class="num">Price today</th><th><span class="sr-only">Actions</span></th></tr></thead><tbody id="pBody"></tbody></table></div>`;
    const draw = () => {
      const q = pFilter.q.toLowerCase();
      const list = db().products.filter(p => (!pFilter.cat || p.category === pFilter.cat) && (!q || (p.name + p.id).toLowerCase().includes(q)));
      $('#pBody').innerHTML = list.map(p => `<tr><td><div class="prod-cell"><img src="${p.images[0]}" alt=""><div><strong>${esc(p.name)}</strong><small>${p.id} · ${esc(p.collection)}${p.featured ? ' · ★ Featured' : ''}</small></div></div></td>
        <td>${esc(p.category)}</td><td>${esc(p.purity)} ${esc(p.metal)}</td><td class="num">${p.weight} g</td><td class="num">${p.making}%</td><td class="num">${inr(SCJ.priceOf(p).total)}${p.hidePrice ? '<br><small class="muted">hidden on website</small>' : ''}</td>
        <td><div class="row-actions"><a class="ibtn" href="product.html?id=${p.id}" target="_blank" rel="noopener" aria-label="View ${esc(p.name)} on website">${ic('eye')}</a><button class="ibtn" data-edit="${p.id}" aria-label="Edit ${esc(p.name)}">${ic('edit')}</button><button class="ibtn danger" data-del="${p.id}" aria-label="Delete ${esc(p.name)}">${ic('trash')}</button></div></td></tr>`).join('') || '<tr><td colspan="7" class="empty-row">No products match.</td></tr>';
    };
    draw();
    $('#pq').addEventListener('input', e => { pFilter.q = e.target.value; draw(); });
    $('#pc').addEventListener('change', e => { pFilter.cat = e.target.value; draw(); });
    $('#addP').addEventListener('click', () => productForm());
    $('#pBody').addEventListener('click', e => {
      const ed = e.target.closest('[data-edit]'), del = e.target.closest('[data-del]');
      if (ed) productForm(SCJ.product(ed.dataset.edit));
      if (del) { const p = SCJ.product(del.dataset.del); if (confirm(`Delete "${p.name}"? This cannot be undone.`)) { db().products = db().products.filter(x => x.id !== p.id); SCJ.save(); toast('Product deleted'); draw(); } }
    });
  }

  function productForm(p) {
    const isNew = !p;
    p = p || { id: '', name: '', category: 'Necklaces', collection: 'Daily Wear', metal: 'Gold', purity: '22K', weight: 10, making: 12, stoneValue: 0, images: [], gender: 'Women', tags: [], featured: false, description: '' };
    let imgs = [...p.images];
    const CATS = ['Necklaces', 'Necklace Sets', 'Earrings', 'Rings', 'Bangles', 'Bracelets', 'Chains', 'Pendants', 'Mangalsutra', 'Coins'];
    const COLS = ['Bridal', 'Temple', 'Kundan', 'Diamond', 'Daily Wear', 'Wedding', 'Men', 'Coins', 'Silver'];
    const o = (arr, v) => arr.map(x => `<option ${x === v ? 'selected' : ''}>${x}</option>`).join('');
    const dlg = $('#dlg');
    dlg.innerHTML = `<form method="dialog" id="pForm" novalidate><div class="modal-head"><h3 id="dlgTitle">${isNew ? 'Add New Ornament' : 'Edit ' + esc(p.name)}</h3><button type="button" class="icon-btn" data-x aria-label="Close">${ic('x')}</button></div>
      <div class="modal-body scroll">
        <div class="live-price"><span>Live price at today's rate</span><strong id="livePrice"></strong></div>
        <div class="form-3">
          <div class="field full"><label for="f-name">Ornament name <span class="req">*</span></label><input id="f-name" name="name" value="${esc(p.name)}" required><span class="err">Name is required.</span></div>
          <div class="field"><label for="f-cat">Category</label><select id="f-cat" name="category">${o(CATS, p.category)}</select></div>
          <div class="field"><label for="f-col">Collection</label><select id="f-col" name="collection">${o(COLS, p.collection)}</select></div>
          <div class="field"><label for="f-gender">For</label><select id="f-gender" name="gender">${o(['Women', 'Men', 'Unisex', 'Kids'], p.gender)}</select></div>
          <div class="field"><label for="f-metal">Metal</label><select id="f-metal" name="metal">${o(['Gold', 'Diamond', 'Silver'], p.metal)}</select></div>
          <div class="field"><label for="f-purity">Purity</label><select id="f-purity" name="purity">${o(['24K', '22K', '18K', '925'], p.purity)}</select></div>
          <div class="field"><label for="f-weight">Net weight (g) <span class="req">*</span></label><input id="f-weight" name="weight" type="number" step="0.01" min="0.01" value="${p.weight}" required><span class="err">Enter weight.</span></div>
          <div class="field"><label for="f-gross">Gross weight (g)</label><input id="f-gross" name="grossWeight" type="number" step="0.001" min="0" value="${p.grossWeight || ''}" placeholder="optional"></div>
          <div class="field"><label for="f-making">Making charges (%)</label><input id="f-making" name="making" type="number" step="0.5" min="0" value="${p.making}"></div>
          <div class="field"><label for="f-stone">Stone / diamond value (₹)</label><input id="f-stone" name="stoneValue" type="number" min="0" value="${p.stoneValue}"></div>
          <div class="field"><label for="f-tags">Tags</label><input id="f-tags" name="tags" value="${esc(p.tags.join(', '))}" placeholder="new, bestseller, gift"><span class="hint">new · bestseller · gift · bridal</span></div>
          <div class="field full"><label for="f-desc">Description</label><textarea id="f-desc" name="description">${esc(p.description)}</textarea></div>
          <div class="field full"><span class="label">Images <span class="req">*</span></span>
            <div style="display:flex;gap:8px;flex-wrap:wrap"><label class="sr-only" for="f-url">Image URL</label><input id="f-url" placeholder="Paste image URL (https://…)" style="flex:1;min-width:220px;min-height:44px;border:1px solid var(--line);border-radius:4px;padding:0 12px;background:#fff"><button type="button" class="btn btn-outline btn-sm" id="addUrl">Add URL</button>
            <label class="btn btn-outline btn-sm" style="cursor:pointer">Upload photo<input type="file" accept="image/*" id="f-file" multiple hidden></label></div>
            <div class="img-list" id="imgList"></div><span class="err" id="imgErr">Add at least one image.</span></div>
          <label class="toggle full"><input type="checkbox" name="featured" ${p.featured ? 'checked' : ''}> Feature on homepage</label>
          <label class="toggle full"><input type="checkbox" name="showPrice" ${p.hidePrice ? '' : 'checked'}> Show price on website <span class="muted" style="font-size:12.5px">(when off, customers see the weight and an "Ask today's price" WhatsApp button)</span></label>
        </div></div>
      <div class="modal-foot"><button type="button" class="btn btn-outline btn-sm" data-x>Cancel</button><button class="btn btn-primary btn-sm" type="submit">${isNew ? 'Add Product' : 'Save Changes'}</button></div></form>`;
    const f = $('#pForm');
    const drawImgs = () => { $('#imgList').innerHTML = imgs.map((s, i) => `<figure><img src="${esc(s)}" alt="Product image ${i + 1}"><button type="button" data-rmimg="${i}" aria-label="Remove image ${i + 1}">✕</button></figure>`).join(''); };
    const live = () => { $('#livePrice').textContent = inr(SCJ.priceOf({ weight: +f.weight.value || 0, purity: f.purity.value, making: +f.making.value || 0, stoneValue: +f.stoneValue.value || 0 }).total); };
    drawImgs(); live();
    f.addEventListener('input', live); f.addEventListener('change', live);
    $('#addUrl').addEventListener('click', () => { const u = $('#f-url').value.trim(); if (/^https?:\/\//.test(u)) { imgs.push(u); $('#f-url').value = ''; drawImgs(); } else toast('Enter a valid image URL'); });
    $('#f-file').addEventListener('change', e => {
      [...e.target.files].forEach(file => {
        const rd = new FileReader();
        rd.onload = () => { // downscale to keep localStorage small
          const im = new Image(); im.onload = () => { const c = document.createElement('canvas'); const s = Math.min(1, 800 / Math.max(im.width, im.height)); c.width = im.width * s; c.height = im.height * s; c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); imgs.push(c.toDataURL('image/jpeg', .75)); drawImgs(); }; im.src = rd.result;
        };
        rd.readAsDataURL(file);
      });
    });
    $('#imgList').addEventListener('click', e => { const b = e.target.closest('[data-rmimg]'); if (b) { imgs.splice(+b.dataset.rmimg, 1); drawImgs(); } });
    $$('[data-x]', dlg).forEach(b => b.addEventListener('click', () => dlg.close()));
    f.addEventListener('submit', e => {
      e.preventDefault(); let ok = true;
      ['name', 'weight'].forEach(n => { const bad = !f[n].value.trim() || (n === 'weight' && !(+f[n].value > 0)); f[n].closest('.field').classList.toggle('invalid', bad); if (bad) ok = false; });
      const imgBad = !imgs.length; $('#imgErr').style.display = imgBad ? 'block' : 'none'; if (imgBad) ok = false;
      if (!ok) { f.querySelector('.invalid input')?.focus(); return; }
      const data = { name: f.name.value.trim(), category: f.category.value, collection: f.collection.value, gender: f.gender.value, metal: f.metal.value, purity: f.purity.value, weight: +f.weight.value, making: +f.making.value || 0, stoneValue: +f.stoneValue.value || 0, grossWeight: +f.grossWeight.value || 0, hidePrice: !f.showPrice.checked, tags: f.tags.value.split(',').map(t => t.trim().toLowerCase()).filter(Boolean), description: f.description.value.trim(), featured: f.featured.checked, images: imgs };
      if (isNew) {
        const max = Math.max(1000, ...db().products.map(x => +x.id.replace(/\D/g, '') || 0));
        db().products.unshift({ id: 'SCJ' + (max + 1), created: Date.now(), ...data });
      } else Object.assign(SCJ.product(p.id), data);
      try { SCJ.save(); } catch (err) { toast('Storage full — use image URLs instead of uploads'); return; }
      dlg.close(); toast(isNew ? 'Product added to website' : 'Product updated'); products();
    });
    dlg.showModal();
  }

  // ---------- gold schemes: members + plans ----------
  let schemeTab = 'members';
  const planOf = m => (db().settings.schemePlans || []).find(p => p.name === m.plan) || { months: 11, bonusMonths: 0 };
  const paidOf = m => (m.payments || []).reduce((a, x) => a + x.amount, 0);
  function schemes() {
    const tabs = `<div class="seg" role="tablist" style="margin:0 0 18px">${[['members', 'Members & Payments'], ['plans', 'Scheme Plans']].map(([k, l]) => `<button role="tab" type="button" aria-checked="${k === schemeTab}" aria-selected="${k === schemeTab}" data-stab="${k}">${l}</button>`).join('')}</div>`;
    schemeTab === 'plans' ? schemePlans(tabs) : schemeMembers(tabs);
    $$('[data-stab]').forEach(b => b.addEventListener('click', () => { schemeTab = b.dataset.stab; schemes(); }));
  }
  function schemeMembers(tabs) {
    const list = db().schemes; const ST = ['New', 'Active', 'Matured', 'Redeemed', 'Closed'];
    const active = list.filter(m => m.status === 'Active');
    const collected = list.reduce((a, m) => a + paidOf(m), 0);
    $('#content').innerHTML = `${tabs}
      <div class="kpis"><div class="kpi"><span>Members</span><strong>${list.length}</strong><small>${active.length} active</small></div>
        <div class="kpi"><span>Total Collected</span><strong>${inr(collected)}</strong><small>All instalments recorded</small></div>
        <div class="kpi"><span>New Requests</span><strong>${list.filter(m => m.status === 'New').length}</strong><small>Call back to complete KYC</small></div>
        <div class="kpi"><span>Due This Month</span><strong>${active.filter(m => !(m.payments || []).some(x => x.date.slice(0, 7) === new Date().toISOString().slice(0, 7))).length}</strong><small>Active members not yet paid</small></div></div>
      <div class="tools"><p class="muted" style="margin:0">Online enrolments appear here. Add walk-in members yourself.</p><button class="btn btn-primary btn-sm" id="addM">${ic('plus')} Add Member</button></div>
      <div class="table-wrap"><table class="t"><thead><tr><th>Member</th><th>Plan</th><th class="num">Monthly</th><th>Progress</th><th class="num">Paid</th><th>Status</th><th><span class="sr-only">Actions</span></th></tr></thead><tbody>
      ${list.map(m => { const pl = planOf(m); const n = (m.payments || []).length; const pct = Math.min(100, n / (pl.months || 11) * 100);
        return `<tr><td><strong>${esc(m.name)}</strong><br><small class="muted">${esc(m.phone)}${m.city ? ' · ' + esc(m.city) : ''} · since ${new Date(m.created).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</small></td>
        <td>${esc(m.plan)}</td><td class="num">${inr(m.amount)}</td>
        <td><div class="prog" title="${n} of ${pl.months || 11} instalments"><i style="width:${pct}%"></i></div><small class="muted">${n} / ${pl.months || 11} paid</small></td>
        <td class="num">${inr(paidOf(m))}</td>
        <td><label class="sr-only" for="ms-${m.id}">Status</label>${sel(ST, m.status, `id="ms-${m.id}" data-mst="${m.id}"`)}</td>
        <td><div class="row-actions"><button class="btn btn-outline btn-sm" data-pay="${m.id}">+ Payment</button><button class="ibtn" data-mview="${m.id}" aria-label="Passbook for ${esc(m.name)}">${ic('eye')}</button>${/^\d{10}$/.test(m.phone) ? `<a class="ibtn" href="https://wa.me/91${m.phone}?text=${encodeURIComponent(`Namaste ${m.name}, this is a reminder for your ${m.plan} instalment of ${inr(m.amount)} at Sri Chandana Jewellers. Thank you!`)}" target="_blank" rel="noopener" aria-label="WhatsApp reminder to ${esc(m.name)}">${ic('wa')}</a>` : ''}<button class="ibtn danger" data-mdel="${m.id}" aria-label="Delete ${esc(m.name)}">${ic('trash')}</button></div></td></tr>`; }).join('') || '<tr><td colspan="7" class="empty-row">No scheme members yet.</td></tr>'}
      </tbody></table></div>`;
    $$('[data-mst]').forEach(x => x.addEventListener('change', () => { list.find(m => m.id === x.dataset.mst).status = x.value; SCJ.save(); toast('Status updated'); }));
    $$('[data-pay]').forEach(b => b.addEventListener('click', () => payForm(list.find(m => m.id === b.dataset.pay))));
    $$('[data-mview]').forEach(b => b.addEventListener('click', () => passbook(list.find(m => m.id === b.dataset.mview))));
    $$('[data-mdel]').forEach(b => b.addEventListener('click', () => { if (confirm('Delete this member and all their payment records?')) { db().schemes = list.filter(m => m.id !== b.dataset.mdel); SCJ.save(); schemes(); } }));
    $('#addM').addEventListener('click', memberForm);
  }
  function memberForm() {
    const plans = db().settings.schemePlans || []; const dlg = $('#dlg');
    dlg.innerHTML = `<form id="mForm" novalidate><div class="modal-head"><h3 id="dlgTitle">Add Scheme Member</h3><button type="button" class="icon-btn" data-x aria-label="Close">${ic('x')}</button></div>
      <div class="modal-body"><div class="form-2">
        <div class="field"><label for="m-name">Full name <span class="req">*</span></label><input id="m-name" name="name" required><span class="err">Name is required.</span></div>
        <div class="field"><label for="m-phone">Mobile <span class="req">*</span></label><input id="m-phone" name="phone" inputmode="numeric" maxlength="10" pattern="[6-9][0-9]{9}" required><span class="err">Enter a 10-digit mobile number.</span></div>
        <div class="field"><label for="m-plan">Plan</label><select id="m-plan" name="plan">${plans.map(p => `<option>${esc(p.name)}</option>`).join('')}</select></div>
        <div class="field"><label for="m-amt">Monthly amount (₹) <span class="req">*</span></label><input id="m-amt" name="amount" type="number" min="100" step="100" value="1000" required><span class="err">Enter an amount.</span></div>
        <div class="field full"><label for="m-city">Town / Village</label><input id="m-city" name="city"></div>
      </div></div>
      <div class="modal-foot"><button type="button" class="btn btn-outline btn-sm" data-x>Cancel</button><button class="btn btn-primary btn-sm">Add Member</button></div></form>`;
    $$('[data-x]', dlg).forEach(x => x.addEventListener('click', () => dlg.close()));
    $('#mForm').addEventListener('submit', e => {
      e.preventDefault(); const f = e.target; let ok = true;
      [['name', v => v.trim()], ['phone', v => /^[6-9]\d{9}$/.test(v)], ['amount', v => +v > 0]].forEach(([n, t]) => { const bad = !t(f[n].value); f[n].closest('.field').classList.toggle('invalid', bad); if (bad) ok = false; });
      if (!ok) return;
      db().schemes.unshift({ id: SCJ.uid('SCH'), name: f.name.value.trim(), phone: f.phone.value, plan: f.plan.value, amount: +f.amount.value, city: f.city.value.trim(), payments: [], status: 'Active', created: new Date().toISOString() });
      SCJ.save(); dlg.close(); toast('Member added'); schemes();
    });
    dlg.showModal();
  }
  function payForm(m) {
    const dlg = $('#dlg'); const today = new Date().toISOString().slice(0, 10); const k22 = db().rates.k22;
    dlg.innerHTML = `<form id="payF" novalidate><div class="modal-head"><h3 id="dlgTitle">Record Payment — ${esc(m.name)}</h3><button type="button" class="icon-btn" data-x aria-label="Close">${ic('x')}</button></div>
      <div class="modal-body"><div class="form-2">
        <div class="field"><label for="p-amt">Amount (₹) <span class="req">*</span></label><input id="p-amt" name="amount" type="number" min="1" value="${m.amount}" required><span class="err">Enter an amount.</span></div>
        <div class="field"><label for="p-date">Date</label><input id="p-date" name="date" type="date" value="${today}" max="${today}"></div>
        <div class="field"><label for="p-mode">Mode</label><select id="p-mode" name="mode"><option>Cash</option><option>UPI</option><option>Card</option><option>Bank Transfer</option></select></div>
        <div class="field"><label for="p-rate">22K rate that day (₹/g)</label><input id="p-rate" name="rate" type="number" min="1" value="${k22}"><span class="hint">Used to book grams for weight plans</span></div>
      </div><p class="muted" id="gramsOut" style="margin:6px 0 0;font-size:13px"></p></div>
      <div class="modal-foot"><button type="button" class="btn btn-outline btn-sm" data-x>Cancel</button><button class="btn btn-primary btn-sm">Save Payment</button></div></form>`;
    const f = $('#payF'); const g = () => { $('#gramsOut').textContent = `= ${((+f.amount.value || 0) / (+f.rate.value || 1)).toFixed(3)} g of 22K gold at this rate`; }; g();
    f.addEventListener('input', g);
    $$('[data-x]', dlg).forEach(x => x.addEventListener('click', () => dlg.close()));
    f.addEventListener('submit', e => {
      e.preventDefault(); const bad = !(+f.amount.value > 0); f.amount.closest('.field').classList.toggle('invalid', bad); if (bad) return;
      m.payments = m.payments || []; m.payments.push({ amount: +f.amount.value, date: f.date.value || today, mode: f.mode.value, rate: +f.rate.value || k22 });
      if (m.status === 'New') m.status = 'Active';
      if (m.payments.length >= (planOf(m).months || 11) && m.status === 'Active') m.status = 'Matured';
      SCJ.save(); dlg.close(); toast(`Payment of ${inr(+f.amount.value)} recorded`); schemes();
    });
    dlg.showModal();
  }
  function passbook(m) {
    const pl = planOf(m); const pays = m.payments || []; const paid = paidOf(m); const grams = pays.reduce((a, x) => a + x.amount / (x.rate || db().rates.k22), 0);
    const bonus = m.amount * (pl.bonusMonths || 0); const dlg = $('#dlg');
    dlg.innerHTML = `<div class="modal-head"><h3 id="dlgTitle">Passbook — ${esc(m.name)}</h3><button class="icon-btn" data-x aria-label="Close">${ic('x')}</button></div>
      <div class="modal-body scroll" id="pbook"><p style="margin:0 0 12px"><strong>${esc(m.plan)}</strong> · ${inr(m.amount)}/month · ${esc(m.phone)}</p>
        <div class="table-wrap"><table class="t"><thead><tr><th>#</th><th>Date</th><th>Mode</th><th class="num">Amount</th><th class="num">22K rate</th><th class="num">Grams</th></tr></thead><tbody>
        ${pays.map((x, i) => `<tr><td>${i + 1}</td><td>${new Date(x.date).toLocaleDateString('en-IN')}</td><td>${esc(x.mode)}</td><td class="num">${inr(x.amount)}</td><td class="num">${inr(x.rate)}</td><td class="num">${(x.amount / x.rate).toFixed(3)}</td></tr>`).join('') || '<tr><td colspan="6" class="empty-row">No payments yet.</td></tr>'}</tbody></table></div>
        <div style="margin-top:12px"><div class="sum-row"><span>Instalments paid</span><span>${pays.length} / ${pl.months || 11}</span></div><div class="sum-row"><span>Total paid</span><span>${inr(paid)}</span></div>
        ${bonus ? `<div class="sum-row"><span>Bonus at maturity (up to)</span><span>${inr(bonus)}</span></div>` : `<div class="sum-row"><span>Gold booked (22K)</span><span>${grams.toFixed(3)} g</span></div>`}</div></div>
      <div class="modal-foot"><button class="btn btn-outline btn-sm" id="printPb">Print</button><button class="btn btn-primary btn-sm" data-x>Close</button></div>`;
    $$('[data-x]', dlg).forEach(x => x.addEventListener('click', () => dlg.close()));
    $('#printPb').addEventListener('click', () => { const w = window.open('', '_blank'); w.document.write(`<html><head><title>Passbook ${esc(m.name)}</title><link rel="stylesheet" href="css/style.css"><link rel="stylesheet" href="css/admin.css"></head><body style="padding:30px;background:#fff"><h2>${esc(db().settings.name)}</h2>${$('#pbook').innerHTML}<script>setTimeout(()=>print(),400)<\/script></body></html>`); w.document.close(); });
    dlg.showModal();
  }
  function schemePlans(tabs) {
    const plans = db().settings.schemePlans = db().settings.schemePlans || [];
    $('#content').innerHTML = `${tabs}
      <div class="tools"><p class="muted" style="margin:0">These plans are shown on the website's Gold Schemes page and its calculator.</p><button class="btn btn-primary btn-sm" id="addPl">${ic('plus')} Add Plan</button></div>
      <div class="plan-admin">${plans.map(p => `<article class="box"><div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start"><div><span class="eyebrow">${esc(p.tag)}</span><h3 style="margin:4px 0">${esc(p.name)}${p.popular ? ' <span class="pill active">Most Popular</span>' : ''}</h3></div>
        <div class="row-actions"><button class="ibtn" data-pe="${p.id}" aria-label="Edit ${esc(p.name)}">${ic('edit')}</button><button class="ibtn danger" data-pd="${p.id}" aria-label="Delete ${esc(p.name)}">${ic('trash')}</button></div></div>
        <p class="muted" style="font-size:14px">${esc(p.desc)}</p><ul style="margin:0;padding-left:18px;font-size:14px">${(p.perks || []).map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        <p style="font-size:13px;margin:12px 0 0"><b>Min</b> ${inr(p.min || 0)}/month · <b>${p.months || 11}</b> instalments · <b>Bonus</b> ${p.bonusMonths ? p.bonusMonths + ' instalment(s)' : 'none (gram booking)'}</p></article>`).join('') || '<p class="muted">No plans yet.</p>'}</div>`;
    $('#addPl').addEventListener('click', () => planForm());
    $$('[data-pe]').forEach(b => b.addEventListener('click', () => planForm(plans.find(p => p.id === b.dataset.pe))));
    $$('[data-pd]').forEach(b => b.addEventListener('click', () => { if (confirm('Delete this plan from the website?')) { db().settings.schemePlans = plans.filter(p => p.id !== b.dataset.pd); SCJ.save(); schemes(); } }));
  }
  function planForm(p) {
    const isNew = !p; p = p || { name: '', tag: '', desc: '', perks: [], min: 500, months: 11, bonusMonths: 1, popular: false };
    const dlg = $('#dlg');
    dlg.innerHTML = `<form id="plF" novalidate><div class="modal-head"><h3 id="dlgTitle">${isNew ? 'Add Scheme Plan' : 'Edit ' + esc(p.name)}</h3><button type="button" class="icon-btn" data-x aria-label="Close">${ic('x')}</button></div>
      <div class="modal-body scroll"><div class="form-2">
        <div class="field"><label for="pl-name">Plan name <span class="req">*</span></label><input id="pl-name" name="name" value="${esc(p.name)}" required><span class="err">Name is required.</span></div>
        <div class="field"><label for="pl-tag">Short label</label><input id="pl-tag" name="tag" value="${esc(p.tag)}" placeholder="e.g. 11 Monthly Instalments"></div>
        <div class="field full"><label for="pl-desc">Description</label><textarea id="pl-desc" name="desc">${esc(p.desc)}</textarea></div>
        <div class="field full"><label for="pl-perks">Benefits (one per line)</label><textarea id="pl-perks" name="perks" rows="4">${esc((p.perks || []).join('\n'))}</textarea></div>
        <div class="field"><label for="pl-min">Minimum per month (₹)</label><input id="pl-min" name="min" type="number" min="0" step="100" value="${p.min}"></div>
        <div class="field"><label for="pl-months">Number of instalments</label><input id="pl-months" name="months" type="number" min="1" max="60" value="${p.months}"></div>
        <div class="field"><label for="pl-bonus">Bonus (in instalments)</label><input id="pl-bonus" name="bonusMonths" type="number" min="0" step="0.5" value="${p.bonusMonths}"><span class="hint">0 = gram-booking plan (no cash bonus)</span></div>
        <label class="toggle" style="align-self:end"><input type="checkbox" name="popular" ${p.popular ? 'checked' : ''}> Mark as "Most Popular"</label>
      </div></div>
      <div class="modal-foot"><button type="button" class="btn btn-outline btn-sm" data-x>Cancel</button><button class="btn btn-primary btn-sm">Save Plan</button></div></form>`;
    $$('[data-x]', dlg).forEach(x => x.addEventListener('click', () => dlg.close()));
    $('#plF').addEventListener('submit', e => {
      e.preventDefault(); const f = e.target; const bad = !f.name.value.trim(); f.name.closest('.field').classList.toggle('invalid', bad); if (bad) return;
      const data = { name: f.name.value.trim(), tag: f.tag.value.trim(), desc: f.desc.value.trim(), perks: f.perks.value.split('\n').map(x => x.trim()).filter(Boolean), min: +f.min.value || 0, months: +f.months.value || 11, bonusMonths: +f.bonusMonths.value || 0, popular: f.popular.checked };
      const plans = db().settings.schemePlans;
      if (data.popular) plans.forEach(x => x.popular = false);
      if (isNew) plans.push({ id: SCJ.uid('SP'), ...data }); else Object.assign(p, data);
      SCJ.save(); dlg.close(); toast('Plan saved — website updated'); schemes();
    });
    dlg.showModal();
  }

  // ---------- banners ----------
  function banners() {
    $('#content').innerHTML = `<div class="tools"><p class="muted" style="margin:0">These slides rotate at the top of the homepage.</p><button class="btn btn-primary btn-sm" id="addB">${ic('plus')} Add Banner</button></div>
      <div class="banner-grid">${db().banners.map(b => `<article class="banner-card"><img src="${esc(b.image)}" alt=""><div><strong>${esc(b.title)}</strong><p class="muted" style="font-size:13px;margin:4px 0 10px">${esc(b.subtitle)}</p>
        <div style="display:flex;justify-content:space-between;align-items:center">${pill(b.active ? 'Active' : 'Closed')}<div class="row-actions"><button class="ibtn" data-be="${b.id}" aria-label="Edit banner">${ic('edit')}</button><button class="ibtn danger" data-bd="${b.id}" aria-label="Delete banner">${ic('trash')}</button></div></div></div></article>`).join('')}</div>`;
    $('#addB').addEventListener('click', () => bannerForm());
    $$('[data-be]').forEach(b => b.addEventListener('click', () => bannerForm(db().banners.find(x => x.id === b.dataset.be))));
    $$('[data-bd]').forEach(b => b.addEventListener('click', () => { if (confirm('Delete this banner?')) { db().banners = db().banners.filter(x => x.id !== b.dataset.bd); SCJ.save(); banners(); } }));
  }
  function bannerForm(b) {
    const isNew = !b; b = b || { title: '', subtitle: '', cta: 'Shop Now', link: 'shop.html', image: '', active: true };
    const dlg = $('#dlg');
    dlg.innerHTML = `<form id="bForm" novalidate><div class="modal-head"><h3 id="dlgTitle">${isNew ? 'Add Banner' : 'Edit Banner'}</h3><button type="button" class="icon-btn" data-x aria-label="Close">${ic('x')}</button></div>
      <div class="modal-body scroll"><div class="form-2">
        <div class="field full"><label for="b-title">Headline <span class="req">*</span></label><input id="b-title" name="title" value="${esc(b.title)}" required><span class="err">Headline is required.</span></div>
        <div class="field full"><label for="b-sub">Sub-text</label><textarea id="b-sub" name="subtitle">${esc(b.subtitle)}</textarea></div>
        <div class="field"><label for="b-cta">Button text</label><input id="b-cta" name="cta" value="${esc(b.cta)}"></div>
        <div class="field"><label for="b-link">Button link</label><input id="b-link" name="link" value="${esc(b.link)}"><span class="hint">e.g. shop.html?collection=Bridal</span></div>
        <div class="field full"><label for="b-img">Image URL <span class="req">*</span></label><input id="b-img" name="image" value="${esc(b.image)}" required><span class="err">Image URL is required.</span><span class="hint">Use a wide photo, at least 1800px.</span></div>
        <label class="toggle full"><input type="checkbox" name="active" ${b.active ? 'checked' : ''}> Show on homepage</label>
      </div></div>
      <div class="modal-foot"><button type="button" class="btn btn-outline btn-sm" data-x>Cancel</button><button class="btn btn-primary btn-sm">Save Banner</button></div></form>`;
    $$('[data-x]', dlg).forEach(x => x.addEventListener('click', () => dlg.close()));
    $('#bForm').addEventListener('submit', e => {
      e.preventDefault(); const f = e.target; let ok = true;
      ['title', 'image'].forEach(n => { const bad = !f[n].value.trim(); f[n].closest('.field').classList.toggle('invalid', bad); if (bad) ok = false; });
      if (!ok) return;
      const data = { title: f.title.value.trim(), subtitle: f.subtitle.value.trim(), cta: f.cta.value.trim() || 'Shop Now', link: f.link.value.trim() || 'shop.html', image: f.image.value.trim(), active: f.active.checked };
      if (isNew) db().banners.push({ id: SCJ.uid('B'), ...data }); else Object.assign(b, data);
      SCJ.save(); dlg.close(); toast('Banner saved'); banners();
    });
    dlg.showModal();
  }

  // ---------- settings ----------
  function settings() {
    const s = db().settings;
    const F = [['name', 'Store name'], ['tagline', 'Tagline'], ['phone', 'Phone (display)'], ['whatsapp', 'WhatsApp number (with 91, digits only)'], ['email', 'Email'], ['hours', 'Opening hours'], ['gstin', 'GSTIN (leave empty to hide)'], ['founder', 'Founder name'], ['mapUrl', 'Google Maps link (for Directions)'], ['mapQuery', 'Map search text (for the embedded map)'], ['instagram', 'Instagram URL'], ['facebook', 'Facebook URL'], ['youtube', 'YouTube URL']];
    $('#content').innerHTML = `<form class="box" id="sForm" novalidate><h3>Store Information</h3><div class="form-2">
      <div class="field full"><label for="s-address">Address</label><textarea id="s-address" name="address">${esc(s.address)}</textarea></div>
      ${F.map(([k, l]) => `<div class="field"><label for="s-${k}">${l}</label><input id="s-${k}" name="${k}" value="${esc(s[k])}"></div>`).join('')}</div>
      <label class="toggle" style="margin:4px 0 16px"><input type="checkbox" name="showPrices" ${s.showPrices ? 'checked' : ''}> Show prices and shopping bag on the website <span class="muted" style="font-size:12.5px">(off = customers see designs, weights and wishlist only)</span></label>
      <button class="btn btn-primary btn-sm">Save Store Info</button></form>
      ${cloudOn() ? `<div class="box" style="margin-top:18px"><h3>Change Password</h3><p class="muted">For your security, password changes are done by email. We'll send a reset link to ${esc((SCJ_FIREBASE.adminEmails || [])[0] || 'the owner email')}.</p><button class="btn btn-primary btn-sm" id="resetMail">Send Password Reset Email</button></div>` : ''}
      <form class="box" id="pwForm" style="margin-top:18px" novalidate ${cloudOn() ? 'hidden' : ''}><h3>Change Admin Password</h3><div class="form-2">
        <div class="field"><label for="np">New password</label><input id="np" type="password" autocomplete="new-password" minlength="8" required><span class="err">At least 8 characters.</span></div>
        <div class="field"><label for="np2">Confirm password</label><input id="np2" type="password" autocomplete="new-password" required><span class="err">Passwords do not match.</span></div></div>
        <button class="btn btn-primary btn-sm">Update Password</button></form>
      <div class="box" style="margin-top:18px"><h3>Data Backup</h3><p class="muted">${cloudOn() ? 'Your store data is saved online. You can still download a copy for safekeeping.' : 'All store data lives in this browser. Download a backup regularly, and restore it on another computer.'}</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-outline btn-sm" id="exp">${ic('dl')} Download Backup</button><label class="btn btn-outline btn-sm" style="cursor:pointer">Restore Backup<input type="file" id="imp" accept="application/json" hidden></label><button class="btn btn-outline btn-sm" id="rst" style="border-color:var(--err);color:var(--err)">Reset to Demo Data</button></div></div>`;
    $('#sForm').addEventListener('submit', e => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); d.showPrices = e.target.showPrices.checked; Object.assign(db().settings, d); SCJ.save(); toast('Store information saved'); });
    $('#pwForm').addEventListener('submit', e => {
      e.preventDefault(); const a = $('#np').value, b = $('#np2').value;
      $('#np').closest('.field').classList.toggle('invalid', a.length < 8); $('#np2').closest('.field').classList.toggle('invalid', a !== b);
      if (a.length < 8 || a !== b) return;
      db().settings.adminHash = sha256(a); SCJ.save(); try { sessionStorage.setItem(SESSION, adminHash()); } catch (er) { } e.target.reset(); toast('Password updated');
    });
    $('#resetMail')?.addEventListener('click', async () => { try { await SCJ.cloud.resetPassword(SCJ_FIREBASE.adminEmails[0]); toast('Reset link sent — check the inbox'); } catch (er) { toast('Could not send the email right now'); } });
    $('#exp').addEventListener('click', () => download(`sri-chandana-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(db(), null, 2), 'application/json'));
    $('#imp').addEventListener('change', e => { const file = e.target.files[0]; if (!file) return; const rd = new FileReader(); rd.onload = () => { try { const d = JSON.parse(rd.result); if (!d.products || !d.rates) throw 0; SCJ.replace(d); toast('Backup restored'); refresh(); } catch (er) { toast('That file is not a valid backup'); } }; rd.readAsText(file); });
    $('#rst').addEventListener('click', () => { if (confirm('Reset ALL data (ornaments, banners, scheme members) to the starting set? Download a backup first if needed.')) { SCJ.reset(); toast('Demo data restored'); refresh(); } });
  }

  function download(name, text, type) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); }

  window.addEventListener('hashchange', () => { const v = location.hash.slice(1); if (loggedIn() && v !== view && VIEWS.some(x => x[0] === v)) { view = v; renderApp(); } });
  document.addEventListener('scj:cloud-error', e => toast('Not saved online: ' + e.detail));
  $('#root').innerHTML = '<p class="muted" style="padding:40px;text-align:center">Loading store data…</p>';
  SCJ.cloudReady.then(() => SCJ.ready).then(() => loggedIn() ? renderApp() : renderLogin());
})();
