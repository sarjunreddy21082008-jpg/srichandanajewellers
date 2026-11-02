# Put the store online (Firebase — free)

Once this is done, the owner's changes in the admin panel (products, banners, scheme plans, settings, manual rates) are seen by every customer, and orders, appointments, enquiries and scheme sign-ups from the website reach the owner's admin on any computer.

Takes about 15 minutes. You need a Google account. The free **Spark** plan is enough; no card required.

## 1. Create the project
1. Go to https://console.firebase.google.com and sign in.
2. **Create a project** → name it `sri-chandana-jewellers` → Google Analytics can be turned off → **Create**.

## 2. Turn on the database
1. Left menu → **Build → Firestore Database** → **Create database**.
2. Location: **asia-south1 (Mumbai)** → **Start in production mode** → **Create**.

## 3. Turn on email sign-in and add the owner
1. **Build → Authentication** → **Get started** → **Email/Password** → enable → **Save**.
2. **Users** tab → **Add user** → email `sankamadhu1975@gmail.com` and a strong password the owner will remember. (The owner types this password themselves; don't share it in chats.)
   Using a different email? Change it in step 4 and step 5 as well.

## 4. Publish the security rules
1. **Firestore Database → Rules**.
2. Delete what's there, paste everything from `firestore.rules` in this folder, then **Publish**.
   These rules let anyone *read* the shop's products and rates, let customers *send* orders and enquiries, and let only the owner's email see or change anything else.

## 5. Connect the website
1. Project overview (gear icon) → **Project settings** → **Your apps** → click the **</>** (Web) icon → nickname `website` → **Register app**.
2. Firebase shows a `firebaseConfig = { ... }` block. Open `js/firebase-config.js` and replace `window.SCJ_FIREBASE = null;` with:
   ```js
   window.SCJ_FIREBASE = {
     apiKey: '…', authDomain: '…', projectId: '…',
     storageBucket: '…', messagingSenderId: '…', appId: '…',
     adminEmails: ['sankamadhu1975@gmail.com']
   };
   ```
   (Copy the six values from Firebase. These values are safe to be public — the rules from step 4 are what protect the data.)

## 6. First sign-in
1. Open `admin.html`. The sign-in page now asks for **email and password**, and the top bar shows a green **Online** label.
2. Sign in as the owner. On the very first sign-in, the current products, banners and settings are uploaded automatically.
3. Check: open the website on a phone, then change something in admin (e.g. a banner title) and refresh the phone — it updates.

Forgot the password? On the sign-in page, press **Forgot password?** and a reset link is emailed.

## 7. Put it on the internet (optional, also free)
Firebase Hosting can serve this folder:
1. Install Node.js, then in this folder run `npm install -g firebase-tools`, `firebase login`, `firebase init hosting` (choose the project, public directory `.`, single-page app **No**), then `firebase deploy`.
2. You get `https://sri-chandana-jewellers.web.app`.
3. To use **srichandanajewellers.in**: buy it from a registrar (GoDaddy, Hostinger, BigRock etc. — about ₹600–900/year), then Hosting → **Add custom domain** and add the DNS records Firebase shows at the registrar.

## Good to know
- **Free limits:** 50,000 reads and 20,000 writes a day, 1 GB stored — plenty for a single showroom.
- **Product photos** uploaded in admin are shrunk automatically. Keep it to 3–4 photos per product; a product that is too large shows a "Not saved online" message.
- **Gold rate:** the automatic rate comes from the live market in each visitor's browser, so it works with or without Firebase. The premium % you set in admin is saved online and applies to everyone.
- **Backup:** Admin → Settings → Download backup still works; do it monthly.
