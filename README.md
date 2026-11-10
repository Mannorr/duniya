# DÚNÍYÀ

Website for DÚNÍYÀ, a Christian clothing house in Lagos making Afro-modern, minimal tailoring, made to measure.

## Structure

```
index.html              Home: hero, introduction, salon, ways to order, page links
house.html              The House: what DÚNÍYÀ is and how it works
collection.html         Collection: salon, categorised catalogue, product detail, WhatsApp enquiry
lookbook.html           Lookbook: the collection in six acts, from the shoot plan
craft.html              Craft: annotated details, materials, how a piece is made
order.html              Order: five steps, WhatsApp topics, enquiry form, questions
assets/css/styles.css   shared styles (brand tokens at the top)
assets/js/main.js       collection data, lightbox, hotspots, menu, WhatsApp
assets/js/salon.js      the Salon: draggable field of cutout figures (home + collection)
assets/img/cutouts/     transparent WebP cutouts used by the Salon
assets/img/logo/        seal, wordmarks, monograms
assets/img/photos/      campaign photography (web-sized)
apps-script/            Google Apps Script for the enquiry form (Sheet + email)
assets/fonts/           brand fonts, self-hosted (SIL Open Font License)
404.html                not-found page
tools/build_pages.py    builds all pages (layout and copy)
vercel.json, _headers   clean URLs and security headers for Vercel / Cloudflare Pages / Netlify
```

## Addresses

Links have no `.html`: `/house`, `/collection`, `/order?look=Onyx#enquire`. GitHub Pages, Vercel, Cloudflare Pages and Netlify all serve `house.html` for `/house`. Keep the files named `*.html`; only the links drop the extension.

## Analytics

Vercel Web Analytics loads automatically on the Vercel site and your custom domain (`assets/js/main.js`, near the end). It is cookie-free and served from the site's own domain, so no consent banner or extra security exceptions are needed. It does not load on GitHub Pages or locally. Turn it on in Vercel: project → Analytics → Enable.

## Security

- **In every page:** a Content Security Policy that only allows this site's own files, plus the Google Apps Script form endpoint. No third-party scripts, fonts or trackers.
- **From the host (`vercel.json` / `_headers`):** the same policy plus HSTS, no framing (clickjacking), `nosniff`, a strict referrer policy and a locked-down permissions policy. GitHub Pages cannot send headers, so these apply once the site moves to Vercel, Cloudflare Pages or Netlify.
- **Form back end:** hidden spam field, too-fast submissions ignored, duplicate and flood limits, formula-injection protection, and limits so the form cannot be used to spam other people's inboxes.
- If you add a new outside service (analytics, embed, payment), add its domain to the policy in all three places: the `<meta>` tag in each page, `vercel.json` and `_headers`.

## Brand tokens

| Token | Value |
|---|---|
| Forest | `#0F3D2E` |
| Cream | `#F4EDE2` |
| Copper | `#B87333` |

Type: Gloock (display), Cormorant Garamond italic (accent), Jost (body).

## Editing

### Pages
Page layout and copy live in `tools/build_pages.py`. Edit it, then run `python3 tools/build_pages.py` to rebuild every `.html` page. Don't edit the `.html` files directly; the next build will overwrite them.

### The catalogue
Products live in `PRODUCTS` at the top of `assets/js/main.js`. The collection page, the product detail view, the salon, the enquiry form and every WhatsApp product link read from it.

| Field | Meaning |
|---|---|
| `status` | `"ready"` shown with its price · `"hidden"` not published anywhere. Customers never see these labels. |
| `cat` / `sub` | `women`, `men` or `commission`, and the type (Dresses, Tops, Shirts, Trousers, Shorts, Two-piece sets). Empty types are not shown. |
| `fabric` | Only a documented fabric. `null` shows "Confirmed when you enquire". |
| `colour` | As photographed. |
| `parts` | The garments in the design, which decide the measurement fields on the order form: `"top"`, `"trousers"`, `"dress"`. A two-piece is `["top","trousers"]`. |
| `sleeves` | `false` for sleeveless tops and dresses (no sleeve-length field). |
| `img`, `alt` | Photos in `assets/img/photos/` (without `.jpg`). |
| `with` | Other products shown in the same photographs. |

Prices are set by garment type in `PRICES` (shirt/top, trousers, dress, two-piece set) and `PAIR_PRICE` (any two pieces ordered together), near the top of `main.js`. A design's type comes from its `sub` (Dresses, Tops, Shirts, Trousers, Two-piece sets). Measurement fields per garment are in `MEASURE`. To withdraw a design: set `status` to `"hidden"`.

### The salon
Which figures appear, and which products each shows, is set in `ENTRIES` at the top of `assets/js/salon.js`. Figures whose products are all hidden are skipped automatically.

### WhatsApp and the form
- **WhatsApp number**: `WHATSAPP_NUMBER` in `assets/js/main.js`. Product buttons send a message naming the design and linking to it; general messages are in `WA_TOPICS`.
- **Enquiry form**: see [`apps-script/README.md`](apps-script/README.md). The form's endpoint is `FORM_ENDPOINT` in `assets/js/main.js`.
- **New photos**: add them to `assets/img/photos/` at about 1400px on the long edge.

## Run locally

Any static server works, for example:

```
npx serve .
```

## Brand guidelines page (unlisted)

`/brand` shows the visual identity (logo, colour, typography, imagery, voice) and offers the logo pack (`assets/brand/`). It is not linked from any page, is marked `noindex` (meta tag and `X-Robots-Tag` header), and is not cached. Anyone with the address can open it, and because this repository is public the files can also be found here. The Foundation section of the full PDF (purpose, values, worldview) is deliberately not published.
