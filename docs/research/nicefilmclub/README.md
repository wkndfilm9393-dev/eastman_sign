# Nice Film Club: site teardown

Competitive research on https://nicefilmclub.com, a mail-in and drop-off film lab in Williamsburg, Brooklyn. Captured 2026-10-25 from the public site: HTTP headers, the production JS/CSS bundles, `robots.txt`, `sitemap.xml`, and headless-Chromium renders at 1440 px and 390 px.

This is a reference only. Do not copy their copy, photography or fonts. Eastman keeps its own palette and type from `BRAND.md`.

Screenshots: `scroll-contact-sheet.jpg` (product page while scrolling), `product-page-mobile.jpg`, `pricing-desktop.jpg`.

## 1. Tech stack

| Layer | What it is | Evidence |
|---|---|---|
| Frontend | React single-page app built with Create React App (webpack 4 chunk naming, `REACT_APP_*` env vars). The server sends an empty `<div id="root">` and the client renders everything. | `/static/js/main.<hash>.chunk.js` (about 1 MB) plus a vendor chunk (about 1.2 MB) |
| UI kit | MUI (Material UI) with Emotion, plus CSS Modules (`Component_class__hash`) | `@mui` and `emotion` in the bundle; class names like `OpenAIMeasurementConsent_notice__ftmM3` |
| State and data | Redux and axios. A single request wrapper prefixes every call with `https://api-production.nicefilmclub.com/api` and sends a Bearer token kept in `localStorage`. | Request wrapper in the main chunk |
| Realtime | WebSocket to the same API host, used for cart sync and product "drop" stock (`productId:dropKey`). There's a kill switch, `REACT_APP_REALTIME_CART_SYNC_DISABLED`. | `"…/api".replace(/^http/,"ws")` |
| Hosting | Firebase Hosting on Fastly in front of an Express app on Google Cloud Functions or Cloud Run. Cached for 1 h in the browser and 24 h at the edge, with 7-day stale-while-revalidate. | Headers `server: Google Frontend`, `x-powered-by: Express`, `function-execution-id`, `x-fh-requested-host`, `x-served-by: cache-iad…` |
| SEO rendering | A prerender service: the page sets `window.prerenderReady` once `#root` has children, with a 5 s fallback. The Express layer injects per-route `<title>`, OG and Twitter tags. | Inline script in `<head>` |
| Media | Static marketing media in the GCS bucket `storage.googleapis.com/nicefilmclub-public/…` (webp posters, mp4 hero video). Customer and product media come from `cdn.nicefilmclub.com` through Google Cloud CDN signed URLs (`Expires`, `KeyName`, `Signature`). | Hero preload; product image URLs |
| Payments | Stripe (`js.stripe.com`), Apple Pay merchant domain association, saved payment methods (`/account/payment-method-setup`), and subscriptions for memberships | Bundle and `<link>` in `<head>` |
| Shipping | References to Shippo and EasyPost, probably for prepaid mail-in labels | Bundle strings |
| Anti-bot | Cloudflare Turnstile | `REACT_APP_TURNSTILE_SITE_KEY` |
| Analytics and ads | GA4 (loaded lazily, `send_page_view:false`, so page views are sent by hand), GTM, Meta Pixel, and an OpenAI ads measurement consent banner with an `obref` click ID | `<head>` scripts and a consent component |
| Other | Swiper carousels, moment.js, lodash, JSZip (bulk scan downloads), Google Maps (locations), an iOS app on the App Store, and a blog at `notes.nicefilmclub.com` | Bundle strings |

They spent their effort on the backend and growth tooling, not the frontend. It's a plain CRA build with 2 MB+ of JS and no server rendering, and the SEO gap is covered by a prerender service.

## 2. Information architecture

`sitemap.xml` has 560 URLs:

| Group | Count | What it is |
|---|---|---|
| `/film/*` | 295 | Film stock catalogue pages (`/film/:slug`, `/film/brand/:brandSlug`), an SEO and content play |
| `/products/*` | 170 | Shop: dev and scan, digital and giclée prints, darkroom hand prints, gift cards, events |
| `/film-developing-<city or state>` | 51 in the sitemap, about 90 in the router | Programmatic local-SEO landing pages for the top US cities and states, plus "near me" and "by mail" variants |
| `/vs/:competitor` | 7 | Comparison pages: The Darkroom, CVS, Walgreens, Costco, Walmart, Sam's Club, Mpix |
| `/collections/*` | 9 | Bundles, events and workshops, member contests, darkroom services |
| Question pages | about 10 | Long-tail queries, such as "where can you send film to be developed" or "best 35mm film" |
| Core | about 15 | `/`, `/lab`, `/club`, `/pricing`, `/memberships/purchase`, `/locations`, `/about`, `/frequently-asked-questions`, `/scanning`, auth and legal pages |

`robots.txt` names AI crawlers one by one (GPTBot, ClaudeBot, PerplexityBot, Google-Extended and others) and allows them, because they want to show up in AI search answers.

**App routes** (all in one bundle):
- **Customer:**
  - Orders: `/orders/new`, `/checkout`, `/users/:id/orders/:orderId` (plus `/summary` and `/return-negatives-form`)
  - Scans: `/users/:id/rolls/:rollId` and `/digital-contact-sheet`
  - Albums and gallery: `/users/:id/albums`, `/gallery/:imageId`
  - Prints: `print-orders`, `small-print-orders`
  - Other: `referrals`, `settings`
  - Public sharing: `/shared-scans/:scanCode`, `/albums/:code`, `/quotes/:publicId`
