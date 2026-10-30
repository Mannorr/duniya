# DÚNÍYÀ

Website for DÚNÍYÀ, a Christian clothing house in Lagos making Afro-modern, minimal tailoring, made to measure.

## Structure

```
index.html              single-page site
assets/css/styles.css   all styles (brand tokens at the top)
assets/js/main.js       collection cards, filters, menu, copy button
assets/img/logo/        wordmark, monogram and seal
assets/img/photos/      campaign photography (web-sized)
```

## Brand tokens

| Token | Value |
|---|---|
| Forest | `#0F3D2E` |
| Cream | `#F4EDE2` |
| Copper | `#B87333` |

Type: Gloock (display), Cormorant Garamond italic (accent), Jost (body).

## Editing

- **Collection looks** live in the `looks` array at the top of `assets/js/main.js`. Each look takes a front image and an optional second angle shown on hover.
- **WhatsApp number** is the `#waNum` element in the ordering section of `index.html`. It is a placeholder until the business number is confirmed.

## Run locally

Any static server works, for example:

```
npx serve .
```
