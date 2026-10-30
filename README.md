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
assets/img/logo/        seal, wordmarks, monograms
assets/img/photos/      campaign photography (web-sized)
apps-script/            Google Apps Script for the enquiry form (Sheet + email)
```

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
- **New photos**: add them to `assets/img/photos/` at about 1400px on the long edge.

## Run locally

Any static server works, for example:

```
npx serve .
```
