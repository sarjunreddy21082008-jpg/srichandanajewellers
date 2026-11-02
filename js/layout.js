/* Shared header, footer, cart drawer, toasts and helpers for every storefront page. */
(function () {
  const S = window.SCJ;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Lucide-style line icons (inline SVG paths)
  const ICONS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/>',
    bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    chevL: '<path d="m15 18-6-6 6-6"/>',
    chevR: '<path d="m9 18 6-6-6-6"/>',
    pause: '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>',
    play: '<path d="m6 3 14 9-14 9V3Z"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>',
    gem: '<path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>',
    receipt: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8H8M16 12H8M13 16H8"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    video: '<path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
    truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.6a1 1 0 0 0-.2-.6l-3.5-4.4A1 1 0 0 0 17.5 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
    store: '<path d="m2 7 4.4-4.4A2 2 0 0 1 7.8 2h8.4a2 2 0 0 1 1.4.6L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M2 7h20v3a2 2 0 0 1-4 0 2 2 0 0 1-4 0 2 2 0 0 1-4 0 2 2 0 0 1-4 0 2 2 0 0 1-4 0Z"/>',
    filter: '<path d="M22 3H2l8 9.5V19l4 2v-8.5Z"/>',
    coins: '<circle cx="8" cy="8" r="6"/><path d="M18.1 10.4A6 6 0 1 1 10.3 18"/><path d="M7 6h1v4"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.5 13 17 22l-5-3-5 3 1.5-9"/>',
    insta: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6"/>',
    fb: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z"/>',
    yt: '<path d="M2.5 17a24 24 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24 24 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17Z"/><path d="m10 15 5-3-5-3Z"/>',
    star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1Z"/>',
    trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
    scale: '<path d="m16 16 3-8 3 8c-.9.7-1.9 1-3 1s-2.1-.3-3-1Z"/><path d="m2 16 3-8 3 8c-.9.7-1.9 1-3 1s-2.1-.3-3-1Z"/><path d="M7 21h10M12 3v18M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    necklace: '<path d="M4 4c0 6 3.6 10 8 10s8-4 8-10"/><path d="M12 14v2"/><path d="M10 18a2 2 0 1 0 4 0l-2-2Z"/>',
    ring: '<circle cx="12" cy="15" r="6"/><path d="m9 6 3-3 3 3-3 3Z"/>',
    earring: '<path d="M12 3v4"/><circle cx="12" cy="9" r="2"/><path d="M12 11c-3 3-3 7 0 10 3-3 3-7 0-10Z"/>',
    bangle: '<ellipse cx="12" cy="12" rx="9" ry="6"/><ellipse cx="12" cy="12" rx="6" ry="3.5"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z"/><path d="M19 3v4M17 5h4"/>',
    crown: '<path d="m2 8 4 10h12l4-10-5 4-5-7-5 7Z"/><path d="M6 21h12"/>'
  };
  const icon = (n, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;
  const WA_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3ZM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8Zm8.4-18.2A11.8 11.8 0 0 0 1.7 17.8L0 24l6.3-1.7A11.8 11.8 0 0 0 24 12c0-3.2-1.2-6.1-3.5-8.4Z"/></svg>';
  const LOGO = `<img class="logo-mark" src="assets/logo-mark.png" alt="" width="30" height="52">`;

  const page = document.body.dataset.page || '';
  const set = () => S.db.settings;

  function logo() {
    return `<a class="logo" href="index.html" aria-label="${esc(set().name)} home">${LOGO}<span class="logo-text"><strong>Sri Chandana</strong><span>Jewellers · Est. 2007</span></span></a>`;
  }

  function ratesStrip() {
    const r = S.rates;
    return `<span><span class="dot" aria-hidden="true"></span><span class="lbl">Live Gold Rate</span></span>
      <span><span class="lbl">24K</span><b class="tnum">${S.inr(r.k24)}</b>/g</span>
      <span><span class="lbl">22K</span><b class="tnum">${S.inr(r.k22)}</b>/g</span>
      <span><span class="lbl">18K</span><b class="tnum">${S.inr(r.k18)}</b>/g</span>
      <span><span class="lbl">Silver</span><b class="tnum">${S.inr(r.silver)}</b>/g</span>`;
  }

  const NAV = [
    { label: 'All Jewellery', href: 'shop.html', icon: 'sparkle', mega: true, page: 'shop' },
    { label: 'Gold', href: 'shop.html?metal=Gold', icon: 'necklace' },
    { label: 'Diamond', href: 'shop.html?metal=Diamond', icon: 'gem' },
    { label: 'Earrings', href: 'shop.html?category=Earrings', icon: 'earring' },
    { label: 'Rings', href: 'shop.html?category=Rings', icon: 'ring' },
    { label: 'Bridal', href: 'shop.html?collection=Bridal', icon: 'crown' },
    { label: 'Bangles', href: 'shop.html?category=Bangles', icon: 'bangle' },
    { label: 'Gold Coins', href: 'shop.html?category=Coins', icon: 'coins' },
    { label: 'Gold Schemes', href: 'schemes.html', icon: 'scale', page: 'schemes' },
    { label: 'Our Store', href: 'stores.html', icon: 'store', page: 'stores' }
  ];
  const OFFERS = ['Gold savings scheme — start from just ₹500 a month', 'BIS hallmarked gold with HUID on every piece', 'Open daily · 10:30 AM – 8:30 PM', 'Call or WhatsApp us on 91210 79916'];

  function mega() {
    const cats = ['Necklaces', 'Necklace Sets', 'Earrings', 'Rings', 'Bangles', 'Bracelets', 'Chains', 'Pendants', 'Mangalsutra'];
    const cols = ['Bridal', 'Temple', 'Kundan', 'Daily Wear', 'Wedding', 'Men'];
    return `<div class="mega"><div class="mega-inner">
      <div><h4>By Category</h4><ul>${cats.map(c => `<li><a href="shop.html?category=${encodeURIComponent(c)}">${c}</a></li>`).join('')}</ul></div>
      <div><h4>By Collection</h4><ul>${cols.map(c => `<li><a href="shop.html?collection=${encodeURIComponent(c)}">${c}</a></li>`).join('')}</ul></div>
      <div><h4>By Price</h4><ul>
        <li><a href="shop.html?max=25000">Under ₹25,000</a></li><li><a href="shop.html?min=25000&max=75000">₹25,000 – ₹75,000</a></li>
        <li><a href="shop.html?min=75000&max=200000">₹75,000 – ₹2 Lakh</a></li><li><a href="shop.html?min=200000">Above ₹2 Lakh</a></li></ul>
        <h4 style="margin-top:22px">By Purity</h4><ul><li><a href="shop.html?purity=22K">22 Karat</a></li><li><a href="shop.html?purity=18K">18 Karat</a></li><li><a href="shop.html?purity=24K">24 Karat</a></li></ul></div>
      <a class="mega-feature" href="shop.html?collection=Bridal"><img src="${S.IMG('1654764746221-7bc58ef4dbad', 600)}" alt="" loading="lazy"><span>The Kalyani Bridal Edit →</span></a>
    </div></div>`;
  }

  function header() {
    const s = set();
    return `<a class="skip" href="#main">Skip to content</a>
    <div class="strip"><div class="wrap"><div class="rates" id="rateStrip">${ratesStrip()}</div>
      <div class="offer-rot" aria-live="off">${OFFERS.map((o, i) => `<span class="${i ? '' : 'on'}">${o}</span>`).join('')}</div></div></div>
    <header class="header" id="hdr"><div class="wrap header-main">
      <div style="display:flex;align-items:center;gap:4px">
        <button class="icon-btn menu-btn" aria-label="Open menu" data-open="menuDrawer">${icon('menu')}</button>
        ${logo()}
      </div>
      <form class="search search-desk" role="search" action="shop.html"><label class="sr-only" for="q">Search jewellery</label>
        <input id="q" name="q" type="search" placeholder="Search for gold necklaces" autocomplete="off">
        <button aria-label="Search">${icon('search', 'icon-sm')}</button><div class="search-results" id="searchResults"></div></form>
      <div class="actions">
        <a class="act" href="stores.html" aria-label="Store locator">${icon('store')}<span class="lbl-txt">Our Store</span></a>
        <a class="act" href="wishlist.html" aria-label="Wishlist">${icon('heart')}<span class="lbl-txt">Wishlist</span><span class="badge" id="wishCount"></span></a>
        <button class="act" data-open="cartDrawer" aria-label="Shopping bag">${icon('bag')}<span class="lbl-txt">Bag</span><span class="badge" id="cartCount"></span></button>
      </div>
    </div>
    <nav class="nav" aria-label="Main"><div class="wrap"><ul>
      ${NAV.map(n => `<li><a href="${n.href}" ${n.page === page ? 'aria-current="page"' : ''}>${icon(n.icon)}${n.label}</a>${n.mega ? mega() : ''}</li>`).join('')}
    </ul></div></nav></header>

    <div class="drawer-bg" data-close></div>
    <aside class="drawer" id="menuDrawer" aria-label="Menu" aria-hidden="true">
      <div class="drawer-head">${logo()}<button class="icon-btn" data-close aria-label="Close menu">${icon('x')}</button></div>
      <form class="search" role="search" action="shop.html" style="max-width:none;margin:10px 0 6px"><label class="sr-only" for="q2">Search</label><input id="q2" name="q" type="search" placeholder="Search jewellery"><button aria-label="Search">${icon('search', 'icon-sm')}</button></form>
      <nav>${NAV.map(n => `<a href="${n.href}">${n.label}${icon('chevR', 'icon-sm')}</a>`).join('')}
        <a href="shop.html?collection=Daily Wear">Daily Wear${icon('chevR', 'icon-sm')}</a>
        <a href="shop.html?collection=Men">For Him${icon('chevR', 'icon-sm')}</a>
        <a href="wishlist.html">Wishlist${icon('chevR', 'icon-sm')}</a>
        <a href="#" data-book>Book Store Appointment${icon('chevR', 'icon-sm')}</a></nav>
      <p style="margin-top:20px;font-size:13px;color:var(--muted)">${icon('phone', 'icon-sm')} ${esc(s.phone)}<br>${esc(s.hours)}</p>
    </aside>
    <aside class="drawer right" id="cartDrawer" aria-label="Shopping bag" aria-hidden="true">
      <div class="drawer-head"><h3 style="margin:0">Your Bag</h3><button class="icon-btn" data-close aria-label="Close bag">${icon('x')}</button></div>
      <div class="cart-lines" id="cartLines"></div><div class="cart-foot" id="cartFoot"></div>
    </aside>
    <div class="toast-wrap" role="status" aria-live="polite" id="toasts"></div>
    <dialog class="modal" id="bookModal" aria-labelledby="bookTitle">
      <div class="modal-head"><h3 id="bookTitle">Book a Store Visit or Video Call</h3><button class="icon-btn" data-dialog-close aria-label="Close">${icon('x')}</button></div>
      <form class="modal-body" id="bookForm" novalidate>
        <div class="form-2">
          <div class="field"><label for="bk-name">Full name <span class="req">*</span></label><input id="bk-name" name="name" autocomplete="name" required><span class="err">Please enter your name.</span></div>
          <div class="field"><label for="bk-phone">Mobile <span class="req">*</span></label><input id="bk-phone" name="phone" type="tel" inputmode="numeric" autocomplete="tel" pattern="[6-9][0-9]{9}" required><span class="err">Enter a 10-digit mobile number.</span></div>
          <div class="field"><label for="bk-type">Appointment type</label><select id="bk-type" name="type"><option>Store Visit</option><option>Video Call</option><option>Bridal Consultation</option><option>Old Gold Exchange</option></select></div>
          <div class="field"><label for="bk-date">Preferred date <span class="req">*</span></label><input id="bk-date" name="date" type="date" required><span class="err">Choose a date.</span></div>
          <div class="field full"><label for="bk-note">What are you looking for?</label><textarea id="bk-note" name="note" placeholder="e.g. bridal haram around 50g, budget ₹6 lakh"></textarea></div>
        </div>
        <input type="hidden" name="product" id="bk-product">
        <button class="btn btn-primary btn-block" type="submit">Confirm Appointment</button>
      </form>
    </dialog>`;
  }

  function footer() {
    const s = set();
    return `<section class="news"><div class="wrap"><div><span class="eyebrow" style="color:var(--maroon)">Stay in the loop</span><h3>New collections & festive offers, first.</h3></div>
      <form id="newsForm" novalidate><label class="sr-only" for="newsPhone">Mobile or email</label><input id="newsPhone" name="contact" placeholder="Your mobile number or email" required><button class="btn btn-primary" type="submit">Subscribe</button></form></div></section>
    <footer class="footer"><div class="wrap"><div class="footer-grid">
      <div>${logo()}<p style="max-width:330px">${esc(s.tagline)}. Founded by ${esc(s.founder)} on 30 November 2007 — every piece BIS hallmarked, every price transparent.</p>
        <div class="socials">${[['instagram', 'insta', 'Instagram'], ['facebook', 'fb', 'Facebook'], ['youtube', 'yt', 'YouTube']].filter(([k]) => s[k]).map(([k, ic, l]) => `<a href="${esc(s[k])}" target="_blank" rel="noopener" aria-label="${l}">${icon(ic, 'icon-sm')}</a>`).join('')}</div></div>
      <div><h4>Shop</h4><ul><li><a href="shop.html?metal=Gold">Gold Jewellery</a></li><li><a href="shop.html?metal=Diamond">Diamond Jewellery</a></li><li><a href="shop.html?collection=Bridal">Bridal</a></li><li><a href="shop.html?metal=Silver">Silver</a></li><li><a href="shop.html?category=Coins">Gold Coins</a></li></ul></div>
      <div><h4>Services</h4><ul><li><a href="schemes.html">Gold Savings Scheme</a></li><li><a href="schemes.html#exchange">Old Gold Exchange</a></li><li><a href="#" data-book>Book Appointment</a></li><li><a href="stores.html#faq">FAQs</a></li></ul></div>
      <div><h4>Policies</h4><ul><li><a href="stores.html#policies">Old Gold Exchange</a></li><li><a href="stores.html#policies">Scheme Terms</a></li><li><a href="stores.html#policies">Shipping & Returns</a></li><li><a href="stores.html#policies">Privacy Policy</a></li><li><a href="admin.html">Staff Login</a></li></ul></div>
      <div><h4>Visit Us</h4><ul style="gap:14px"><li style="display:flex;gap:10px">${icon('pin', 'icon-sm')}<a href="${esc(s.mapUrl || '#')}" target="_blank" rel="noopener">${esc(s.address)}</a></li><li style="display:flex;gap:10px">${icon('phone', 'icon-sm')}<a href="tel:${s.phone.replace(/\s/g, '')}">${esc(s.phone)}</a></li><li style="display:flex;gap:10px">${icon('mail', 'icon-sm')}<a href="mailto:${esc(s.email)}">${esc(s.email)}</a></li><li style="display:flex;gap:10px">${icon('clock', 'icon-sm')}<span>${esc(s.hours)}</span></li></ul></div>
    </div>
    <div class="footer-bottom"><span>© ${new Date().getFullYear()} ${esc(s.name)}, Parvathipuram.${s.gstin ? ` GSTIN ${esc(s.gstin)}` : ''}</span><span>Est. 30 November 2007</span></div></div></footer>
    <button class="to-top" id="toTop" aria-label="Back to top">${icon('arrowUp', 'icon-sm')}</button>
    <a class="wa-float" href="https://wa.me/${s.whatsapp}?text=${encodeURIComponent('Hello Sri Chandana Jewellers, I would like to know more about your jewellery.')}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${WA_SVG}</a>`;
  }

  // ---------- product card ----------
  const askLink = p => `https://wa.me/${S.db.settings.whatsapp}?text=${encodeURIComponent(`Namaste, please share today's price for ${p.name} (${p.id}).`)}`;
  function card(p) {
    const pr = S.priceOf(p);
    const tag = p.tags.includes('new') ? '<span class="card-tag">New</span>' : p.tags.includes('bestseller') ? '<span class="card-tag gold">Bestseller</span>' : '';
    const wished = S.wish.has(p.id);
    const tag2 = tag.replace('>New<', '>New In<');
    return `<article class="card">
      <div class="card-media shine">${tag2}
        <img src="${p.images[0]}" alt="${esc(p.name)}" loading="lazy" width="600" height="600">
        ${p.images[1] ? `<img class="alt" src="${p.images[1]}" alt="" loading="lazy">` : ''}
        <button class="wish-btn" data-wish="${p.id}" aria-pressed="${wished}" aria-label="${wished ? 'Remove from' : 'Add to'} wishlist: ${esc(p.name)}">${icon('heart', 'icon-sm')}</button>
        <div class="card-quick">${p.hidePrice ? `<a class="card-add" href="${askLink(p)}" target="_blank" rel="noopener">${icon('phone', 'icon-sm')}Ask Today's Price</a>` : `<button class="card-add" data-add="${p.id}">${icon('bag', 'icon-sm')}Add to Bag</button>`}</div>
      </div>
      <div class="card-body">
        <h3 class="card-title"><a href="product.html?id=${p.id}">${esc(p.name)}</a></h3>
        <span class="card-meta">${esc(p.purity === '925' ? 'Sterling Silver' : p.purity + ' ' + p.metal)} · ${p.grossWeight ? 'Gr ' + p.grossWeight + ' g · Net ' : ''}${p.weight} g</span>
        <div class="card-price">${p.hidePrice ? '<strong class="ask">Price on request</strong>' : `<strong>${S.inr(pr.total)}</strong><small>incl. GST</small>`}</div>
      </div></article>`;
  }

  // ---------- toasts ----------
  function toast(msg) {
    const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = icon('check', 'icon-sm') + `<span>${esc(msg)}</span>`;
    $('#toasts').appendChild(t); setTimeout(() => t.remove(), 3500);
  }

  // ---------- drawers ----------
  let lastFocus = null;
  function openDrawer(id) {
    lastFocus = document.activeElement;
    const d = $('#' + id); d.classList.add('open'); d.setAttribute('aria-hidden', 'false');
    $('.drawer-bg').classList.add('open'); document.body.style.overflow = 'hidden';
    if (id === 'cartDrawer') renderCart();
    setTimeout(() => d.querySelector('button, a, input')?.focus(), 50);
  }
  function closeDrawers() {
    $$('.drawer.open, .filters.open').forEach(d => { d.classList.remove('open'); d.setAttribute('aria-hidden', 'true'); });
    $('.drawer-bg').classList.remove('open'); document.body.style.overflow = '';
    lastFocus?.focus?.();
  }

  function renderCart() {
    const items = S.cart.detailed(); const lines = $('#cartLines'); const foot = $('#cartFoot');
    if (!items.length) {
      lines.innerHTML = `<div class="empty" style="margin-top:20px;border:0">${icon('bag')}<h3>Your bag is empty</h3><p style="color:var(--muted)">Explore our collections and add something beautiful.</p><a class="btn btn-primary" href="shop.html">Start Shopping</a></div>`;
      foot.innerHTML = ''; return;
    }
    lines.innerHTML = items.map((it, i) => `<div class="line"><img src="${it.p.images[0]}" alt="">
      <div><h4>${esc(it.p.name)}</h4><small>${it.p.purity} · ${it.p.weight}g${it.size ? ' · Size ' + esc(it.size) : ''}</small>
        <div style="display:flex;align-items:center"><div class="qty"><button data-q="${i}" data-d="-1" aria-label="Decrease quantity">−</button><span>${it.qty}</span><button data-q="${i}" data-d="1" aria-label="Increase quantity">+</button></div>
        <button class="remove" data-rm="${i}">Remove</button></div></div>
      <span class="price">${S.inr(it.price * it.qty)}</span></div>`).join('');
    const sub = items.reduce((s, i) => s + i.price * i.qty, 0);
    foot.innerHTML = `<div class="sum-row"><span>Subtotal (incl. 3% GST)</span><span class="tnum">${S.inr(sub)}</span></div>
      <div class="sum-row"><span>Store pickup</span><span style="color:var(--ok)">Free</span></div>
      <div class="sum-row total"><span>Total</span><span class="tnum">${S.inr(sub)}</span></div>
      <p style="font-size:12px;color:var(--muted);margin:8px 0 14px">Prices are live, based on today's gold rate.</p>
      <a class="btn btn-primary btn-block" href="checkout.html">Order on WhatsApp</a>`;
  }

  function updateCounts() {
    const c = S.cart.count(), w = S.wish.items().length;
    const cc = $('#cartCount'), wc = $('#wishCount');
    const bump = (el, n) => { if (!el) return; if (el.dataset.n !== undefined && +el.dataset.n !== n) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); } el.textContent = n || ''; el.dataset.n = n; };
    bump(cc, c); bump(wc, w);
  }

  // ---------- live search ----------
  function bindSearch() {
    const input = $('#q'), box = $('#searchResults'); if (!input) return;
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) { box.classList.remove('open'); return; }
      const res = S.db.products.filter(p => (p.name + ' ' + p.category + ' ' + p.collection + ' ' + p.metal).toLowerCase().includes(q)).slice(0, 6);
      box.innerHTML = res.length ? res.map(p => `<a href="product.html?id=${p.id}"><img src="${p.images[0].replace('w=800', 'w=100')}" alt=""><span>${esc(p.name)}<br><small style="color:var(--muted)">${p.hidePrice ? 'Price on request' : S.inr(S.priceOf(p).total)}</small></span></a>`).join('')
        : `<a href="shop.html?q=${encodeURIComponent(q)}">No exact match — see all results for "${esc(q)}"</a>`;
      box.classList.add('open');
    });
    document.addEventListener('click', e => { if (!e.target.closest('.search')) box.classList.remove('open'); });
  }

  // ---------- forms ----------
  function validate(form) {
    let ok = true, first = null;
    $$('[required], [pattern]', form).forEach(el => {
      const f = el.closest('.field'); const valid = el.checkValidity() && (!el.required || el.value.trim());
      f?.classList.toggle('invalid', !valid);
      if (!valid) { ok = false; first = first || el; el.setAttribute('aria-invalid', 'true'); } else el.removeAttribute('aria-invalid');
    });
    first?.focus();
    return ok;
  }
  function bindBlurValidation(form) {
    $$('[required], [pattern]', form).forEach(el => el.addEventListener('blur', () => {
      if (!el.value) return; const f = el.closest('.field'); f?.classList.toggle('invalid', !el.checkValidity());
    }));
  }

  function openBooking(productName = '') {
    const m = $('#bookModal'); $('#bk-product').value = productName;
    const d = $('#bk-date'); d.min = new Date().toISOString().slice(0, 10);
    if (productName) $('#bk-note').value = 'Interested in: ' + productName;
    m.showModal();
  }

  // ---------- global events ----------
  function bindGlobal() {
    document.addEventListener('click', e => {
      const t = e.target.closest('[data-open],[data-close],[data-wish],[data-add],[data-q],[data-rm],[data-book],[data-dialog-close]');
      if (!t) return;
      if (t.dataset.open) { e.preventDefault(); openDrawer(t.dataset.open); }
      else if (t.hasAttribute('data-close')) closeDrawers();
      else if (t.dataset.wish) {
        e.preventDefault(); const added = S.wish.toggle(t.dataset.wish);
        $$(`[data-wish="${t.dataset.wish}"]`).forEach(b => b.setAttribute('aria-pressed', added));
        toast(added ? 'Added to wishlist' : 'Removed from wishlist');
      }
      else if (t.dataset.add) { e.preventDefault(); S.cart.add(t.dataset.add); toast('Added to your bag'); openDrawer('cartDrawer'); }
      else if (t.dataset.q !== undefined) { const i = +t.dataset.q; S.cart.update(i, S.cart.items()[i].qty + +t.dataset.d); renderCart(); }
      else if (t.dataset.rm !== undefined) { S.cart.update(+t.dataset.rm, 0); renderCart(); }
      else if (t.hasAttribute('data-book')) { e.preventDefault(); closeDrawers(); openBooking(t.dataset.book || ''); }
      else if (t.hasAttribute('data-dialog-close')) t.closest('dialog').close();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawers(); });
    document.addEventListener('scj:change', updateCounts);

    const bf = $('#bookForm'); bindBlurValidation(bf);
    bf.addEventListener('submit', e => {
      e.preventDefault(); if (!validate(bf)) return;
      const d = Object.fromEntries(new FormData(bf));
      whatsapp(`Namaste, I would like to book a store visit.\nName: ${d.name}\nMobile: ${d.phone}\nFor: ${d.type || 'Showroom visit'}\nPreferred date: ${d.date || 'Any'}${d.note ? '\nNote: ' + d.note : ''}`);
      bf.reset(); $('#bookModal').close(); toast('Opening WhatsApp — press Send to book your visit.');
    });
    const nf = $('#newsForm');
    nf.addEventListener('submit', e => {
      e.preventDefault(); const v = nf.contact.value.trim(); if (!v) { nf.contact.focus(); return; }
      whatsapp(`Namaste, please send me new designs, offers and gold rate updates. My contact: ${v}`);
      nf.reset(); toast('Opening WhatsApp — press Send to subscribe.');
    });
  }

  let io;
  function reveal() {
    const els = $$('.reveal:not(.in), .stagger:not(.in)');
    if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('in')); return; }
    io = io || new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .05 });
    els.forEach(el => io.observe(el));
  }

  // header shadow/shrink, back-to-top, offer rotator
  // gold-foil accent on the last word of each section heading
  function foil() {
    $$('.section-head h2, .row-head h2').forEach(h => {
      if (h.querySelector('em') || h.children.length) return;
      const t = h.textContent.trim(), i = t.lastIndexOf(' ');
      if (i > 0) h.innerHTML = `${esc(t.slice(0, i))} <em class="foil">${esc(t.slice(i + 1))}</em>`;
    });
  }

  function ambient() {
    const hdr = $('#hdr'), top = $('#toTop');
    const bar = document.createElement('div'); bar.className = 'progress'; bar.setAttribute('aria-hidden', 'true'); hdr.appendChild(bar);
    let ticking = false;
    const onScroll = () => { if (ticking) return; ticking = true; requestAnimationFrame(() => { const y = scrollY, max = document.documentElement.scrollHeight - innerHeight; hdr.classList.toggle('scrolled', y > 40); top.classList.toggle('show', y > 900); bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`; ticking = false; }); };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
    top.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
    const spans = $$('.offer-rot span'); let k = 0;
    if (spans.length > 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(() => {
      const cur = spans[k]; cur.classList.remove('on'); cur.classList.add('off'); setTimeout(() => cur.classList.remove('off'), 700);
      k = (k + 1) % spans.length; spans[k].classList.add('on');
    }, 3800);
  }

  // ---------- mount (after the online data and live rate are in) ----------
  // customer requests go straight to the store's WhatsApp
  const whatsapp = text => window.open(`https://wa.me/${S.db.settings.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  window.UI = { $, $$, esc, icon, card, toast, validate, bindBlurValidation, openBooking, reveal, openDrawer, closeDrawers, renderCart, whatsapp, askLink };
  SCJ.ready.then(() => {
    document.getElementById('site-header').outerHTML = header();
    document.getElementById('site-footer').outerHTML = footer();
    updateCounts(); bindSearch(); bindGlobal(); ambient(); foil();
    requestAnimationFrame(reveal);
  });
  window.addEventListener('load', () => SCJ.ready.then(reveal));
})();
