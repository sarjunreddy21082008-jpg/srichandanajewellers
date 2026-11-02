/* Sri Chandana Jewellers — online database sync (Firebase Firestore).
   Public data (settings, rates, banners, reviews, products) is read by every visitor and written only by the owner.
   Orders, appointments, enquiries and scheme sign-ups can be created by visitors and are read only by the owner.
   The browser's own storage stays as a fast cache; every SCJ.save() uploads just what changed. */
(function () {
  const CFG = window.SCJ_FIREBASE;
  const SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';
  const PUBLIC = ['settings', 'rates', 'rateHistory', 'banners', 'reviews'];
  const PRIVATE = ['orders', 'appointments', 'enquiries', 'schemes'];
  const MAX_DOC = 900 * 1024; // Firestore's limit is 1 MB per document
  const st = { on: false, admin: false, fs: null, auth: null, snap: null, queue: Promise.resolve(), error: '' };

  const loadScript = src => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('Could not load ' + src)); document.head.appendChild(s); });
  const clean = o => JSON.parse(JSON.stringify(o ?? null));
  const byId = arr => Object.fromEntries((arr || []).map(x => [x.id, JSON.stringify(x)]));
  const isAdminUser = u => !!(u && u.email && (CFG.adminEmails || []).some(e => e.toLowerCase() === u.email.toLowerCase()));
  const newestFirst = (a, b) => String(b.date || b.created || '').localeCompare(String(a.date || a.created || ''));

  function publicDoc(db) {
    const d = {}; PUBLIC.forEach(k => { d[k] = clean(db[k]); });
    if (d.settings) delete d.settings.adminHash;
    d.rateHistory = (d.rateHistory || []).slice(0, 60);
    return d;
  }
  function snapshot(db) {
    st.snap = { public: JSON.stringify(publicDoc(db)), products: byId(db.products) };
    PRIVATE.forEach(k => { st.snap[k] = byId(db[k]); });
  }
  // ops for one collection: set changed/new items, delete removed ones (createOnly: visitors may only add)
  function diff(col, arr, createOnly) {
    const prev = st.snap[col] || {}, cur = byId(arr), ops = [];
    for (const id in cur) if (prev[id] !== cur[id] && (!createOnly || !(id in prev))) ops.push({ type: 'set', path: col + '/' + id, data: JSON.parse(cur[id]) });
    if (!createOnly) for (const id in prev) if (!(id in cur)) ops.push({ type: 'delete', path: col + '/' + id });
    return ops;
  }
  async function commit(ops) {
    for (let i = 0; i < ops.length; i += 400) {
      const b = st.fs.batch();
      ops.slice(i, i + 400).forEach(o => {
        const ref = st.fs.doc(o.path);
        if (o.type === 'delete') b.delete(ref);
        else {
          if (JSON.stringify(o.data).length > MAX_DOC) throw new Error(`"${o.data.name || o.path}" is too large to save online — use fewer or smaller photos.`);
          b.set(ref, o.data, o.merge ? { merge: true } : {});
        }
      });
      await b.commit();
    }
  }

  async function pullPrivate() {
    const db = SCJ.db;
    await Promise.all(PRIVATE.map(async k => { const qs = await st.fs.collection(k).get(); db[k] = qs.docs.map(d => d.data()).sort(newestFirst); }));
  }
  async function pushAll() {
    const db = SCJ.db; db.productsVersion = Date.now();
    const ops = [{ type: 'set', path: 'site/public', data: { ...publicDoc(db), productsVersion: db.productsVersion } }];
    db.products.forEach(p => ops.push({ type: 'set', path: 'products/' + p.id, data: clean(p) }));
    PRIVATE.forEach(k => (db[k] || []).forEach(r => ops.push({ type: 'set', path: k + '/' + r.id, data: clean(r) })));
    await commit(ops);
  }
  async function pull() {
    const db = SCJ.db;
    const pub = await st.fs.doc('site/public').get();
    if (!pub.exists) { if (st.admin) await pushAll(); return; } // first owner sign-in publishes the starting data
    const d = pub.data();
    PUBLIC.forEach(k => { if (d[k] !== undefined && d[k] !== null) db[k] = k === 'settings' ? { ...db.settings, ...d.settings, adminHash: db.settings.adminHash } : d[k]; });
    const ver = d.productsVersion || 0;
    if (ver !== db.productsVersion) { // products are only downloaded again after the owner changes them
      const qs = await st.fs.collection('products').get();
      db.products = qs.docs.map(x => x.data()).sort((a, b) => (b.created || 0) - (a.created || 0));
      db.productsVersion = ver;
    }
    if (st.admin) await pullPrivate();
    SCJ.saveLocal();
  }

  async function push() {
    if (!st.on || !st.snap) return;
    const db = SCJ.db; let ops = [];
    if (st.admin) {
      const pub = publicDoc(db), prodOps = diff('products', db.products);
      if (prodOps.length) { db.productsVersion = Date.now(); pub.productsVersion = db.productsVersion; }
      if (JSON.stringify(pub) !== st.snap.public || prodOps.length) ops.push({ type: 'set', path: 'site/public', data: pub, merge: true });
      ops = ops.concat(prodOps);
      PRIVATE.forEach(k => { ops = ops.concat(diff(k, db[k])); });
    } else PRIVATE.forEach(k => { ops = ops.concat(diff(k, db[k], true)); });
    if (!ops.length) return;
    await commit(ops);
    SCJ.saveLocal(); snapshot(db); st.error = '';
  }
  function queuePush() {
    st.queue = st.queue.then(push).catch(e => {
      st.error = e.message || String(e); console.warn('Online save failed', e);
      document.dispatchEvent(new CustomEvent('scj:cloud-error', { detail: st.error }));
    });
    return st.queue;
  }

  async function init() {
    if (!CFG || !CFG.apiKey) return;
    try {
      await loadScript(SDK + 'firebase-app-compat.js');
      await Promise.all([loadScript(SDK + 'firebase-firestore-compat.js'), loadScript(SDK + 'firebase-auth-compat.js')]);
      firebase.initializeApp(CFG);
      st.fs = firebase.firestore(); st.auth = firebase.auth(); st.on = true;
      await new Promise(res => { const off = st.auth.onAuthStateChanged(u => { off(); st.admin = isAdminUser(u); res(); }); });
      await pull();
    } catch (e) { st.error = e.message || String(e); console.warn('Online database unavailable — using saved data', e); }
    snapshot(SCJ.db);
  }

  SCJ.onSave(queuePush);
  SCJ.cloud = {
    get on() { return st.on; },
    get admin() { return st.admin; },
    get error() { return st.error; },
    flush: () => st.queue,
    async signIn(email, password) {
      const cred = await st.auth.signInWithEmailAndPassword(email, password);
      if (!isAdminUser(cred.user)) { await st.auth.signOut(); throw new Error('This account is not allowed to manage the store.'); }
      st.admin = true; await pull(); snapshot(SCJ.db);
    },
    async signOut() { await st.queue; await st.auth.signOut(); st.admin = false; },
    resetPassword: email => st.auth.sendPasswordResetEmail(email),
    async refresh() { await st.queue; await pull(); snapshot(SCJ.db); }
  };
  // Admin waits for the full sync; visitors wait at most 5 s, then the cached data is used.
  SCJ.cloudReady = init();
  SCJ.ready = Promise.race([SCJ.cloudReady, new Promise(r => setTimeout(r, 5000))]);
})();
