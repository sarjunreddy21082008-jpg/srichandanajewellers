/* Sri Chandana Jewellers — automatic gold rate.
   Takes the live international gold and silver price in rupees (gold-api.com, no key needed),
   converts it per gram and adds the store's premium (import duty + local margin) set in Admin → Gold Rates.
   GST is added separately on each product. If the live price can't be loaded, the saved manual rates are used. */
(function () {
  const TTL = 30 * 60 * 1000, CACHE = 'scj_live_px', OZ = 31.1035;
  const API = 'https://api.gold-api.com/price/';

  async function fetchPx(force) {
    const c = SCJ.local.get(CACHE, null);
    if (!force && c && Date.now() - c.t < TTL) return c;
    const get = s => fetch(API + s + '/INR', { cache: 'no-store' }).then(r => r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status)));
    const [au, ag] = await Promise.all([get('XAU'), get('XAG')]);
    if (!(au.price > 0) || !(ag.price > 0)) throw new Error('Unexpected price data');
    const px = { t: Date.now(), xau: au.price, xag: ag.price, at: au.updatedAt || new Date().toISOString() };
    SCJ.local.set(CACHE, px); return px;
  }
  function compute(px, a) {
    const g24 = px.xau / OZ * (1 + (+a.premium || 0) / 100);
    return {
      k24: Math.round(g24), k22: Math.round(g24 * (+a.ratio22 || 91.6) / 100), k18: Math.round(g24 * (+a.ratio18 || 75) / 100),
      silver: Math.round(px.xag / OZ * (1 + (+a.silverPremium || 0) / 100)), updated: px.at, auto: true
    };
  }
  async function apply(force) {
    const a = SCJ.db.settings.autoRate;
    if (!a || !a.on) { SCJ.live = null; return null; }
    try { const px = await fetchPx(force); SCJ.livePx = px; SCJ.live = compute(px, a); }
    catch (e) { console.warn('Live gold price unavailable — using saved rates', e); SCJ.live = null; }
    return SCJ.live;
  }

  SCJ.liveRate = { apply, compute, fetchPx, OZ };
  SCJ.ready = SCJ.ready.then(() => Promise.race([apply(), new Promise(r => setTimeout(r, 3000))]));
})();
