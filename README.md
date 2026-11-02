# Sri Chandana Jewellers — Website + Admin Panel

A premium jewellery storefront for Sri Chandana Jewellers, Parvathipuram, with a built-in admin console.
Plain HTML/CSS/JS — no build step.

## Run it

```bash
python -m http.server 5500
```

Then open http://localhost:5500 (site) and http://localhost:5500/admin.html (admin).

## Admin login

- URL: `admin.html` (also linked as "Staff Login" in the footer)
- Default password: ask the store owner (not stored in this public file).
- **Change it immediately** under Admin → Settings → Change Admin Password.

## Pages

| Page | What it does |
|---|---|
| `index.html` | Home: hero slider, live gold rate, categories, collections, trending tabs, new arrivals, bridal studio, budget/gender shopping, reviews, store map, gallery |
| `shop.html` | Listing with filters (category, metal, purity, collection, gender, price), sort, shareable URLs |
| `product.html?id=…` | Gallery with zoom, live price breakup (gold value + making + stones + GST), sizes, pincode check, video call / WhatsApp enquiry |
| `checkout.html` | Customer details, pickup or delivery, payment choice — the order is sent to the store WhatsApp (no online payment) |
| `wishlist.html` | Saved designs, share list on WhatsApp |
| `schemes.html` | Monthly savings and gold weight plans (editable in admin), maturity calculator, old-gold exchange estimator, enrolment form |
| `stores.html` | Store info + map, our story, policies, FAQ, contact form |
| `admin.html` | Dashboard, gold rate (live or manual), ornaments & prices, gold schemes (plans + member passbooks), homepage banners, settings & backup |

## How pricing works

Price = weight × today's rate (by purity) + making % + stone value + 3% GST.

**Automatic gold rate (on by default):** the site reads the live international gold and silver price in rupees from gold-api.com (free, no key), converts it per gram and adds the store premium (import duty + margin, default 6% gold / 8% silver). 22K = 91.6% of 24K, 18K = 75%. The price is refreshed every 30 minutes. Adjust or switch it off in Admin → Gold Rates. If the live price can't be loaded, the manual rates saved in admin are used.

## Store details (already filled in)

- Founder: Sri Ananda Rao · Established 30 November 2007
- Address: Parvathipuram – Palakonda Road, near Sri Vasavi Kanyaka Parameshwari Temple, Parvathipuram, AP 535501
- Phone / WhatsApp: 91210 79916 · Email: sankamadhu1975@gmail.com · Hours: 10:30 AM – 8:30 PM
- Instagram: @sri_chandana_jewellers5 · Google rating shown: 4.5★ from 16 reviews (update the numbers in `index.html` as reviews grow)
- Logo and founder photo: `assets/`

All of these can be changed in Admin → Settings.

## Daily routine for the owner

1. Open `admin.html` and sign in.
2. Gold rate is automatic. Once, compare the Dashboard rate with the shop's board rate and adjust the **premium %** in Admin → Gold Rates until they match. To set rates by hand instead, switch **Automatic** off and type them.
3. **Gold Schemes** → *Members & Payments*: add walk-in members, press **+ Payment** for each instalment, open the passbook to print it, or send a WhatsApp reminder. *Scheme Plans*: edit the plans shown on the website.

## Before going live — important

1. **GSTIN**: still empty (hidden on the site). Add it in Admin → Settings.
2. **Gold rate premium**: check the automatic rate against the store's board rate and tune the premium in Admin → Gold Rates.
3. **Your own product photos**: demo products use free-licence photos from Unsplash (unsplash.com/license). Replace them with photos of your actual stock in Admin → Products.
4. **Scheme terms**: bonus and making-charge wording on the Gold Schemes page is general ("up to one instalment"). Confirm the exact terms with the store and edit them in Admin → Gold Schemes → Scheme Plans.
5. **Online database**: built in (Firebase, free plan) but not switched on until you follow **SETUP-FIREBASE.md** (about 15 minutes). After that the owner signs in with email + password, and every change reaches all customers. Until then, changes stay in the browser they were made in and the local admin password below is used. Online payment (Razorpay / PhonePe) is not added.
6. **Domain**: `srichandanajewellers.in` was unregistered on 2 Nov 2026 (`.com` is taken).

Customer orders, store-visit bookings, contact messages and update sign-ups open WhatsApp to the store number set in Admin → Settings; they are not stored in the admin.
