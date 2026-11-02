/* Sri Chandana Jewellers — data layer.
   Everything lives in localStorage so the site and admin panel work without a server.
   For production, swap the get/set functions for API calls to a real backend. */
(function () {
  const IMG = (id, w = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;
  const KEY = 'scj_db_v4';

  const SEED = {
    settings: {
      name: 'Sri Chandana Jewellers',
      tagline: 'Trusted Gold & Diamond Jewellers of Parvathipuram since 2007',
      founder: 'Ananda Rao',
      founded: '2007-11-30',
      address: 'Parvathipuram – Palakonda Road, Near Sri Vasavi Kanyaka Parameshwari Temple, Parvathipuram, Andhra Pradesh 535501',
      phone: '+91 91210 79916',
      whatsapp: '919121079916',
      email: 'sankamadhu1975@gmail.com',
      hours: 'Open daily · 10:30 AM – 8:30 PM',
      gstin: '',
      mapQuery: 'Sri Chandana Jewellers, Palakonda Road, Parvathipuram, Andhra Pradesh 535501',
      mapUrl: 'https://maps.app.goo.gl/XvTZ2U2ej6Z1Z5Hh8',
      instagram: 'https://www.instagram.com/sri_chandana_jewellers5/', instagramHandle: 'sri_chandana_jewellers5',
      facebook: '', youtube: '',
      autoRate: { on: true, premium: 6, silverPremium: 8, ratio22: 91.6, ratio18: 75 },
      showPrices: false, // catalogue mode: designs, weights and wishlist only — no prices or shopping bag
      schemePlans: [
        { id: 'sp1', name: 'Monthly Gold Savings Plan', tag: '11 Monthly Instalments', desc: 'Save a fixed amount every month for 11 months and buy jewellery at maturity with a bonus.', perks: ['Start from ₹500 a month, in multiples of ₹500', 'Bonus at maturity — up to one instalment', 'Making-charge (VA) discount on selected jewellery'], min: 500, months: 11, bonusMonths: 1, popular: true },
        { id: 'sp2', name: 'Gold Weight Plan', tag: 'Gram Rate Lock', desc: 'Each instalment is converted into grams of gold at the rate of that day, so rising prices never eat into your savings.', perks: ['Every payment booked as gold grams', 'Protection from gold price rises', 'Collect jewellery equal to your total grams'], min: 1000, months: 11, bonusMonths: 0, popular: false }
      ]
    },
    rates: { k24: 13120, k22: 12030, k18: 9840, silver: 165, updated: new Date().toISOString() },
    rateHistory: [],
    banners: [
      { id: 'b1', title: 'The Kalyani Bridal Edit', subtitle: 'Heirloom temple and kundan sets crafted for the most important day of your life.', cta: 'Explore Bridal', link: 'shop.html?collection=Bridal', image: IMG('1600685890506-593fdf55949b', 1800), active: true },
      { id: 'b2', title: 'Gold Savings Scheme', subtitle: 'Save from ₹500 a month for 11 months and enjoy a maturity bonus with making-charge discounts.', cta: 'Explore Schemes', link: 'schemes.html', image: IMG('1624365169364-0640dd10e180', 1800), active: true },
      { id: 'b3', title: 'Diamond Brilliance', subtitle: 'Sparkling diamond necklaces, studs and rings set in 18K gold.', cta: 'Explore Diamonds', link: 'shop.html?metal=Diamond', image: IMG('1744822220368-c380740bfc7f', 1800), active: true },
      { id: 'b4', title: 'Temple Heritage', subtitle: 'Lakshmi kasu, nakshi and antique harams inspired by the temples of Andhra.', cta: 'Shop Temple Jewellery', link: 'shop.html?collection=Temple', image: IMG('1758995115857-2de1eb6283d0', 1800), active: true },
      { id: 'b5', title: 'Everyday Gold, Effortlessly', subtitle: 'Lightweight chains, studs and bangles from 2 grams — made to be worn every day.', cta: 'Shop Daily Wear', link: 'shop.html?collection=Daily Wear', image: IMG('1758995116383-f51775896add', 1800), active: true }
    ],
    products: [],
    orders: [],
    appointments: [],
    enquiries: [],
    schemes: [],
    reviews: []
  };

  // [id, name, category, collection, metal, purity, weight(g), making%, stoneValue, imageIds, gender, tags]
  const P = [
    ['Kalyani Temple Haram', 'Necklaces', 'Bridal', 'Gold', '22K', 48.6, 16, 0, ['1758995115518-26f90aa61b97', '1640183298005-3a4497cc6a37'], 'Women', 'bestseller,bridal'],
    ['Lakshmi Kasu Necklace Set', 'Necklace Sets', 'Bridal', 'Gold', '22K', 62.4, 15, 0, ['1640183298005-3a4497cc6a37', '1758995115857-2de1eb6283d0'], 'Women', 'bridal,temple'],
    ['Padmavati Choker with Jhumkas', 'Necklace Sets', 'Bridal', 'Gold', '22K', 41.2, 18, 8500, ['1758995115857-2de1eb6283d0', '1722410180687-b05b50922362'], 'Women', 'new'],
    ['Antique Ruby Long Haram', 'Necklaces', 'Temple', 'Gold', '22K', 55.0, 17, 12500, ['1722410180687-b05b50922362', '1758995115518-26f90aa61b97'], 'Women', 'temple'],
    ['Polki Kundan Bridal Set', 'Necklace Sets', 'Kundan', 'Gold', '22K', 58.3, 20, 42000, ['1738754719555-05aca36707b1', '1738754712726-d126c15e206b'], 'Women', 'bridal,kundan,new'],
    ['Meenakari Bead Necklace', 'Necklaces', 'Kundan', 'Gold', '22K', 22.8, 14, 3200, ['1601121141461-9d6647bca1ed'], 'Women', ''],
    ['Rajasi Crown Pendant Chain', 'Pendants', 'Daily Wear', 'Gold', '22K', 8.4, 12, 0, ['1685970731194-e27b477e87ba'], 'Women', 'gift'],
    ['Halo Circle Pendant', 'Pendants', 'Daily Wear', 'Gold', '18K', 4.2, 14, 0, ['1773929345739-94db8a4ccd0c'], 'Women', 'new,gift'],
    ['Solitaire Bar Pendant', 'Pendants', 'Diamond', 'Diamond', '18K', 3.9, 15, 28500, ['1771515411694-57fb626159d1'], 'Women', 'diamond'],
    ['Emerald Diamond Rivière', 'Necklaces', 'Diamond', 'Diamond', '18K', 24.5, 18, 285000, ['1744822220368-c380740bfc7f'], 'Women', 'diamond,bestseller'],
    ['Diamond Cluster Necklace Set', 'Necklace Sets', 'Diamond', 'Diamond', '18K', 28.1, 18, 195000, ['1743264385411-57c883bdc0ea', '1762505464446-c0760d740aee'], 'Women', 'diamond'],
    ['Classic Gold Jhumkas', 'Earrings', 'Temple', 'Gold', '22K', 12.6, 14, 0, ['1762686130435-897de4b26aac'], 'Women', 'bestseller'],
    ['Ruby Drop Jhumkas', 'Earrings', 'Kundan', 'Gold', '22K', 14.2, 16, 4800, ['1653227907864-560dce4c252d'], 'Women', ''],
    ['Twin Tone Jhumki', 'Earrings', 'Daily Wear', 'Gold', '22K', 6.8, 13, 0, ['1714733831162-0a6e849141be'], 'Women', 'new'],
    ['Rose Gold Petite Drops', 'Earrings', 'Daily Wear', 'Gold', '18K', 2.6, 15, 0, ['1701777892740-88419a701472'], 'Kids', 'gift'],
    ['Leaf Spray Diamond Studs', 'Earrings', 'Diamond', 'Diamond', '18K', 4.8, 16, 46000, ['1693213085235-ea6deadf8cee'], 'Women', 'diamond,new'],
    ['Florentine Gold Ring', 'Rings', 'Daily Wear', 'Gold', '22K', 5.4, 12, 0, ['1617038260897-41a1f14a8ca0'], 'Women', ''],
    ['Eternal Couple Bands', 'Rings', 'Wedding', 'Gold', '22K', 9.8, 10, 0, ['1622398925373-3f91b1e275f5'], 'Unisex', 'bestseller,wedding'],
    ['Trio Stackable Rings', 'Rings', 'Daily Wear', 'Gold', '18K', 6.1, 14, 0, ['1631982690223-8aa4be0a2497'], 'Women', 'gift'],
    ['Pavé Dome Diamond Ring', 'Rings', 'Diamond', 'Diamond', '18K', 4.6, 16, 38500, ['1611955167811-4711904bb9f8'], 'Women', 'diamond'],
    ['Amethyst Cocktail Ring', 'Rings', 'Daily Wear', 'Gold', '18K', 5.0, 15, 9500, ['1603561596973-8166e9e089d1'], 'Women', ''],
    ['Solitaire Engagement Ring', 'Rings', 'Wedding', 'Diamond', '18K', 3.8, 16, 92000, ['1605100804763-247f67b3557e'], 'Women', 'diamond,wedding'],
    ['Sovereign Signet Rings', 'Rings', 'Men', 'Gold', '22K', 8.2, 11, 2500, ['1543294001-f7cd5d7fb516'], 'Men', 'men'],
    ['Nakshi Kada Bangles (Pair)', 'Bangles', 'Temple', 'Gold', '22K', 38.4, 15, 0, ['1758995116383-f51775896add'], 'Women', 'bestseller,temple'],
    ['Filigree Kangan Pair', 'Bangles', 'Bridal', 'Gold', '22K', 32.0, 16, 0, ['1728381031272-ba3f537feadd'], 'Women', 'bridal'],
    ['Ruby Emerald Kada', 'Bangles', 'Kundan', 'Gold', '22K', 29.5, 18, 9800, ['1690175867343-2af70ea57537'], 'Women', ''],
    ['Diamond Line Bracelet', 'Bracelets', 'Diamond', 'Diamond', '18K', 12.4, 16, 125000, ['1611598935678-c88dca238fce'], 'Women', 'diamond'],
    ['Daily Wear Gold Bangles (Set of 4)', 'Bangles', 'Daily Wear', 'Gold', '22K', 24.0, 10, 0, ['1679156271456-d6068c543ee7'], 'Women', ''],
    ['Rope Gold Chain 22"', 'Chains', 'Daily Wear', 'Gold', '22K', 15.2, 9, 0, ['1611107683227-e9060eccd846'], 'Unisex', 'bestseller'],
    ['Cuban Link Chain', 'Chains', 'Men', 'Gold', '22K', 28.5, 10, 0, ['1721807550979-6e662d370e92'], 'Men', 'men,new'],
    ['Twisted Box Chain', 'Chains', 'Daily Wear', 'Gold', '22K', 12.0, 9, 0, ['1585711715631-1e6bf224f092'], 'Unisex', ''],
    ['Link Chain Bracelets (Pair)', 'Bracelets', 'Men', 'Gold', '22K', 18.6, 11, 0, ['1708220040856-131e4f86a1aa'], 'Men', 'men'],
    ['Nallapusalu Mangalsutra', 'Mangalsutra', 'Wedding', 'Gold', '22K', 16.4, 12, 600, ['1787520542687-e2647225dc8f'], 'Women', 'wedding,bestseller'],
    ['Lakshmi Gold Coin 10g', 'Coins', 'Coins', 'Gold', '24K', 10, 3, 0, ['1624365169364-0640dd10e180'], 'Unisex', 'gift'],
    ['Gold Bar 24K 20g', 'Coins', 'Coins', 'Gold', '24K', 20, 2.5, 0, ['1610375461246-83df859d849d'], 'Unisex', ''],
    ['Pearl Strand Necklace', 'Necklaces', 'Daily Wear', 'Gold', '18K', 6.0, 12, 14500, ['1515562141207-7a88fb7ce338'], 'Women', 'gift'],
    ['Sterling Twin Bracelets', 'Bracelets', 'Silver', 'Silver', '925', 18, 8, 0, ['1761222101900-9c9e34fac2ce'], 'Women', 'gift'],
    ['Silver Beaded Kada', 'Bangles', 'Silver', 'Silver', '925', 42, 10, 0, ['1626784215013-13322cb0e471'], 'Unisex', '']
  ];

  SEED.products = P.map((r, i) => ({
    id: 'SCJ' + String(1001 + i),
    name: r[0], category: r[1], collection: r[2], metal: r[3], purity: r[4],
    weight: r[5], making: r[6], stoneValue: r[7],
    images: r[8].map(id => IMG(id)),
    gender: r[9], tags: r[10] ? r[10].split(',') : [],
    stock: 2 + ((i * 7) % 9),
    featured: i % 4 === 0,
    description: `${r[0]} in ${r[4] === '925' ? '925 sterling silver' : r[4] + ' ' + (r[3] === 'Silver' ? 'silver' : 'gold')}, crafted with care. ${r[3] === 'Silver' ? '' : 'BIS hallmarked with a unique HUID code.'} Comes with a certificate of authenticity and lifetime exchange.`,
    created: Date.now() - i * 86400000
  }));

  // The store's own photographed ornaments. hidePrice: the website shows weights and "Ask today's price" instead of a price.
  const STORE_PHOTOS = [
    { id: 'SCJ2001', name: 'Heart Diamond Couple Rings', category: 'Rings', collection: 'Wedding', metal: 'Gold', purity: '22K', weight: 7.16, grossWeight: 7.21, making: 12, stoneValue: 0,
      images: ['assets/products/heart-diamond-couple-rings-sq.jpg', 'assets/products/heart-diamond-couple-rings.jpg'], gender: 'Unisex', tags: ['new', 'gift'], featured: true, hidePrice: true,
      description: 'A matching pair of gold couple rings — a heart set with sparkling stones for her and a chevron band for him. Gross weight 7.210 g, net weight 7.160 g (for the pair).' }
  ];
  SEED.products = STORE_PHOTOS.map((p, i) => ({ ...p, created: Date.now() + 1000 - i })).concat(SEED.products);
  SEED.photosAdded = STORE_PHOTOS.map(p => p.id);

  // ---------- persistence ----------
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw); d.settings = { ...SEED.settings, ...d.settings };
        if (d.settings.founded === '2011-11-30') { d.settings.founded = SEED.settings.founded; d.settings.tagline = String(d.settings.tagline).replace('since 2011', 'since 2007'); } // founding year corrected to 2007
        // add newly photographed ornaments once (an ornament the owner deletes later is not added back)
        d.photosAdded = d.photosAdded || [];
        STORE_PHOTOS.filter(p => !d.photosAdded.includes(p.id)).forEach(p => { if (!d.products.some(x => x.id === p.id)) d.products.unshift({ ...p, created: Date.now() }); d.photosAdded.push(p.id); });
        return d;
      }
    } catch (e) { /* storage blocked: fall through to seed */ }
    const db = JSON.parse(JSON.stringify(SEED));
    db.orders.forEach(o => { o.items.forEach(it => { it.price = priceOf(db.products.find(p => p.id === it.id), db.rates).total; }); o.total = o.items.reduce((s, it) => s + it.price * it.qty, 0); });
    return db;
  }
  let db = load();
  function saveLocal() { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { console.warn('Could not save', e); } }
  // save() also notifies listeners (js/cloud.js uploads the change when the online database is set up)
  const saveHooks = [];
  function save() { saveLocal(); saveHooks.forEach(fn => fn()); }
  saveLocal();

  // ---------- pricing (same method Indian jewellers use) ----------
  function rateFor(purity, rates) {
    rates = rates || current();
    return { '24K': rates.k24, '22K': rates.k22, '18K': rates.k18, '925': rates.silver }[purity] || rates.k22;
  }
  function priceOf(p, rates) {
    if (!p) return { metal: 0, making: 0, stone: 0, gst: 0, total: 0 };
    const metal = Math.round(p.weight * rateFor(p.purity, rates));
    const making = Math.round(metal * p.making / 100);
    const stone = Math.round(p.stoneValue || 0);
    const gst = Math.round((metal + making + stone) * 0.03);
    return { rate: rateFor(p.purity, rates), metal, making, stone, gst, total: metal + making + stone + gst };
  }

  // live automatic rate (js/live-rate.js) wins over the saved manual rate
  const current = () => (window.SCJ && SCJ.live) || db.rates;

  const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');

  // ---------- cart / wishlist (per device) ----------
  const local = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  };

  window.SCJ = {
    IMG, inr, priceOf, rateFor,
    get db() { return db; },
    get rates() { return current(); },
    get shop() { return !!db.settings.showPrices; },
    priced: p => !!db.settings.showPrices && !p.hidePrice,
    live: null,
    ready: Promise.resolve(),
    save, saveLocal,
    onSave(fn) { saveHooks.push(fn); },
    local,
    reset() { localStorage.removeItem(KEY); db = load(); save(); },
    replace(newDb) { db = newDb; save(); },
    uid(prefix) { return prefix + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase(); },
    product(id) { return db.products.find(p => p.id === id); },

    cart: {
      items() { return local.get('scj_cart', []); },
      add(id, qty = 1, size = '') {
        const c = this.items(); const f = c.find(i => i.id === id && i.size === size);
        f ? f.qty += qty : c.push({ id, qty, size }); local.set('scj_cart', c); SCJ.emit();
      },
      update(idx, qty) { const c = this.items(); if (qty < 1) c.splice(idx, 1); else c[idx].qty = qty; local.set('scj_cart', c); SCJ.emit(); },
      clear() { local.set('scj_cart', []); SCJ.emit(); },
      count() { return this.items().reduce((s, i) => s + i.qty, 0); },
      detailed() {
        return this.items().map(i => { const p = SCJ.product(i.id); return p ? { ...i, p, price: priceOf(p).total } : null; }).filter(Boolean);
      }
    },
    wish: {
      items() { return local.get('scj_wish', []); },
      has(id) { return this.items().includes(id); },
      toggle(id) { const w = this.items(); const i = w.indexOf(id); i > -1 ? w.splice(i, 1) : w.push(id); local.set('scj_wish', w); SCJ.emit(); return i === -1; }
    },
    myOrders() { return local.get('scj_my_orders', []); },
    addMyOrder(id) { const o = this.myOrders(); o.unshift(id); local.set('scj_my_orders', o); },

    emit() { document.dispatchEvent(new CustomEvent('scj:change')); }
  };
})();