- **Programs:**
  - `/nice-scholars`, a student discount with email-token verification
  - `/vendor-orders`, for B2B or wholesale
  - affiliation reviews, influencer codes (`influencer_code`) and referrals
- **Admin** (shipped in the public bundle):
  - Orders: orders, outstanding orders
  - Catalogue: products, variants, collections, promos, quotes
  - Customer service: a CS inbox with conversations and a knowledge base
  - Logistics: messengers with printable routes (their own courier pickup and delivery)
  - Marketing: events, member contests, social submissions, a social-intelligence suite
  - Dashboards: roll-events and e-commerce

## 3. Business model as the site shows it

- **One hero product:** "Film Development & Scanning", sold as a configurable product. The steps are:
  1. Process: C-41, B&W, E-6 or ECN-2
  2. Scan quality: Standard 1K, 2K or 4K, or Pro (hand-edited)
  3. Sleeving: none, cut or uncut
  4. Prints
- **Membership tiers:** On Demand, then Nice, Very Nice and Super Nice, plus a "Nice Monthly Lite" subscription. Annual plans bundle roll credits. The homepage has a plan finder: you pick how many rolls you shoot a year (30, 50 and up) and which add-ons you need, and it recommends a tier.
- **Platform lock-in:** members get unlimited online hosting of their scans, digital contact sheets, albums, share links and an iOS app. The lab is the hook and the platform is what keeps people.
- **Upsells:** prints (digital, giclée, color and B&W darkroom hand prints), gift cards, bundles, workshops and events.
- **Acquisition:** a 10%-off email popup on first visit, referrals and influencer codes, local SEO pages, comparison pages, and "Cameras & Coffee" community meetups.

## 4. Design language

**Fonts** (custom, served from `/static/media/*.woff2`):
- `Nice Nineties`, regular and italic: a soft, high-contrast retro serif used for headlines. The italic is the signature "voice" ("*The Process*", "*Our Services*", "*Get 10% off…*").
- `NiceGrotesk Regular`, registered under the family name **"Inter"**, so CSS that asks for Inter gets their grotesk. Body text: 12 px, letter-spacing 0.8 px.
- `NiceGrotesk Extended` and `Bold Extended`: small uppercase labels with wide tracking (`DEVELOPMENT & SCANNING`, 20 px, letter-spacing 2 px) and the "NICE" wordmark.

**Colors**:

| Hex | Role |
|---|---|
| `#E96A3E` | Accent orange: theme color, primary buttons, the "Join Nice" pill |
| `#3A2F29` | Ink: a warm espresso brown, used for body text and dark section backgrounds. They never use pure black. |
| `#FEFEF6` | Paper: warm off-white, used for text on dark and for card fills |
| `#FBFBFA`, `#F0EFEC` | Light neutral panels and disabled buttons |
| `#9C9288` | Muted warm grey (secondary text, frosted button fills at 24% opacity) |

**Layout and components**:
- A floating pill nav: a blurred, translucent bar inset from the viewport edges with a 25 px radius. The links are separated by small dots, with a round account button and an orange "Join Nice" pill on the right.
- Full-bleed hero: a looping mp4 with a webp poster preloaded at 720 w and 1440 w, a light-weight serif headline (300 weight) in paper color, and two pill CTAs.
- Pill buttons everywhere (`border-radius: 100px` or `48px`), 12 px, weight 500, either outline or filled.
- Large rounded media cards (about 16 to 24 px radius) with big numbered steps (1, 2, 3) for "The Process", which explains the order flow with phone mockups.
- Sections alternate between paper and espresso backgrounds. "Our Services" is a dark band with a 96 px italic serif title, alternating image and text rows, and a small orange rule above each label.
- The product page has a sticky "Add to Cart" bar (name, price per roll, quantity stepper) and spec chips (Formats, Scans, Shipping, Advanced orders) above a builder of segmented option chips. Dark chips mark the selection.
- A social-proof carousel (Swiper) mixes customer quotes with Instagram handles and YouTube embeds.
- Other parts: an FAQ accordion, a "Drop Offs & Shipping" card, and an orange-to-brown gradient footer with SEO link lists.
- There are two breakpoints, `768px` and `480px`. On mobile the stack goes to one column and the nav collapses to a "Menu" button.

## 5. What Eastman can take from it

Patterns worth adapting to Eastman's own brand: orange `#F6853D` and black, Helvetica Neue Bold, Pretendard for Korean and prices.

1. **Sell one configurable product.** Build dev and scan as process → scan resolution → add-ons, with a sticky price bar. Eastman's signage already lists C-41 dev and scan, so the website and menu signs can share the same option names.
2. **Show the process in three numbered steps** (drop off or ship → we develop and scan → get your images). It works on a website and also as an in-store or window sign.
3. **Use the scan platform for retention.** Hosted galleries, contact sheets and share links (`/shared-scans/:code`) are a cheap way to keep customers once you're already delivering JPEGs. Eastman signs already point to a QR code, and that QR could open the customer's roll gallery.
4. **Local SEO pages** in Korean and English (for example 필름 현상 + neighbourhood or city names), plus pages answering common questions. Server-render them; don't copy the empty-SPA plus prerender setup.
5. **Membership with roll credits** if volume supports it, kept to two or three tiers.
6. **Avoid their weaknesses:** a 2 MB+ client bundle, the admin routes shipped in the public JS, and a 10% email popup that covers the hero on the very first frame.

## Method notes

- `curl` gets the HTML shell, bundles and sitemap. The visible content needs a JS-capable browser (Playwright and Chromium were used).
- Route lists come from `path:"…"` strings in the main chunk, and the API base from `REACT_APP_API_TARGET`. No authenticated or admin endpoints were called.
