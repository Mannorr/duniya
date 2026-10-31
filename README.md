# DÚNÍYÀ

Website for DÚNÍYÀ, a Christian clothing house in Lagos making Afro-modern, minimal tailoring, made to measure.

## Structure

```
index.html              Home: hero, statement, looks rail, features, page links
house.html              The House: meaning, values, origin, worldview, women's expression
collection.html         Collection: every look, filters, detail view with extra angles
lookbook.html           Lookbook: the collection in six acts, from the shoot plan
craft.html              Craft: annotated close-ups, fabrics, recognition principles, process
order.html              Order: steps, WhatsApp, measurements, questions
assets/css/styles.css   shared styles (brand tokens at the top)
assets/js/main.js       collection data, lightbox, hotspots, menu, WhatsApp
assets/js/salon.js      the Salon: draggable field of cutout figures (home + collection)
assets/img/cutouts/     transparent WebP cutouts used by the Salon
assets/img/logo/        seal, wordmarks, monograms
assets/img/photos/      campaign photography (web-sized)
apps-script/            Google Apps Script for the enquiry form (Sheet + email)
assets/fonts/           brand fonts, self-hosted (SIL Open Font License)
404.html                not-found page
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

- **Collection looks** live in the `LOOKS` array at the top of `assets/js/main.js`. Each look has a main photo (`img`) and extra angles (`alt`) shown on hover and in the detail view. Its size in the editorial grid is set in `LAYOUT` just above.
- **WhatsApp number**: set `WHATSAPP_NUMBER` at the top of `assets/js/main.js` (digits with country code, e.g. `2348012345678`). Every "Order" and "Enquire" button then opens WhatsApp with a message naming the look.
- **Enquiry form**: follow [`apps-script/README.md`](apps-script/README.md), then paste the Web app URL into `FORM_ENDPOINT` at the top of `assets/js/main.js`.
- **The Salon**: which looks appear, and which cutouts belong to each, is set in `ENTRIES` at the top of `assets/js/salon.js`. To add a cutout, export a transparent PNG from Photoshop, convert it to WebP at about 900px tall into `assets/img/cutouts/cut-<number>.webp`, and add its relative height to `H`.
- **New photos**: add them to `assets/img/photos/` at about 1400px on the long edge.

## Run locally

Any static server works, for example:

```
npx serve .
```
